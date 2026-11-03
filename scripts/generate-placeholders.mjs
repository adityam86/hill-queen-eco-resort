import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'images', 'placeholders');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function generateSvg({
  title,
  subtitle = 'MAMUDI • MURGUMA • PURULIA • WEST BENGAL',
  tag = 'Authentic Photograph Awaiting Owner Upload',
  specs = '',
  iconType = 'camera',
}) {
  let iconPath = '';
  switch (iconType) {
    case 'bed':
      iconPath = `
        <path d="M-28 16 V-6 C-28 -9 -25 -12 -22 -12 H22 C25 -12 28 -9 28 -6 V16 M-28 4 H28 M-28 16 H-24 M28 16 H24" stroke="#C5A880" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M-20 -2 C-20 -5 -17 -7 -14 -7 H-8 C-5 -7 -2 -5 -2 -2 V4 H-20 Z" fill="#C5A880" fill-opacity="0.3"/>
        <path d="M2 -2 C2 -5 5 -7 8 -7 H14 C17 -7 20 -5 20 -2 V4 H2 Z" fill="#C5A880" fill-opacity="0.3"/>
      `;
      break;
    case 'tent':
      iconPath = `
        <path d="M0 -22 L-26 18 H26 Z" stroke="#C5A880" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
        <path d="M0 -22 L-10 18 H10 Z" fill="#C5A880" fill-opacity="0.35"/>
        <path d="M-26 18 L-32 24 M26 18 L32 24" stroke="#C5A880" stroke-width="2" stroke-linecap="round"/>
      `;
      break;
    case 'dining':
      iconPath = `
        <path d="M-12 -18 V-4 C-12 0 -9 3 -5 3 V18 M-16 -18 V-6 M-8 -18 V-6" stroke="#C5A880" stroke-width="2" stroke-linecap="round"/>
        <path d="M10 -18 C6 -18 6 -6 6 -2 C6 2 8 4 10 4 V18" stroke="#C5A880" stroke-width="2" stroke-linecap="round"/>
      `;
      break;
    case 'bath':
      iconPath = `
        <path d="M-24 6 H24 C24 14 18 18 10 18 H-10 C-18 18 -24 14 -24 6 Z" stroke="#C5A880" stroke-width="2" fill="#C5A880" fill-opacity="0.25"/>
        <path d="M-18 6 V-14 C-18 -18 -12 -18 -12 -14" stroke="#C5A880" stroke-width="2" fill="none"/>
        <circle cx="2" cy="-4" r="1.5" fill="#C5A880"/>
        <circle cx="-4" cy="-1" r="1.5" fill="#C5A880"/>
        <circle cx="0" cy="2" r="1.5" fill="#C5A880"/>
      `;
      break;
    case 'mountain':
      iconPath = `
        <path d="M-28 16 L-10 -14 L6 10 L16 -4 L30 16 Z" stroke="#C5A880" stroke-width="2.5" fill="#C5A880" fill-opacity="0.3"/>
        <circle cx="16" cy="-12" r="6" fill="#C5A880" fill-opacity="0.5"/>
      `;
      break;
    case 'flame':
      iconPath = `
        <path d="M0 -20 C6 -10 16 -4 16 6 C16 14 9 20 0 20 C-9 20 -16 14 -16 6 C-16 0 -10 -8 0 -20 Z" stroke="#C5A880" stroke-width="2" fill="#C5A880" fill-opacity="0.3"/>
        <path d="M0 -4 C3 0 7 3 7 8 C7 12 4 15 0 15 C-4 15 -7 12 -7 8 C-7 4 -4 0 0 -4 Z" fill="#E5D3B3" fill-opacity="0.7"/>
      `;
      break;
    case 'parking':
      iconPath = `
        <rect x="-18" y="-18" width="36" height="36" rx="8" stroke="#C5A880" stroke-width="2.5" fill="none"/>
        <path d="M-8 10 V-10 H2 C6 -10 9 -7 9 -3 C9 1 6 4 2 4 H-8" stroke="#C5A880" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      `;
      break;
    case 'play':
      iconPath = `
        <circle cx="0" cy="-12" r="6" stroke="#C5A880" stroke-width="2" fill="#C5A880" fill-opacity="0.3"/>
        <path d="M0 -6 V8 M-12 18 L0 8 L12 18 M-14 0 H14" stroke="#C5A880" stroke-width="2" stroke-linecap="round"/>
      `;
      break;
    case 'camera':
    default:
      iconPath = `
        <path d="M-18 -4 C-18 -7 -15 -9 -12 -9 H-8 L-6 -14 H6 L8 -9 H12 C15 -9 18 -7 18 -4 V14 C18 17 15 19 12 19 H-12 C-15 19 -18 17 -18 14 Z" stroke="#C5A880" stroke-width="2.5" fill="#C5A880" fill-opacity="0.2"/>
        <circle cx="0" cy="5" r="7" stroke="#C5A880" stroke-width="2" fill="none"/>
      `;
      break;
  }

  return `<svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1200" y2="800" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0E1C18" />
      <stop offset="50%" stop-color="#182B25" />
      <stop offset="100%" stop-color="#10221C" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C5A880" stop-opacity="0.2" />
      <stop offset="50%" stop-color="#E5D3B3" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#C5A880" stop-opacity="0.2" />
    </linearGradient>
    <radialGradient id="glow" cx="600" cy="380" r="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C5A880" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#182B25" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#bgGrad)" />
  <circle cx="600" cy="380" r="400" fill="url(#glow)" />

  <!-- Borders -->
  <rect x="40" y="40" width="1120" height="720" rx="20" stroke="#C5A880" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="6 4" fill="none" />
  <rect x="54" y="54" width="1092" height="692" rx="14" stroke="#C5A880" stroke-opacity="0.15" stroke-width="1" fill="none" />

  <!-- Corner Flourishes -->
  <path d="M70 100 V70 H100" stroke="#C5A880" stroke-width="2" stroke-linecap="round" fill="none" />
  <path d="M1130 100 V70 H1100" stroke="#C5A880" stroke-width="2" stroke-linecap="round" fill="none" />
  <path d="M70 700 V730 H100" stroke="#C5A880" stroke-width="2" stroke-linecap="round" fill="none" />
  <path d="M1130 700 V730 H1100" stroke="#C5A880" stroke-width="2" stroke-linecap="round" fill="none" />

  <!-- Emblem Circle -->
  <g transform="translate(600, 240)">
    <circle cx="0" cy="0" r="64" stroke="#C5A880" stroke-width="2" stroke-opacity="0.6" fill="#14241F" />
    <circle cx="0" cy="0" r="56" stroke="#C5A880" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="3 3" fill="none" />
    ${iconPath}
  </g>

  <!-- Category Title -->
  <text x="600" y="375" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#FAF7EF" text-anchor="middle" letter-spacing="2">
    ${title}
  </text>

  <!-- Subtitle -->
  <text x="600" y="415" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#C5A880" text-anchor="middle" letter-spacing="5">
    ${subtitle}
  </text>

  <!-- Divider -->
  <line x1="450" y1="445" x2="750" y2="445" stroke="url(#goldGrad)" stroke-width="1.5" />

  ${
    specs
      ? `
  <!-- Specs Badge -->
  <text x="600" y="485" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#E5D3B3" text-anchor="middle" letter-spacing="1">
    ${specs}
  </text>`
      : ''
  }

  <!-- Pill Status -->
  <g transform="translate(600, ${specs ? '545' : '520'})">
    <rect x="-210" y="-20" width="420" height="40" rx="20" fill="#12231E" stroke="#C5A880" stroke-opacity="0.55" stroke-width="1" />
    <circle cx="-180" cy="0" r="5" fill="#C5A880" />
    <text x="-165" y="5" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#FAF7EF" letter-spacing="0.5">
      ${tag}
    </text>
  </g>

  <!-- Instruction line -->
  <text x="600" y="${specs ? '615' : '590'}" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" fill="#C5A880" fill-opacity="0.85" text-anchor="middle">
    Original property photographs will be uploaded directly by resort management via the Admin Panel.
  </text>

  <!-- Footer Location -->
  <text x="600" y="715" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" fill="#FAF7EF" fill-opacity="0.4" text-anchor="middle" letter-spacing="3">
    HILL QUEEN ECO RESORT • MAMUDI, MURGUMA DAM, PURULIA
  </text>
</svg>`;
}

