import prisma from '@/lib/prisma';

export type AttractionCategory =
  | 'All'
  | 'Dams & Lakes'
  | 'Waterfalls'
  | 'Hills & Viewpoints'
  | 'Culture & Heritage'
  | 'Nature & Adventure';

export interface AttractionData {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  distanceKm: number;
  drivingTimeMin: number;
  imageUrl: string;
  imageAlt?: string | null;
  directionsUrl: string;
  bestTimeToVisit?: string | null;
  highlights?: string | null;
  travelTip?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export const RESORT_COORDINATES = {
  name: 'Hill Queen Eco Resort',
  address: 'Mamudi, Murguma, Purulia, West Bengal, India',
  pin: '723152',
  mapOrigin: 'Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152',
};

export const ATTRACTION_CATEGORIES: AttractionCategory[] = [
  'All',
  'Dams & Lakes',
  'Waterfalls',
  'Hills & Viewpoints',
  'Culture & Heritage',
  'Nature & Adventure',
];

export const DEFAULT_ATTRACTIONS: AttractionData[] = [
  {
    id: 'attr-murguma-dam',
    name: 'Murguma Dam & Lake',
    title: 'Murguma Dam & Water Reservoir',
    slug: 'murguma-dam-lake',
    description:
      'Situated right next to Hill Queen Eco Resort, Murguma Dam is a tranquil earthen water reservoir constructed across the Sahrajhor stream at the base of the Ajodhya Hills. Surrounded by lush sal and palash greenery, the mirror-like lake offers breathtaking sunrises and sunsets, soothing waterscapes, and migratory birdwatching during winter months. An essential highlight of your stay with immediate proximity to the resort.',
    category: 'Dams & Lakes',
    distanceKm: 1.5,
    drivingTimeMin: 5,
    imageUrl: '/images/attractions/murguma-dam.jpg',
    imageAlt: 'Scenic view of Murguma Dam reservoir near Hill Queen Eco Resort',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Murguma+Dam,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Sunrise & Late Afternoon (Golden Hour); Beautiful year-round, especially October to March.',
    highlights: JSON.stringify([
      'Immediate 5-minute proximity to resort',
      'Mirror-like reflections of surrounding hills',
      'Winter migratory bird sanctuary',
      'Peaceful shoreline walks & sunset viewing',
    ]),
    travelTip:
      'Easily reachable on foot (approx. 15-20 min walk) or a 5-minute drive. Early morning offers magical mist across the water and serene photography.',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'attr-marble-lake',
    name: 'Marble Lake (Blue Water Lake)',
    title: "Marble Lake – Purulia's Azure Canyon Lake",
    slug: 'marble-lake',
    description:
      "Often hailed as Bengal's mini Grand Canyon, Marble Lake is a breathtaking canyon reservoir with brilliant deep turquoise-blue waters set inside dramatic sheer granite cliffs. Created in a former excavation quarry, the sheer stone walls reflecting in the clear blue water make it one of the most stunning sightseeing spots in all of Purulia.",
    category: 'Dams & Lakes',
    distanceKm: 20.0,
    drivingTimeMin: 40,
    imageUrl: '/images/attractions/marble-lake.jpg',
    imageAlt: 'Azure blue water basin enclosed by sheer stone cliffs at Marble Lake Purulia',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Marble+Lake,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Midday to early afternoon when high overhead sunlight brings out the brilliant turquoise color.',
    highlights: JSON.stringify([
      'Deep azure and turquoise water basin',
      'Dramatic vertical rocky canyon cliffs',
      "Purulia's most popular photography landmark",
      'Stunning panoramic cliffside viewpoints',
    ]),
    travelTip:
      'The lake is extremely deep with steep rocky edges; swimming is strictly prohibited. Observe boundary warnings and wear comfortable walking shoes.',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'attr-ajodhya-hills',
    name: 'Ajodhya Hills Forest Range',
    title: 'Ajodhya Hills Plateau & Forested Ghats',
    slug: 'ajodhya-hills',
    description:
      'Ajodhya Hills form the central undulating highland plateau of Purulia, rich in Santhali tribal folklore and Ramayana heritage. Draped in dense Sal, Palash, and Mahua woodlands, the hills feature winding ghat roads, scenic lookout points, cool breezes, and rolling granite peaks. It serves as the primary highland excursion in southern West Bengal.',
    category: 'Hills & Viewpoints',
    distanceKm: 22.0,
    drivingTimeMin: 45,
    imageUrl: '/images/attractions/ajodhya-hills.jpg',
    imageAlt: 'Dense green forest hills and winding roads of Ajodhya Pahar Purulia',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Ajodhya+Hills,+Purulia,+West+Bengal',
    bestTimeToVisit: 'October to March for cool breezy weather; February to March for fiery red Palash blossoms.',
    highlights: JSON.stringify([
      'Undulating highland plateau (approx. 700m elevation)',
      'Rich in Santhali tribal folklore & Ramayana lore',
      'Dense Sal, Palash and Mahua woodlands',
      'Cool mountain breeze and scenic winding ghat roads',
    ]),
    travelTip:
      'Plan a half-day or full-day road circuit covering Ajodhya Hill top, Upper Dam, Marble Lake, and Bamni Falls.',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'attr-bamni-falls',
    name: 'Bamni Falls',
    title: 'Bamni Falls – Perennial Cascading Waterfall',
    slug: 'bamni-falls',
    description:
      'Bamni Falls is Purulia’s most celebrated perennial waterfall, cascading vigorously through giant granite boulders and dense forest foliage. Visitors descend well-maintained stone steps into a shaded gorge where mountain streams rush between monolithic rocks, creating refreshing natural mist and secluded pool retreats.',
    category: 'Waterfalls',
    distanceKm: 28.0,
    drivingTimeMin: 55,
    imageUrl: '/images/attractions/bamni-falls.jpg',
    imageAlt: 'Cascading water flowing over giant boulders at Bamni Falls Purulia',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Bamni+Falls,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Post-monsoon (August to November) for peak cascade volume; pleasant through February.',
    highlights: JSON.stringify([
      'Perennial tiered waterfall rushing over granite boulders',
      'Dense forest gorge and cool mountain spray',
      'Shaded stone-step walking descent',
      'Popular picnic and photography destination',
    ]),
    travelTip:
      'Requires walking down (and back up) about 150-200 stone steps into the river gorge. Sturdy grip footwear is strongly advised. Elderly travelers can enjoy viewing spots from higher levels.',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'attr-turga-falls',
    name: 'Turga Falls & Turga Dam',
    title: 'Turga Falls & Downstream Forest Lake',
    slug: 'turga-falls-dam',
    description:
      'Located close to Bamni, Turga Falls features crystal-clear mountain water leaping down polished rock formations into a gentle brook. Further downstream lies the peaceful Turga Dam, enveloped by serene undulating hilltops and dry deciduous woodland. A tranquil spot known for clear running waters and less crowded nature trails.',
    category: 'Waterfalls',
    distanceKm: 26.0,
    drivingTimeMin: 50,
    imageUrl: '/images/attractions/turga-falls.svg',
    imageAlt: 'Clear mountain brook and waterfall at Turga Falls Ajodhya Hills',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Turga+Falls,+Purulia,+West+Bengal',
    bestTimeToVisit: 'September to January when water flow is active and surrounded by green forests.',
    highlights: JSON.stringify([
      'Crystal clear mountain brook and cascades',
      'Gentle rock pools framed by trees',
      'Tranquil downstream irrigation dam',
      'Less crowded, peaceful natural retreat',
    ]),
    travelTip:
      'Conveniently located along the same road route as Bamni Falls. An ideal peaceful spot for sitting by flowing mountain waters.',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'attr-ppsp-upper-dam',
    name: 'PPSP Upper Dam',
    title: 'Purulia Pumped Storage Project (PPSP) Upper Dam',
    slug: 'ppsp-upper-dam',
    description:
      'An engineering marvel perched atop the Ajodhya plateau, the PPSP Upper Dam is a massive high-altitude reservoir serving India’s premier pumped-storage hydro project. From the wide crest embankment road, visitors can view endless blue waters on one side and a vast sweeping panorama of the Purulia valley far below on the other.',
    category: 'Dams & Lakes',
    distanceKm: 22.0,
    drivingTimeMin: 45,
    imageUrl: '/images/attractions/ppsp-upper-dam.jpg',
    imageAlt: 'Expansive water reservoir atop Ajodhya hill plateau at PPSP Upper Dam',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Upper+Dam+Ajodhya+Hills,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Late afternoon (3:30 PM to 5:30 PM) for refreshing mountain wind and sunset views.',
    highlights: JSON.stringify([
      'Massive high-altitude plateau reservoir',
      'Engineering marvel of pumped-storage hydro power',
      'Panoramic vistas of the Purulia plains below',
      'Broad, smooth crest roadway for scenic strolls',
    ]),
    travelTip:
      'Dam entry is open during daytime hours. Carry a hat and water bottle as the open dam crest has minimal shade during midday.',
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'attr-ppsp-lower-dam',
    name: 'PPSP Lower Dam',
    title: 'PPSP Lower Dam – Forest Valley Basin',
    slug: 'ppsp-lower-dam',
    description:
      'Nestled in the deep forest valley beneath Ajodhya Hill, the Lower Dam receives water discharged through subterranean hydroelectric turbines from the Upper Dam. Ringed by steep green ridges and dense jungle, the lower reservoir offers immense tranquility and dramatic reflections of the surrounding hills.',
    category: 'Dams & Lakes',
    distanceKm: 26.0,
    drivingTimeMin: 50,
    imageUrl: '/images/attractions/ppsp-lower-dam.jpg',
    imageAlt: 'Lush forested mountains reflected in the still waters of PPSP Lower Dam',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Lower+Dam+Ajodhya+Hills,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Morning or mid-afternoon on the descent toward Baghmundi.',
    highlights: JSON.stringify([
      'Surrounded on all sides by dense green forested hills',
      'Dramatic reflections on the tranquil reservoir surface',
      'Scenic ghat road connecting Upper and Lower dams',
      'Quiet, pristine valley environment',
    ]),
    travelTip:
      'The winding road linking the Upper Dam down to the Lower Dam offers breathtaking vistas of rocky cliffs and deep sal forests.',
    displayOrder: 7,
    isActive: true,
  },
  {
    id: 'attr-charida-village',
    name: 'Charida Chhau Mask Village',
    title: 'Charida – UNESCO Heritage Chhau Mask Craft Village',
    slug: 'charida-mask-village',
    description:
      'Recognized with a UNESCO-honored craft legacy and GI tag, Charida is a vibrant village where hundreds of master artisan families have crafted colorful, mythological Chhau dance masks for generations. Strolling through the village street, you can watch artisans sculpt clay, paper-pulp, cloth, tinsel, and feathers into iconic masks depicting Durga, Shiva, and mythical demons.',
    category: 'Culture & Heritage',
    distanceKm: 32.0,
    drivingTimeMin: 55,
    imageUrl: '/images/attractions/charida-village.jpg',
    imageAlt: 'Vibrant handcrafted Chhau dance masks on display in Charida village workshop',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Charida+Mask+Village,+Baghmundi,+Purulia,+West+Bengal',
    bestTimeToVisit: '11:00 AM to 5:00 PM when artisan shops and street workshops are fully active.',
    highlights: JSON.stringify([
      'GI-tagged heritage craft village with world acclaim',
      'Watch master artisans sculpt masks by hand',
      'Purchase authentic masks directly from the creators',
      'Celebrated Santhali & Chhau martial dance roots',
    ]),
    travelTip:
      'A wonderful cultural experience for families. Masks range from pocket-sized decorative souvenirs to elaborate full-scale stage masks.',
    displayOrder: 8,
    isActive: true,
  },
  {
    id: 'attr-khairabera-dam',
    name: 'Khairabera Dam & Lake',
    title: 'Khairabera Dam & Eco Lake',
    slug: 'khairabera-dam',
    description:
      'Nestled amidst slopes of the Chemtaburu and Kanka hills, Khairabera Dam is a tranquil eco-lake formed over the Karra river stream. Flanked by rocky hillocks and indigenous woodlands, it is an idyllic destination for peaceful picnic moments, photography, and viewing serene wilderness waterscapes.',
    category: 'Dams & Lakes',
    distanceKm: 36.0,
    drivingTimeMin: 60,
    imageUrl: '/images/attractions/khairabera-dam.jpg',
    imageAlt: 'Tranquil water expanse of Khairabera Dam framed by Chemtaburu hill',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Khairabera+Dam,+Purulia,+West+Bengal',
    bestTimeToVisit: 'October to February for clear blue skies and pleasant lakeside breeze.',
    highlights: JSON.stringify([
      'Picturesque lake bounded by Chemtaburu hills',
      'Quiet wilderness setting far from heavy crowds',
      'Winter migratory bird sightings along the shores',
      'Scenic drive through rural Purulia landscape',
    ]),
    travelTip:
      'Great extension when exploring the southern slopes of Ajodhya Hills. Pack snacks and water as commercial shops are limited nearby.',
    displayOrder: 9,
    isActive: true,
  },
  {
    id: 'attr-pakhi-pahar',
    name: 'Pakhi Pahar (Bird Hill)',
    title: 'Pakhi Pahar – Monumental Cliff Rock Carvings',
    slug: 'pakhi-pahar',
    description:
      'Pakhi Pahar is an outdoor open-air sculpture wonder where hundreds of large birds, peacocks, and eagles have been meticulously sculpted directly onto the sheer vertical granite cliff face by legendary artist Chitta Dey and his tribal artist team. It is also an active nesting site for wild birds and a popular trekking spot.',
    category: 'Nature & Adventure',
    distanceKm: 24.0,
    drivingTimeMin: 45,
    imageUrl: '/images/attractions/pakhi-pahar.jpg',
    imageAlt: 'Monumental rock sculptures of birds carved on sheer granite cliff at Pakhi Pahar',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Pakhi+Pahar,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Early morning or late afternoon for optimal light on the sculpted cliff faces.',
    highlights: JSON.stringify([
      'Hundreds of birds hand-carved onto sheer granite cliffs',
      'Unique open-air art project by artist Chitta Dey',
      'Popular trekking and bouldering destination',
      'Natural bird nesting crags and raptor sightings',
    ]),
    travelTip:
      'Visible directly from the road. Visitors interested in photography can take a short walk along the base for closer views.',
    displayOrder: 10,
    isActive: true,
  },
  {
    id: 'attr-mayur-pahar',
    name: 'Mayur Pahar Viewpoint',
    title: 'Mayur Pahar (Peacock Hill) 360° Overlook',
    slug: 'mayur-pahar',
    description:
      'A celebrated scenic high point on the Ajodhya ridge, Mayur Pahar offers an unobstructed 360-degree vantage point across the undulating forested valleys and distant red soil plains of Purulia. Traditionally visited for sightings of wild peacocks in the forest clearings below, the hilltop viewpoint is especially enchanting at sunrise and dusk.',
    category: 'Hills & Viewpoints',
    distanceKm: 23.0,
    drivingTimeMin: 45,
    imageUrl: '/images/attractions/mayur-pahar.svg',
    imageAlt: 'Panoramic vista over forested valleys from Mayur Pahar viewpoint Purulia',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Mayur+Pahar,+Ajodhya+Hills,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Sunrise or Sunset for panoramic golden light across the forest canopy.',
    highlights: JSON.stringify([
      'Unobstructed 360-degree vista of Ajodhya valleys',
      'Peacock and indigenous wild bird habitat',
      'Elevated wooden gazebo & viewing deck',
      'Cool mountain breeze throughout the year',
    ]),
    travelTip:
      'A short 2-minute stroll from the vehicle drop-off point brings you directly to the scenic viewing pavilion.',
    displayOrder: 11,
    isActive: true,
  },
  {
    id: 'attr-sita-kund',
    name: 'Sita Kund Spring',
    title: 'Sita Kund – Sacred Perennial Forest Spring',
    slug: 'sita-kund',
    description:
      'A legendary natural spring bubbling through white sands on the Ajodhya hilltop. According to local lore linked to the Ramayana, Lord Rama shot an arrow into the earth to draw fresh water to quench Sita’s thirst during their exile. The perennial spring is renowned for its curiously effervescent, crystal-clear water bubbling up from underground aquifers.',
    category: 'Culture & Heritage',
    distanceKm: 21.0,
    drivingTimeMin: 42,
    imageUrl: '/images/attractions/sita-kund.svg',
    imageAlt: 'Sacred natural spring at Sita Kund Ajodhya Hills Purulia',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Sita+Kund,+Ajodhya+Hills,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Morning to afternoon during day tours on the Ajodhya hilltop.',
    highlights: JSON.stringify([
      'Natural perennial spring with effervescent bubbles',
      'Deeply rooted in Ramayana exile mythology',
      'Surrounded by peaceful woodland foliage',
      'Key pilgrimage site for travelers in Purulia',
    ]),
    travelTip:
      'Situated within easy reach of Ajodhya hilltop market. Modest clothing is recommended when visiting this sacred site.',
    displayOrder: 12,
    isActive: true,
  },
  {
    id: 'attr-deulghata-temple',
    name: 'Deulghata Ancient Temple Ruins',
    title: 'Deulghata – 10th-Century Terracotta Temple Towers',
    slug: 'deulghata-temples',
    description:
      'Situated on the banks of the Kansai (Kangsabati) River near Boram, Deulghata is one of the most significant archaeological heritage sites in Purulia. Dating back to the 9th to 11th centuries during the Pala-Sena period, the soaring baked brick and stone Rekha deul temples feature intricate carved stucco floral motifs and historic Jain and Shaivite sculptures.',
    category: 'Culture & Heritage',
    distanceKm: 38.0,
    drivingTimeMin: 65,
    imageUrl: '/images/attractions/deulghata-temple.jpg',
    imageAlt: 'Historic 10th century terracotta temple ruins at Deulghata Purulia',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=Deulghata+Temple,+Purulia,+West+Bengal',
    bestTimeToVisit: 'Morning to early afternoon; best visited during cool autumn and winter months.',
    highlights: JSON.stringify([
      'Pala-Sena era 9th-11th century baked-brick Rekha deul temples',
      'Intricate floral and geometric terracotta stucco carvings',
      'Picturesque setting along the sacred Kangsabati riverbank',
      'Protected archaeological monument of immense heritage value',
    ]),
    travelTip:
      'A true treasure for history, architecture, and photography buffs. Located near Joypur / Boram off NH-32.',
    displayOrder: 13,
    isActive: true,
  },
];

export async function getAttractions(): Promise<AttractionData[]> {
  try {
    const list = await prisma.attraction.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    if (list && list.length > 0) {
      return list as unknown as AttractionData[];
    }
  } catch (error) {
    console.warn('Could not query attractions from database, using verified defaults:', error);
  }
  return DEFAULT_ATTRACTIONS;
}

export async function getAttractionBySlug(slug: string): Promise<AttractionData | null> {
  try {
    const item = await prisma.attraction.findUnique({
      where: { slug },
    });
    if (item) return item as unknown as AttractionData;
  } catch (error) {
    console.warn(`Could not query attraction with slug "${slug}":`, error);
  }
  const fallback = DEFAULT_ATTRACTIONS.find((a) => a.slug === slug);
  return fallback || null;
}
