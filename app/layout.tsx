import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import MobileActionDrawer from '@/components/MobileActionDrawer';
import SecretDoorTrigger from '@/components/SecretDoorTrigger';
import { getResortSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResortSettings();

  return {
    title: {
      default: settings.seoTitle || 'Hill Queen Eco Resort | Luxury Nature Resort in Murguma, Purulia',
      template: `%s | Hill Queen Eco Resort, Murguma`,
    },
    description: settings.seoDescription || 'Experience peaceful luxury at Hill Queen Eco Resort in Mamudi, Murguma, Purulia. Serene accommodation near Murguma Dam & Ajodhya Hills with authentic hospitality.',
    keywords: [
      'Hill Queen Eco Resort',
      'Hill Queen Eco Resort Murguma',
      'Resort in Murguma Purulia',
      'Hotels near Murguma Dam',
      'Resort in Purulia West Bengal',
      'Accommodation in Murguma',
      'Murguma cottages',
      'Ajodhya Hills resort',
      'Purulia eco tourism stay',
    ],
    metadataBase: new URL(settings.websiteUrl || 'https://hillqueenecoresort.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Hill Queen Eco Resort | Peaceful Luxury in Murguma, Purulia',
      description: 'Escape into nature. Experience serene cottages, fresh local dining, and quiet surroundings near Murguma Dam, Purulia.',
      url: settings.websiteUrl || 'https://hillqueenecoresort.com',
      siteName: 'Hill Queen Eco Resort',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop',
          width: 1200,
          height: 630,
          alt: 'Hill Queen Eco Resort, Murguma, Purulia',
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hill Queen Eco Resort | Murguma, Purulia',
      description: 'Escape into nature. Stay close to serenity at Hill Queen Eco Resort, Mamudi, Murguma.',
      images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getResortSettings();

  // Hotel / LodgingBusiness JSON-LD Schema (No fake ratings or fabricated reviews)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Resort',
    name: settings.resortName,
    description: settings.seoDescription,
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop',
    url: settings.websiteUrl,
    telephone: `+91-${settings.phonePrimary}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mamudi',
      addressLocality: 'Murguma',
      addressRegion: 'Purulia, West Bengal',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.3364',
      longitude: '86.0645',
    },
    priceRange: '₹1,800 - ₹3,500',
    checkinTime: settings.checkInTime,
    checkoutTime: settings.checkOutTime,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Attached Western Bathrooms', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Running Water', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Home Cooked Dining', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'On-Site Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Campfire Area', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Lake & Mountain View', value: true },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7EF] text-forest antialiased selection:bg-gold/30 selection:text-forest-dark">
        <Navbar
          phone={settings.phonePrimary}
          whatsapp={settings.whatsappNumber}
          resortName={settings.resortName}
        />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer settings={settings} />
        <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />
        <MobileActionDrawer
          phone={settings.phonePrimary}
          whatsapp={settings.whatsappNumber}
        />
        <SecretDoorTrigger />
      </body>
    </html>
  );
}
