import prisma from './prisma';

export interface ResortSettings {
  id?: string;
  resortName: string;
  tagline: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  phoneTertiary: string;
  whatsappNumber: string;
  email: string;
  websiteUrl: string;
  googleMapsUrl: string;
  checkInTime: string;
  checkOutTime: string;
  heroHeading: string;
  heroSubheading: string;
  aboutText: string;
  seoTitle: string;
  seoDescription: string;
}

export const DEFAULT_SETTINGS: ResortSettings = {
  resortName: "Hill Queen Eco Resort",
  tagline: "Escape Into Nature. Stay Close to Serenity.",
  address: "Mamudi, Murguma, Purulia, West Bengal 723152, India",
  phonePrimary: "9735888106",
  phoneSecondary: "9733713255",
  phoneTertiary: "8670214030",
  whatsappNumber: "9735888106",
  email: "hillqueenecoresort@gmail.com",
  websiteUrl: "https://hillqueenecoresorts.com",
  googleMapsUrl: "https://share.google/yDmE0tmJM7PhlxVlN",
  checkInTime: "11:00 AM",
  checkOutTime: "10:00 AM",
  heroHeading: "Discover Your Peaceful Escape.",
  heroSubheading: "Experience the beauty of nature and a relaxing stay at Hill Queen Eco Resort, Murguma, Purulia.",
  aboutText: `Nestled in the tranquil valley of Mamudi near the scenic Murguma Dam in Purulia, West Bengal, Hill Queen Eco Resort is a peaceful nature retreat designed for travellers seeking rest, clean mountain air, and authentic hospitality. Surrounded by the rolling ridges of the Ajodhya Hills and lush rural landscape, our eco-friendly resort offers comfortable cottage accommodations, home-cooked regional meals, and personalized care. Whether you are seeking a peaceful weekend get-away with family, exploring the hills, or unwinding by the lake, Hill Queen Eco Resort welcomes you to a serene home away from home.`,
  seoTitle: "Hill Queen Eco Resort | Luxury Nature Resort in Murguma, Purulia",
  seoDescription: "Experience peaceful luxury at Hill Queen Eco Resort in Mamudi, Murguma, Purulia, West Bengal 723152. Serene accommodation near Murguma Dam & Ajodhya Hills with authentic hospitality.",
};

export async function getResortSettings(): Promise<ResortSettings> {
  try {
    const settings = await prisma.websiteSettings.findFirst();
    if (!settings) {
      return DEFAULT_SETTINGS;
    }
    return {
      id: settings.id,
      resortName: settings.resortName || DEFAULT_SETTINGS.resortName,
      tagline: settings.tagline || DEFAULT_SETTINGS.tagline,
      address: settings.address || DEFAULT_SETTINGS.address,
      phonePrimary: settings.phonePrimary || DEFAULT_SETTINGS.phonePrimary,
      phoneSecondary: settings.phoneSecondary || DEFAULT_SETTINGS.phoneSecondary,
      phoneTertiary: settings.phoneTertiary || DEFAULT_SETTINGS.phoneTertiary,
      whatsappNumber: settings.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
      email: settings.email || DEFAULT_SETTINGS.email,
      websiteUrl: settings.websiteUrl || DEFAULT_SETTINGS.websiteUrl,
      googleMapsUrl: settings.googleMapsUrl || DEFAULT_SETTINGS.googleMapsUrl,
      checkInTime: settings.checkInTime || DEFAULT_SETTINGS.checkInTime,
      checkOutTime: settings.checkOutTime || DEFAULT_SETTINGS.checkOutTime,
      heroHeading: settings.heroHeading || DEFAULT_SETTINGS.heroHeading,
      heroSubheading: settings.heroSubheading || DEFAULT_SETTINGS.heroSubheading,
      aboutText: settings.aboutText || DEFAULT_SETTINGS.aboutText,
      seoTitle: settings.seoTitle || DEFAULT_SETTINGS.seoTitle,
      seoDescription: settings.seoDescription || DEFAULT_SETTINGS.seoDescription,
    };
  } catch (error) {
    console.warn("Could not fetch settings from DB, using verified defaults:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Generates an official WhatsApp enquiry link with the verified message template
 */
export function buildWhatsAppLink(whatsappNumber: string, roomName?: string, priceShown?: number | string): string {
  // Strip non-numeric characters
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  // Format international number (India: prefix 91 if 10 digits)
  const formattedNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

  let message = '';
  if (roomName && priceShown !== undefined) {
    const formattedPrice = typeof priceShown === 'number' ? `₹${priceShown.toLocaleString('en-IN')}` : priceShown;
    message = `Hello Hill Queen Eco Resort,\nI would like to enquire about:\nRoom: ${roomName}\nPrice shown: ${formattedPrice}\nPlease share the current availability and details.\nThank you.`;
  } else {
    message = `Hello Hill Queen Eco Resort,\nI would like to enquire about room availability, packages and sightseeing at your resort in Murguma, Purulia.\nThank you.`;
  }

  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a clean tel: link
 */
export function buildTelLink(phone: string): string {
  const clean = phone.replace(/[^0-9+]/g, '');
  return `tel:${clean}`;
}

/**
 * Builds an official Google Maps Embed URL based on verified resort coordinates/location
 * without guessing property boundaries.
 */
export function buildMapEmbedUrl(googleMapsUrl?: string, address?: string): string {
  if (googleMapsUrl && (googleMapsUrl.includes('output=embed') || googleMapsUrl.includes('/maps/embed'))) {
    return googleMapsUrl;
  }
  const destination = 'Hill Queen Eco Resort, Mamudi, Murguma, Purulia, West Bengal 723152';
  return `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Builds an official Google Maps listing link for viewing the confirmed business profile
 */
export function buildGoogleMapsOpenUrl(googleMapsUrl?: string, address?: string): string {
  if (googleMapsUrl && (googleMapsUrl.includes('share.google') || googleMapsUrl.includes('maps.google') || googleMapsUrl.includes('goo.gl'))) {
    return googleMapsUrl;
  }
  return 'https://share.google/yDmE0tmJM7PhlxVlN';
}

/**
 * Builds an official Google Maps directions URL directing navigation to Hill Queen Eco Resort
 */
export function buildGoogleMapsDirectionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Hill Queen Eco Resort, Mamudi, Murguma, Purulia, West Bengal 723152')}`;
}
