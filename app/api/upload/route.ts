import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { getAdminSession } from '@/lib/auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN' && session.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges to upload photographs.' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WebP, and AVIF images are permitted.' },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit of 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes (file signature check)
    const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp = buffer.length > 12 && buffer.toString('utf8', 0, 4) === 'RIFF' && buffer.toString('utf8', 8, 12) === 'WEBP';
    const isAvif = buffer.length > 12 &&
      buffer.toString('utf8', 4, 8) === 'ftyp' &&
      (buffer.toString('utf8', 8, 12) === 'avif' || buffer.toString('utf8', 8, 12) === 'avis');

    if (!isJpeg && !isPng && !isWebp && !isAvif) {
      return NextResponse.json(
        { error: 'File content does not match genuine image signatures (JPG, PNG, WebP, AVIF).' },
        { status: 400 }
      );
    }

    // Prepare upload directory in public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Sanitize extension strictly against allowed list
    const rawExt = path.extname(file.name).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    const ext = allowedExts.includes(rawExt) ? rawExt : '.jpg';

    const baseClean = file.name
      .replace(path.extname(file.name), '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `${Date.now()}-${baseClean}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the photograph.' },
      { status: 500 }
    );
  }
}
