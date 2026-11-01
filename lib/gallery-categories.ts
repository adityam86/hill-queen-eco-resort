export const RESORT_GALLERY_CATEGORIES = [
  'Resort exterior and entrance',
  'Rooms and cottages',
  'Room interiors',
  'Restaurant and dining',
  'Mountain and lake views',
  'Gardens and outdoor areas',
  'Activities and experiences',
  'Nearby tourist attractions',
] as const;

export type ResortGalleryCategory = (typeof RESORT_GALLERY_CATEGORIES)[number];