const placeholders = [
  // General & Hero
  {
    fileName: 'hero-resort.svg',
    title: 'Hill Queen Eco Resort',
    specs: 'Aerial & Exterior Property View • Surrounded by Hills & Lake',
    iconType: 'mountain',
  },
  {
    fileName: 'about-resort.svg',
    title: 'Hill Queen Eco Resort Cottages',
    specs: 'Tranquil Valley of Mamudi near Murguma Dam, Purulia',
    iconType: 'mountain',
  },

  // Rooms
  {
    fileName: 'double-bedded-room.svg',
    title: 'Double Bedded Room',
    specs: '1 Double Bed • Up to 2 Guests • Attached Western Bath • Air Conditioned',
    iconType: 'bed',
  },
  {
    fileName: 'triple-bedded-room.svg',
    title: 'Triple Bedded Room',
    specs: '1 Double Bed + 1 Single Bed • Up to 3 Guests • Attached Bath • AC',
    iconType: 'bed',
  },
  {
    fileName: 'four-bedded-room.svg',
    title: 'Four Bedded Room',
    specs: '2 Double Beds • Up to 4 Guests • Attached Bath • AC • Family Suite',
    iconType: 'bed',
  },
  {
    fileName: 'five-bedded-room.svg',
    title: 'Five Bedded Room',
    specs: '2 Double Beds + 1 Single Bed • Up to 5 Guests • AC • Room Heater',
    iconType: 'bed',
  },
  {
    fileName: 'tent-accommodation.svg',
    title: 'Tent Accommodation',
    specs: 'Twin Camp Bedding • Weatherproof Canvas • Campfire & Stargazing',
    iconType: 'tent',
  },

  // Facilities
  {
    fileName: 'facility-dining.svg',
    title: 'Resort Dining & Kitchen',
    specs: 'Fresh Regional Bengali Cuisine & Wholesome Home-Style Meals',
    iconType: 'dining',
  },
  {
    fileName: 'facility-bathroom.svg',
    title: 'Modern Attached Washroom',
    specs: 'Western Sanitation • 24/7 Running Water • Geyser Available',
    iconType: 'bath',
  },
  {
    fileName: 'facility-gardens.svg',
    title: 'Open Lawns & Courtyard',
    specs: 'Lush Green Spaces for Morning Strolls & Pure Nature Relaxation',
    iconType: 'mountain',
  },
  {
    fileName: 'facility-kidsplay.svg',
    title: "Children's Play Area",
    specs: 'Safe Outdoor Play Area & Garden Pathways for Families',
    iconType: 'play',
  },
  {
    fileName: 'facility-bonfire.svg',
    title: 'Campfire & Stargazing Ground',
    specs: 'Evening Bonfire Sessions under Clear Starry Purulia Skies',
    iconType: 'flame',
  },
  {
    fileName: 'facility-parking.svg',
    title: 'Secure On-Site Parking',
    specs: 'Dedicated Private Parking for Cars & Bikes with Staff Assistance',
    iconType: 'parking',
  },

  // Gallery Categories
  {
    fileName: 'gallery-resort-exterior.svg',
    title: 'Resort & Exterior',
    specs: 'Property Frontage, Hill Views & Nature Architecture',
    iconType: 'mountain',
  },
  {
    fileName: 'gallery-rooms.svg',
    title: 'Cottages & Room Interiors',
    specs: 'Double, Triple, Four & Five Bedded Living Spaces',
    iconType: 'bed',
  },
  {
    fileName: 'gallery-tent-stay.svg',
    title: 'Tent Stay Experience',
    specs: 'Outdoor Camping, Campfire Grounds & Mountain Breezes',
    iconType: 'tent',
  },
  {
    fileName: 'gallery-dining.svg',
    title: 'Dining & Food Services',
    specs: 'Authentic Local Bengali Thalis & Fresh Preparations',
    iconType: 'dining',
  },
  {
    fileName: 'gallery-facilities.svg',
    title: 'Resort Amenities & Facilities',
    specs: 'Clean Bathrooms, Lawns, Play Area & Parking Spaces',
    iconType: 'bath',
  },
  {
    fileName: 'gallery-nature.svg',
    title: 'Nature & Surroundings',
    specs: 'Murguma Dam, Ajodhya Hills, Bamni Falls & Water Trails',
    iconType: 'mountain',
  },
];

for (const item of placeholders) {
  const content = generateSvg(item);
  fs.writeFileSync(path.join(outDir, item.fileName), content, 'utf8');
  console.log(`Generated: public/images/placeholders/${item.fileName}`);
}

console.log(`\nSuccessfully created ${placeholders.length} tailored SVG placeholders.`);

