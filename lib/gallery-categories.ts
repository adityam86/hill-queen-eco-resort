export const RESORT_GALLERY_CATEGORIES = [
  'Resort & Exterior',
  'Rooms',
  'Tent Stay',
  'Dining',
  'Facilities',
  'Nature & Surroundings',
] as const;

export type ResortGalleryCategory = (typeof RESORT_GALLERY_CATEGORIES)[number];
