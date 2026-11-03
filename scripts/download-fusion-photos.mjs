import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // Rooms
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766140239/room/1291/kk12uawsodcjszmathmj.jpg',
    dest: 'public/images/rooms/double-bedded-room.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148931/property/1681/fmows9mf6wys8dnwucvo.jpg',
    dest: 'public/images/rooms/double-bedding.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766142007/room/1295/btix3ldfqw5fjxj6vcw3.png',
    dest: 'public/images/rooms/triple-bedded-room.png',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757149431/property/1681/ebbpu0tgllitabz8aq6a.jpg',
    dest: 'public/images/rooms/triple-bedding.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766140553/room/1292/sapaiwla6ucutnmlub9j.jpg',
    dest: 'public/images/rooms/four-bedded-room.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757149492/property/1681/nlhtuuj3bteh3hcql3er.jpg',
    dest: 'public/images/rooms/four-bedding.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757150251/property/1681/x3xwgt8jzhmsff3onkzi.jpg',
    dest: 'public/images/rooms/four-perspective.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766141209/room/1293/dfxgqeuckjecp0hfjmae.png',
    dest: 'public/images/rooms/five-bedded-room.png',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766139915/room/1290/wz2jfnidnp9ajvozaoin.jpg',
    dest: 'public/images/rooms/tent-accommodation.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160095/property/1681/ponaqgpem2bp44ppihaj.png',
    dest: 'public/images/rooms/lawn-tent.png',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160554/property/1681/g5hqfygdt6mcvqcrq4ve.jpg',
    dest: 'public/images/rooms/tents-cottages.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159836/property/1681/oxyynrssknojbs0o55ln.jpg',
    dest: 'public/images/rooms/tent-interior.jpg',
  },

  // Resort Exterior & Scenery
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1789021168/property/1681/amrfgp0bcx2safe9zrhe.jpg',
    dest: 'public/images/resort/hero-aerial.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148135/property/1681/dpdh7fib0zdhqmqkf0bx.jpg',
    dest: 'public/images/resort/resort-front.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1789021166/property/1681/koxysnfsdnlbivueazwi.jpg',
    dest: 'public/images/resort/cottages-nature.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148303/property/1681/idav04rvlglak4qzbkbz.jpg',
    dest: 'public/images/resort/valley-panorama.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148858/property/1681/ih5j3evg6b3apr3516yl.jpg',
    dest: 'public/images/resort/hill-view.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757149805/property/1681/acjuz3qey51j5lqhnlvm.jpg',
    dest: 'public/images/resort/murguma-landscape.jpg',
  },

  // Facilities
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757151762/property/1681/wnvom3wvc0pgxgdoki1p.jpg',
    dest: 'public/images/facilities/dining.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159995/property/1681/oajowwhxeypksme0atus.jpg',
    dest: 'public/images/facilities/bathroom.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160248/property/1681/zqcxn3zpunipmz33tjc8.jpg',
    dest: 'public/images/facilities/lawns.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160188/property/1681/u6vhqsmxlfcfkjxber0h.jpg',
    dest: 'public/images/facilities/kids-play.jpg',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160095/property/1681/ponaqgpem2bp44ppihaj.png',
    dest: 'public/images/facilities/bonfire.png',
  },
  {
    url: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160411/property/1681/sdpnkcqg5tadhtsd4pni.jpg',
    dest: 'public/images/facilities/grounds-layout.jpg',
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
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close(() => resolve(destPath));
          });
        }).on('error', (err) => {
          fs.unlink(fullPath, () => {});
          reject(err);
        });
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(destPath));
        });
      } else {
        fs.unlink(fullPath, () => {});
        reject(new Error(`Failed with status ${response.statusCode}: ${url}`));
      }
    }).on('error', (err) => {
      fs.unlink(fullPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting download of ${downloads.length} authentic FusionStays photographs...`);
  let successCount = 0;
  for (const item of downloads) {
    try {
      await downloadFile(item.url, item.dest);
      console.log(`✓ Saved: ${item.dest}`);
      successCount++;
    } catch (err) {
      console.error(`✗ Error downloading ${item.url}:`, err.message);
    }
  }
  console.log(`\nSuccessfully downloaded ${successCount} / ${downloads.length} genuine photographs.`);
}

run();

