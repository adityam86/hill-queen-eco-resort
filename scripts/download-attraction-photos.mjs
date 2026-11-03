import fs from 'fs';
import path from 'path';
import https from 'https';

const attractionPhotos = [
  {
    name: 'murguma-dam.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Murguma_Dam_01.jpg',
  },
  {
    name: 'bamni-falls.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bamni_falls.jpg',
  },
  {
    name: 'marble-lake.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Marble_lake.jpg',
  },
  {
    name: 'ppsp-upper-dam.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Ajodhya_Hill_Upper_Dam%2C_Baghmundi%2C_Purulia.jpg',
  },
  {
    name: 'ppsp-lower-dam.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Ajodhya_Hill_Upper_Dam_in_Baghmundi_01.jpg',
  },
  {
    name: 'charida-village.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Chhau_Mask_of_Charida.jpg',
  },
  {
    name: 'khairabera-dam.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Ajodhya_Chemtaburu_Hill_-_Khairabera_Dam.jpg',
  },
  {
    name: 'pakhi-pahar.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Pakhi_Pahar_in_Purulia.jpg',
  },
  {
    name: 'deulghata-temple.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Deulghata_6.jpg',
  },
  {
    name: 'ajodhya-hills.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Ajodhya_Purulia_05.jpg',
  },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(process.cwd(), destPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(fullPath);
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'HillQueenEcoResort/1.0 (contact@hillqueenecoresorts.com; Windows NT 10.0)',
          Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https
            .get(
              res.headers.location,
              {
                headers: {
                  'User-Agent': 'HillQueenEcoResort/1.0 (contact@hillqueenecoresorts.com; Windows NT 10.0)',
                },
              },
              (redirectRes) => {
                redirectRes.pipe(file);
                file.on('finish', () => file.close(() => resolve(destPath)));
              }
            )
            .on('error', (err) => {
              fs.unlink(fullPath, () => {});
              reject(err);
            });
        } else if (res.statusCode === 200) {
          res.pipe(file);
          file.on('finish', () => file.close(() => resolve(destPath)));
        } else {
          fs.unlink(fullPath, () => {});
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      }
    );
    req.on('error', (err) => {
      fs.unlink(fullPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading verified authentic attraction photographs from Wikimedia Commons...');
  for (const item of attractionPhotos) {
    const dest = path.join('public', 'images', 'attractions', item.name);
    try {
      await downloadFile(item.url, dest);
      console.log(`✓ Saved: ${dest}`);
    } catch (e) {
      console.error(`✗ Error downloading ${item.name}:`, e.message);
    }
  }
  console.log('\nAll attraction photos downloaded to local storage.');
}

run();
