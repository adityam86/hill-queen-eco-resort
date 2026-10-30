import { MetadataRoute } from 'next';
import { getResortSettings } from '@/lib/settings';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getResortSettings();
  const baseUrl = settings.websiteUrl || 'https://hillqueenecoresort.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
