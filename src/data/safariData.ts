import { SafariPackage, Destination, WildlifeProfile, Review, CurrencyRate, CurrencyCode } from '../types';

export const CBSI_CONTACT = {
  name: 'CBSI Safaris International',
  tagline: 'Authentic East Africa Safari & Wildlife Expeditions',
  phone: '+254 722 774952',
  phoneDisplay: '+254 722 774952',
  whatsappUrl: 'https://wa.me/254722774952',
  email: 'info@cbsisafaris.com',
  address: 'CBSI House, Karen Road, Nairobi, Kenya',
  hours: 'Mon - Sun: 24/7 Dispatch & Support',
  license: 'Licensed by Tourism Regulatory Authority (TRA) Kenya | KATO Member #418',
  social: {
    facebook: 'https://facebook.com/cbsisafaris',
    instagram: 'https://instagram.com/cbsisafaris',
    tripadvisor: 'https://tripadvisor.com',
    whatsapp: 'https://wa.me/254722774952'
  }
};

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rateToUSD: 1,
    format: (amt) => `$${Math.round(amt).toLocaleString()}`
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateToUSD: 0.92,
    format: (amt) => `€${Math.round(amt * 0.92).toLocaleString()}`
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateToUSD: 0.79,
    format: (amt) => `£${Math.round(amt * 0.79).toLocaleString()}`
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    rateToUSD: 130,
    format: (amt) => `KSh ${Math.round(amt * 130).toLocaleString()}`
  }
};

export const SAFARI_PACKAGES: SafariPackage[] = [
  {
    id: 'mara-migration-3d',
    title: '3-Day Masai Mara Great Migration Flying Safari',
    subtitle: 'Express luxury bush flight directly into the heart of the Mara plains with world-famous big cat action',
    country: 'Kenya',
    destinations: ['Masai Mara National Reserve'],
    durationDays: 3,
    durationNights: 2,
    priceUSD: 1150,
    tier: 'Luxury Lodge',
    badge: 'Most Popular',
    rating: 4.95,
    reviewCount: 142,
    isTrending: true,
    groupType: 'Fly-in Bush Plane',
    bestMonths: 'July - October (Peak Migration), All Year for Big Cats',
    wildlifeFocus: ['Lions', 'Cheetahs', 'Wildebeest Crossing', 'Elephants', 'Leopards'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Scenic bush plane flight from Wilson Airport to Mara Airstrip (45 mins)',
      'Stay in luxury tented suite overlooking the Talek or Mara River',
      'Twice daily 4x4 open-sided game drives with certified silver-level guide',
      'Optional sunrise hot air balloon safari with champagne bush breakfast',
      'Witness Mara River crossings during the Great Migration season'
    ],
    included: [
      'Return domestic flights Wilson Airport (Nairobi) - Masai Mara',
      '2 nights luxury tented camp accommodation',
      'All gourmet meals (Breakfast, Lunch, 3-course Dinner)',
      'All Masai Mara National Reserve park entry fees',
      'Unlimited 4x4 custom safari cruiser game drives with pop-up roof',
      'English-speaking Gold/Silver certified safari naturalist guide',
      'Airstrip meet & greet transfers in Masai Mara',
      'AMREF Flying Doctors 24/7 medical evacuation insurance',
      'Complimentary bottled water & coffee/tea during game drives'
    ],
    excluded: [
      'International flights & Kenya eVisa fees',
      'Hot Air Balloon safari ($450 per person optional)',
      'Maasai Cultural Village visit ($30 optional)',
      'Gratuities for driver-guide and lodge staff',
      'Premium alcoholic beverages'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Nairobi to Masai Mara via Bush Flight & Sunset Game Drive',
        location: 'Masai Mara National Reserve',
        description: 'Morning transfer to Wilson Airport for a scenic 45-minute flight across the Great Rift Valley to Masai Mara. Met upon landing by your dedicated CBSI guide. Embark on your first exhilarating game drive en-route to camp, checking in for lunch and an afternoon tracking pride of lions and cheetahs.',
        accommodation: 'Mara Serena Safari Lodge or Ashnil Mara Luxury Camp',
        meals: 'Lunch, Dinner',
        activities: ['Scenic Rift Valley flight', 'Afternoon predator game drive', 'Campfire sundowner']
      },
      {
        day: 2,
        title: 'Full Day Wildlife Immersion & Mara River Crossing Search',
        location: 'Mara River & Savannah Plains',
        description: 'Set out at dawn with packed bush breakfast for a full day traversing the expansive plains. Head toward the Mara River where crocodiles await the wildebeest and zebra herds. Spot the Big Five, marvel at soaring raptors, and enjoy a picnic under an iconic acacia tree.',
        accommodation: 'Mara Serena Safari Lodge or Ashnil Mara Luxury Camp',
        meals: 'Breakfast, Bush Picnic Lunch, Dinner',
        activities: ['Sunrise game drive', 'Mara River Hippo & Croc viewing', 'Picnic in the wild', 'Optional Maasai Village visit']
      },
      {
        day: 3,
        title: 'Dawn Bush Drive & Scenic Flight back to Nairobi',
        location: 'Masai Mara to Nairobi',
        description: 'Enjoy a final golden hour game drive capturing elephants and giraffes against the rising sun. Savor a relaxed breakfast at camp before transferring to the airstrip for your flight back to Nairobi, with hotel or Jomo Kenyatta airport drop-off.',
        accommodation: 'Departure / Day Room (Optional)',
        meals: 'Breakfast',
        activities: ['Early morning game drive', 'Scenic flight back to Nairobi', 'Airport transfer']
      }
    ]
  },
  {
    id: 'kenya-highlights-4d',
    title: '4-Day Kenya Explorer: Lake Nakuru & Masai Mara Private 4x4',
    subtitle: 'The quintessential safari pairing flamingos & rhinos at Nakuru with legendary Big Five in Masai Mara in private Land Cruiser',
    country: 'Kenya',
    destinations: ['Lake Nakuru National Park', 'Masai Mara National Reserve', 'Great Rift Valley'],
    durationDays: 4,
    durationNights: 3,
    priceUSD: 890,
    tier: 'Classic Mid-Range',
    badge: 'Best Value',
    rating: 4.92,
    reviewCount: 98,
    isTrending: true,
    groupType: 'Private 4x4 Jeep',
    bestMonths: 'All Year Round (Optimal Jan-Oct)',
    wildlifeFocus: ['White & Black Rhinos', 'Flamingos & Pelicans', 'Lions', 'Cheetahs', 'Giraffes'],
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Private customized 4x4 Safari Land Cruiser with guaranteed window seats',
      'Spot endangered Black & White Rhinos at Lake Nakuru sanctuary',
      'Panoramic viewpoints over the Great Rift Valley escarpment',
      'Two full nights in the world-renowned Masai Mara Game Reserve',
      'Dedicated private CBSI driver-guide from pickup to drop-off'
    ],
    included: [
      'Private 4x4 Land Cruiser with pop-up roof & inverter power charging',
      '3 nights accommodation in boutique safari lodges & tented camps',
      'All meals on full board basis',
      'All park entrance fees for Lake Nakuru & Masai Mara',
      'Professional certified English/French/Spanish speaking driver guide',
      'Nairobi hotel or JKIA airport pickup and drop-off',
      'Mineral water and refreshments on board'
    ],
    excluded: [
      'Visa fees & international airfare',
      'Optional balloon safari ($450)',
      'Staff tips & personal expenses'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Nairobi to Lake Nakuru National Park via Rift Valley Escarpment',
        location: 'Lake Nakuru National Park',
        description: 'Depart Nairobi early morning stopping at the breathtaking Great Rift Valley viewpoint. Descend into Nakuru, arriving in time for lunch. Afternoon game drive around the alkaline lake, spotting both white and black rhinos, Rothschild giraffes, and thousands of water birds.',
        accommodation: 'Lake Nakuru Sopa Lodge or Sarova Lion Hill',
        meals: 'Lunch, Dinner',
        activities: ['Rift Valley photo stop', 'Rhino Sanctuary safari', 'Lake Nakuru afternoon game drive']
      },
      {
        day: 2,
        title: 'Lake Nakuru to Masai Mara Game Reserve',
        location: 'Masai Mara National Reserve',
        description: 'After breakfast, drive southwest through scenic Narok county toward the Masai Mara. Arrive at your camp in time for a hot lunch, followed by an evening game drive spotting elephant herds and stealthy big cats.',
        accommodation: 'Enkorok Mara Camp or PrideInn Mara Camp',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Scenic countryside transit', 'Golden hour predator safari', 'Sundowner by the campfire']
      },
      {
        day: 3,
        title: 'Full Day Comprehensive Masai Mara Game Drives',
        location: 'Masai Mara National Reserve',
        description: 'A full day dedicated to discovering the boundless wilderness of the Mara. Track prides of lions, search for elusive leopards in acacia trees, and watch galloping herds of zebras and gazelles.',
        accommodation: 'Enkorok Mara Camp or PrideInn Mara Camp',
        meals: 'Breakfast, Picnic Lunch, Dinner',
        activities: ['Morning game drive', 'Picnic on the savannah', 'Afternoon wildlife tracking']
      },
      {
        day: 4,
        title: 'Early Morning Bush Walk / Drive & Return to Nairobi',
        location: 'Masai Mara to Nairobi',
        description: 'Morning game drive or cultural Maasai visit, followed by breakfast. Journey back to Nairobi with lunch en route, arriving late afternoon with transfer to your hotel or JKIA airport.',
        accommodation: 'End of Safari / Onward flight',
        meals: 'Breakfast, Lunch',
        activities: ['Morning game drive', 'Maasai village tour (optional)', 'Nairobi transfer']
      }
    ]
  },
  {
    id: 'kenya-tanzania-combo-7d',
    title: '7-Day East Africa Legends: Mara, Serengeti & Ngorongoro Crater',
    subtitle: 'The ultimate bucket-list safari seamlessly connecting Kenya and Tanzania premier ecosystems across the Namanga border',
    country: 'Kenya & Tanzania',
    destinations: ['Masai Mara (Kenya)', 'Serengeti National Park (Tanzania)', 'Ngorongoro Crater (Tanzania)'],
    durationDays: 7,
    durationNights: 6,
    priceUSD: 2450,
    tier: 'Luxury Lodge',
    badge: 'Iconic Combo',
    rating: 4.98,
    reviewCount: 215,
    isTrending: true,
    groupType: 'Private 4x4 Jeep',
    bestMonths: 'All Year (Dec-Mar Calving, Jul-Oct Mara River)',
    wildlifeFocus: ['The Complete Big Five', 'Great Migration Herds', 'Crater Lions', 'Tree-climbing Lions', 'Hippo Pools'],
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Two legendary reserves: Masai Mara & Serengeti combined in one fluid trip',
      'Descend 600m into the UNESCO World Heritage Ngorongoro Crater floor',
      'Hassle-free VIP border assistance at Isebania / Namanga border',
      'Highest density of predators on earth tracked with top master guides',
      'Luxury tented camps with sweeping savannah views & campfire dining'
    ],
    included: [
      'Custom 4x4 Land Cruisers in both Kenya & Tanzania with pop-up roofs',
      '6 nights luxury lodge & tented camp accommodations',
      'All meals on full board basis',
      'All park fees (Masai Mara, Serengeti, Ngorongoro Crater conservation fee)',
      'Crater service descent permit fees ($300 value)',
      'Cross-border logistics & dedicated CBSI driver-guides',
      'Unlimited mileage game drives',
      'AMREF Flying Doctor emergency insurance'
    ],
    excluded: [
      'Tanzania & Kenya visa fees ($50-$100 depending on nationality)',
      'Tips for guides and lodge crew',
      'Optional Serengeti balloon safari ($550)'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Nairobi to Masai Mara National Reserve',
        location: 'Masai Mara, Kenya',
        description: 'Morning pickup from Nairobi and drive through the dramatic Great Rift Valley to Masai Mara. Arrive in time for lunch at your luxury tented camp. Afternoon game drive tracking lions, cheetahs, and elephants across the rolling savannah.',
        accommodation: 'Ashnil Mara Camp or Mara Leisure Camp',
        meals: 'Lunch, Dinner',
        activities: ['Rift Valley transit', 'Afternoon predator safari', 'Campfire dinner']
      },
      {
        day: 2,
        title: 'Full Day Masai Mara Wildebeest & Predator Safari',
        location: 'Masai Mara, Kenya',
        description: 'Full day with picnic lunch exploring the Mara River and endless grasslands. Track prides of lions and marvel at massive herds of herbivores.',
        accommodation: 'Ashnil Mara Camp or Mara Leisure Camp',
        meals: 'Breakfast, Picnic Lunch, Dinner',
        activities: ['Full day game drive', 'Mara River exploration', 'Sundowner drinks']
      },
      {
        day: 3,
        title: 'Masai Mara to Serengeti via Isebania Border',
        location: 'Serengeti National Park, Tanzania',
        description: 'Early breakfast before driving to the Kenya-Tanzania border at Isebania. After quick visa formalities, meet your Tanzanian CBSI guide and enter the Serengeti via the western corridor with game viewing en route.',
        accommodation: 'Serengeti Serena Safari Lodge or Kubu Kubu Tented Lodge',
        meals: 'Breakfast, Packed Lunch, Dinner',
        activities: ['Cross-border transit', 'Serengeti entry game drive', 'Sunset lodge check-in']
      },
      {
        day: 4,
        title: 'Full Day in the Infinite Serengeti Plains (Central Seronera)',
        location: 'Serengeti National Park, Tanzania',
        description: 'Explore the Seronera Valley, known as the big cat capital of Africa. Marvel at leopards resting on acacia branches and cheetahs hunting gazelles across open plains.',
        accommodation: 'Serengeti Serena Safari Lodge or Kubu Kubu Tented Lodge',
        meals: 'Breakfast, Picnic Lunch, Dinner',
        activities: ['Morning game drive', 'Kopjes rock formation lion search', 'Serengeti sunset']
      },
      {
        day: 5,
        title: 'Serengeti to Ngorongoro Crater Highlands',
        location: 'Ngorongoro Conservation Area',
        description: 'Morning game drive through Serengeti before ascending the lush crater highlands. Stop at Olduvai Gorge viewpoint before reaching your lodge perched right on the crater rim with sweeping views.',
        accommodation: 'Ngorongoro Serena Safari Lodge or Rhino Lodge',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Morning Serengeti safari', 'Crater rim viewpoint', 'Highland lodge experience']
      },
      {
        day: 6,
        title: 'Ngorongoro Crater Floor Safari (UNESCO Wonder)',
        location: 'Ngorongoro Crater Floor',
        description: 'Descend 2,000 feet to the crater floor for a 6-hour wildlife spectacle. Look for black rhinos, giant tusked elephants, pink flamingos at Lake Magadi, and dense lion prides in the enclosed caldera.',
        accommodation: 'Marera Valley Lodge, Karatu',
        meals: 'Breakfast, Picnic Lunch on Crater Floor, Dinner',
        activities: ['600m Caldera descent', 'Black Rhino tracking', 'Lake Magadi flamingo viewing']
      },
      {
        day: 7,
        title: 'Karatu / Arusha to Kilimanjaro Airport (JRO) or Nairobi',
        location: 'Arusha to Departure',
        description: 'Enjoy a leisurely breakfast before transferring through scenic coffee plantations to Arusha for lunch, then onward transfer to Kilimanjaro Airport (JRO) or shuttle back to Nairobi.',
        accommodation: 'Departure',
        meals: 'Breakfast, Lunch',
        activities: ['Coffee plantation drive', 'Arusha cultural craft market', 'Airport drop-off']
      }
    ]
  },
  {
    id: 'amboseli-naivasha-5d',
    title: '5-Day Amboseli (Mt Kilimanjaro Views), Lake Naivasha & Hell’s Gate',
    subtitle: 'Epic elephant herds under Mount Kilimanjaro, boat safaris with hippos, and cycling through Hell’s Gate canyons',
    country: 'Kenya',
    destinations: ['Amboseli National Park', 'Lake Naivasha', 'Hell’s Gate National Park'],
    durationDays: 5,
    durationNights: 4,
    priceUSD: 980,
    tier: 'Classic Mid-Range',
    badge: 'Adventure & Scenery',
    rating: 4.90,
    reviewCount: 76,
    groupType: 'Private 4x4 Jeep',
    bestMonths: 'All Year (Clear Kili views in dry seasons)',
    wildlifeFocus: ['Giant Tusker Elephants', 'Mount Kilimanjaro Views', 'Hippos & Fish Eagles', 'Giraffes', 'Zebras'],
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Photograph iconic herds of elephants against the backdrop of snow-capped Mt Kilimanjaro',
      'Observation Hill 360-degree panoramic view over Amboseli swamps',
      'Scenic boat safari on freshwater Lake Naivasha spotting hippos and fish eagles',
      'Walk or cycle alongside zebras and gazelles inside dramatic Hell’s Gate gorge',
      'Visit Crescent Island Game Sanctuary walking among wild animals'
    ],
    included: [
      'Private 4x4 Land Cruiser with pop-up roof',
      '4 nights lodge & resort accommodation',
      'All meals on full board',
      'All park entrance fees (Amboseli & Hell’s Gate)',
      '1-hour motorized boat safari on Lake Naivasha',
      'Crescent Island walking safari permit fees',
      'Services of a dedicated senior wildlife guide',
      'Bottled drinking water throughout safari'
    ],
    excluded: [
      'Bicycle hire in Hell’s Gate ($15 optional)',
      'Tips & laundry',
      'International flights'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Nairobi to Amboseli National Park under Mt Kilimanjaro',
        location: 'Amboseli National Park',
        description: 'Depart Nairobi driving south across Maasai country to Amboseli. Check into your lodge with stunning views of Kilimanjaro. Afternoon game drive across the marshes seeing hundreds of elephants bathing.',
        accommodation: 'Ol Tukai Lodge or Amboseli Serena Lodge',
        meals: 'Lunch, Dinner',
        activities: ['Kilimanjaro landscape drive', 'Amboseli swamp elephant safari', 'Observation hill panorama']
      },
      {
        day: 2,
        title: 'Full Day Amboseli Wildlife Exploration',
        location: 'Amboseli National Park',
        description: 'Early morning game drive capturing the golden sunrise lighting up Kilimanjaro peaks. Track lions, cheetahs, hyenas, and vast herds of wildebeest and zebras.',
        accommodation: 'Ol Tukai Lodge or Amboseli Serena Lodge',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Dawn Kilimanjaro photography', 'Marshes birdwatching', 'Afternoon predator drive']
      },
      {
        day: 3,
        title: 'Amboseli to Lake Naivasha via Great Rift Valley',
        location: 'Lake Naivasha',
        description: 'After breakfast, drive northward past Nairobi to the Great Rift Valley. Arrive at Lake Naivasha resort for lunch. Take an afternoon boat safari among pods of hippos and walking safari on Crescent Island.',
        accommodation: 'Lake Naivasha Sopa Resort or Enashipai Resort & Spa',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Scenic valley transfer', 'Lake Naivasha boat safari', 'Crescent Island walking safari']
      },
      {
        day: 4,
        title: 'Hell’s Gate Canyons Cycling & Geothermal Exploration',
        location: 'Hell’s Gate National Park',
        description: 'Morning adventure in Hell’s Gate National Park—one of the few parks where you can cycle and walk freely among zebras, giraffes, and warthogs through towering volcanic cliffs.',
        accommodation: 'Lake Naivasha Sopa Resort or Enashipai Resort',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Hell’s Gate cycling safari', 'Gorge trekking', 'Geothermal spa relaxation']
      },
      {
        day: 5,
        title: 'Lake Naivasha to Nairobi & Souvenir Shopping',
        location: 'Naivasha to Nairobi',
        description: 'Leisurely breakfast overlooking the manicured grounds frequented by colobus monkeys and waterbucks. Relaxed drive back to Nairobi with drop off at your hotel or airport.',
        accommodation: 'Departure',
        meals: 'Breakfast',
        activities: ['Morning bird walk', 'Nairobi craft market visit', 'Airport drop-off']
      }
    ]
  },
  {
    id: 'bush-to-beach-8d',
    title: '8-Day Bush to Beach: Serengeti, Ngorongoro & Zanzibar Paradise',
    subtitle: 'The quintessential African romantic journey combining raw savannah wildlife with turquoise Indian Ocean sands',
    country: 'Tanzania',
    destinations: ['Serengeti National Park', 'Ngorongoro Crater', 'Zanzibar Island (Nungwi)'],
    durationDays: 8,
    durationNights: 7,
    priceUSD: 2890,
    tier: 'Honeymoon',
    badge: 'Honeymoon Choice',
    rating: 4.97,
    reviewCount: 164,
    groupType: 'Fly-in Bush Plane',
    bestMonths: 'June - March (Optimal Beach & Wildlife)',
    wildlifeFocus: ['Lions & Leopards', 'Rhinos', 'Dolphins & Sea Turtles', 'Coral Reef Marine Life', 'Cheetahs'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      '3 days of prime Serengeti wildlife tracking followed by Ngorongoro Crater floor',
      'Internal flight from Serengeti directly to exotic spice island of Zanzibar',
      '3 nights in an oceanfront luxury resort in pristine Nungwi Beach',
      'Private sunset dhow cruise with chilled drinks & seafood canapés',
      'UNESCO Stone Town heritage walking tour & spice plantation tour'
    ],
    included: [
      '4x4 Land Cruiser safari in northern Tanzania',
      'Domestic flight: Serengeti (Airstrip) - Zanzibar (ZNZ)',
      '4 nights safari lodges + 3 nights luxury beach resort',
      'Full board on safari / All-inclusive or Half-board in Zanzibar',
      'All national park & crater entrance fees',
      'Zanzibar airport & excursion transfers',
      'Private sunset dhow boat cruise',
      'Flying Doctor emergency evacuation insurance'
    ],
    excluded: [
      'Zanzibar infrastructure tax ($5/night paid at hotel)',
      'International flights',
      'Tips and personal items'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Arusha to Tarangire National Park (Elephant Kingdom)',
        location: 'Tarangire National Park',
        description: 'Depart Arusha to Tarangire, famous for its ancient baobab trees and largest concentration of elephants. Afternoon game drive along the Tarangire River.',
        accommodation: 'Tarangire Safari Lodge or Maramboi Tented Lodge',
        meals: 'Lunch, Dinner',
        activities: ['Baobab landscape safari', 'Tarangire elephant viewing', 'Sundowner']
      },
      {
        day: 2,
        title: 'Tarangire to Serengeti National Park',
        location: 'Serengeti National Park',
        description: 'Drive through the Ngorongoro Highlands and descend into the vast Serengeti. Afternoon game drive in the Seronera Valley tracking big cats.',
        accommodation: 'Kubu Kubu Tented Lodge or Melia Serengeti',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Serengeti game drive', 'Predator tracking', 'Tented camp dinner']
      },
      {
        day: 3,
        title: 'Full Day Serengeti Big Cat Safari',
        location: 'Serengeti National Park',
        description: 'Full day game drive traversing kopjes, rivers, and grasslands. Encounter cheetahs sprinting and lions resting on warm granite boulders.',
        accommodation: 'Kubu Kubu Tented Lodge or Melia Serengeti',
        meals: 'Breakfast, Picnic Lunch, Dinner',
        activities: ['Sunrise safari', 'Kopjes exploration', 'Bush lunch']
      },
      {
        day: 4,
        title: 'Ngorongoro Crater Floor Safari',
        location: 'Ngorongoro Crater',
        description: 'Descend early into the 600m caldera for a mind-blowing 6-hour safari surrounded by 25,000 large mammals including black rhinos.',
        accommodation: 'Ngorongoro Serena Lodge or Marera Valley Lodge',
        meals: 'Breakfast, Picnic Lunch, Dinner',
        activities: ['Crater descent', 'Black rhino search', 'Hippo pool picnic']
      },
      {
        day: 5,
        title: 'Flight to Zanzibar Island (Spice & Sands)',
        location: 'Arusha / Kilimanjaro to Zanzibar',
        description: 'Transfer to airport for your flight over the Indian Ocean to Zanzibar. Arrive at your beachfront resort with sparkling turquoise waters.',
        accommodation: 'Riu Palace Zanzibar or Royal Zanzibar Beach Resort',
        meals: 'Breakfast, Dinner',
        activities: ['Flight to Zanzibar', 'Beachfront check-in', 'Tropical cocktails']
      },
      {
        day: 6,
        title: 'Zanzibar Beach Relaxation & Sunset Dhow Cruise',
        location: 'Nungwi Beach, Zanzibar',
        description: 'Day at leisure soaking up the sun, swimming with sea turtles, and enjoying a private romantic sunset sail on a traditional wooden dhow.',
        accommodation: 'Riu Palace Zanzibar or Royal Zanzibar Beach Resort',
        meals: 'Breakfast, Dinner',
        activities: ['Beach relaxation', 'Snorkeling in coral reef', 'Sunset dhow cruise']
      },
      {
        day: 7,
        title: 'Stone Town Cultural Tour & Spice Farm Experience',
        location: 'Stone Town, Zanzibar',
        description: 'Discover the historic alleyways of UNESCO Stone Town, the Freddie Mercury house, the Old Fort, and smell fresh vanilla, cloves, and cinnamon at a spice plantation.',
        accommodation: 'Riu Palace Zanzibar or Royal Zanzibar Beach Resort',
        meals: 'Breakfast, Dinner',
        activities: ['Stone Town heritage walk', 'Spice farm sensory tour', 'Curio shopping']
      },
      {
        day: 8,
        title: 'Zanzibar Island Farewell & Departure',
        location: 'Zanzibar Airport (ZNZ)',
        description: 'Final morning swim and breakfast overlooking the ocean before private transfer to Zanzibar International Airport for your flight home.',
        accommodation: 'Departure',
        meals: 'Breakfast',
        activities: ['Beach morning', 'Airport transfer']
      }
    ]
  },
  {
    id: 'samburu-olpejeta-4d',
    title: '4-Day Samburu Special Five & Ol Pejeta Chimpanzee Sanctuary',
    subtitle: 'Venture into Kenya’s wild north for unique northern wildlife species and the world’s last northern white rhinos',
    country: 'Kenya',
    destinations: ['Samburu National Reserve', 'Ol Pejeta Conservancy', 'Mount Kenya'],
    durationDays: 4,
    durationNights: 3,
    priceUSD: 1040,
    tier: 'Classic Mid-Range',
    badge: 'Rare Species',
    rating: 4.93,
    reviewCount: 52,
    groupType: 'Private 4x4 Jeep',
    bestMonths: 'All Year Round',
    wildlifeFocus: ['Gerenuk (Giraffe-gazelle)', 'Grevy’s Zebra', 'Beisa Oryx', 'Somali Ostrich', 'Reticulated Giraffe', 'Chimpanzees', 'Last White Rhinos'],
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Spot the Samburu "Special Five" endemic species found only north of the equator',
      'Ewaso Nyiro River game drives with large elephant herds and Nile crocodiles',
      'Visit Sweetwaters Chimpanzee Sanctuary and endangered rhino enclosure in Ol Pejeta',
      'Cross the equator with a fun water coriolis experiment demonstration',
      'Panoramic views of Mount Kenya snow peaks'
    ],
    included: [
      'Private custom 4x4 Safari Land Cruiser with pop-up roof',
      '3 nights accommodation in luxury tented camps',
      'Full board meals (Breakfast, Lunch, Dinner)',
      'All park and conservancy conservation fees',
      'Ol Pejeta Rhino Sanctuary & Sweetwaters Chimpanzee visits',
      'Professional safari guide naturalist',
      'Bottled drinking water'
    ],
    excluded: [
      'Personal travel insurance',
      'Staff tips & alcoholic drinks',
      'Lion tracking activity (optional)'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Nairobi to Samburu Game Reserve across Mount Kenya foothills',
        location: 'Samburu National Reserve',
        description: 'Drive north from Nairobi passing lush pineapple and coffee plantations with Mount Kenya on your right. Cross the equator and enter the arid beauty of Samburu. Afternoon game drive along the palm-lined Ewaso Nyiro River.',
        accommodation: 'Samburu Intrepids Camp or Ashnil Samburu Camp',
        meals: 'Lunch, Dinner',
        activities: ['Equator crossing stop', 'Samburu sunset game drive', 'Riverside camp check-in']
      },
      {
        day: 2,
        title: 'Full Day Samburu Special 5 Exploration',
        location: 'Samburu National Reserve',
        description: 'Search for the Samburu Special 5: long-necked gerenuk standing on hind legs, reticulated giraffe, Grevy’s zebra, Somali ostrich, and Beisa oryx. Spot leopards in the doum palms and large elephant herds taking mud baths.',
        accommodation: 'Samburu Intrepids Camp or Ashnil Samburu Camp',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Dawn predator tracking', 'Special 5 wildlife safari', 'Samburu cultural encounter']
      },
      {
        day: 3,
        title: 'Samburu to Ol Pejeta Conservancy (Rhinos & Chimps)',
        location: 'Ol Pejeta Conservancy',
        description: 'Depart Samburu to Ol Pejeta Conservancy in the Laikipia plateau. Visit the endangered species enclosure to see the world’s last remaining Northern White Rhinos (Najin and Fatu) and the Sweetwaters Chimpanzee Sanctuary.',
        accommodation: 'Sweetwaters Serena Camp or Serena Mountain Lodge',
        meals: 'Breakfast, Lunch, Dinner',
        activities: ['Ol Pejeta game drive', 'Chimpanzee sanctuary visit', 'Rhino enclosure experience']
      },
      {
        day: 4,
        title: 'Ol Pejeta Morning Safari & Return to Nairobi',
        location: 'Ol Pejeta to Nairobi',
        description: 'Final morning game drive viewing the highest density of wildlife in Kenya. Enjoy breakfast before returning to Nairobi, arriving late afternoon.',
        accommodation: 'Departure',
        meals: 'Breakfast, Lunch',
        activities: ['Morning safari', 'Nairobi return transfer']
      }
    ]
  }
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'masai-mara',
    name: 'Masai Mara National Reserve',
    country: 'Kenya',
    tagline: 'The World-Renowned Jewel of African Wildlife',
    description: 'Home to the iconic Great Wildebeest Migration and the highest concentration of big cats on earth. The undulating savannah grasslands, acacia trees, and dramatic Mara River crossings provide the ultimate African safari canvas.',
    bestTimeToVisit: 'July to October (Great Migration) & Dec to March (Calving & Warm weather)',
    heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Great Migration River Crossings (July - October)',
      'High predator density: Lions, Cheetahs & Leopards',
      'Sunrise Hot Air Balloon Safaris',
      'Authentic Maasai Cultural Villages'
    ],
    topWildlife: ['Lions', 'Cheetahs', 'Wildebeests', 'Elephants', 'Leopards', 'Hippos'],
    idealDays: '3 to 5 Days',
    climate: 'Warm sunny days (26°C / 79°F), cool crisp nights (13°C / 55°F)',
    coordinates: { lat: -1.4827, lng: 35.1444 }
  },
  {
    id: 'serengeti',
    name: 'Serengeti National Park',
    country: 'Tanzania',
    tagline: 'Endless Plains of Legendary Wildlife Drama',
    description: 'The vast, unfenced ecosystem of the Serengeti is a UNESCO World Heritage site spanning nearly 15,000 sq km. Famous for kopjes where lions survey plains, vast predator populations, and year-round migratory movements.',
    bestTimeToVisit: 'December to March (Ndutu Calving) & June to October (Northern Crossing)',
    heroImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Over 2 million wildebeests and zebras on the move',
      'Seronera Valley big cat territory',
      'Granite Kopjes with resident lion prides and rock hyrax',
      'Serengeti Balloon Safaris with bush champagne'
    ],
    topWildlife: ['Lions', 'Leopards', 'Cheetahs', 'Hyenas', 'Giraffes', 'Buffaloes'],
    idealDays: '4 to 6 Days',
    climate: 'Tropical savannah, temperate year-round with warm afternoons',
    coordinates: { lat: -2.3333, lng: 34.8333 }
  },
  {
    id: 'ngorongoro',
    name: 'Ngorongoro Crater',
    country: 'Tanzania',
    tagline: 'Africa’s Eden & The World’s Largest Intact Caldera',
    description: 'A breathtaking natural amphitheater 600 meters deep and 20 km across. The crater floor acts as a self-contained sanctuary for over 25,000 animals, including the densest population of lions and critically endangered black rhinos.',
    bestTimeToVisit: 'Year-round exceptional game viewing; dry months June-October',
    heroImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'UNESCO World Heritage Site & 8th Natural Wonder',
      'High probability of spotting the rare Black Rhino',
      'Lake Magadi with pink flamingo flocks',
      'Lerai Forest with ancient fever trees and tusker elephants'
    ],
    topWildlife: ['Black Rhinos', 'Lions', 'Elephants', 'Flamingos', 'Hippos'],
    idealDays: '1 to 2 Days',
    climate: 'Crater rim is cool and misty (8-16°C), crater floor warm (22-26°C)',
    coordinates: { lat: -3.2422, lng: 35.4856 }
  },
  {
    id: 'amboseli',
    name: 'Amboseli National Park',
    country: 'Kenya',
    tagline: 'Land of Giants in the Shadow of Kilimanjaro',
    description: 'Famed for offering the most iconic postcard view in Africa: vast herds of big tusker elephants roaming swampy wetlands against the snow-capped peak of Mount Kilimanjaro.',
    bestTimeToVisit: 'January to March & July to October for clear mountain views',
    heroImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Iconic Mount Kilimanjaro photo opportunities',
      'Long-term elephant research study herds with massive tusks',
      'Observation Hill 360-degree viewing platform',
      'Enkongo Narok & Olokenya fresh water swamps'
    ],
    topWildlife: ['Elephants', 'Lions', 'Cheetahs', 'Hyenas', 'Pelicans', 'Zebras'],
    idealDays: '2 to 3 Days',
    climate: 'Warm and dry (27°C / 81°F), crisp mornings',
    coordinates: { lat: -2.6527, lng: 37.2606 }
  },
  {
    id: 'lake-naivasha-hellsgate',
    name: 'Lake Naivasha & Hell’s Gate',
    country: 'Kenya',
    tagline: 'Freshwater Boat Safaris & Volcanic Canyons',
    description: 'A freshwater lake in the Great Rift Valley teeming with over 400 bird species and hippos, paired with Hell’s Gate National Park where you can cycle and walk alongside wildlife among towering volcanic cliffs.',
    bestTimeToVisit: 'All year round (Great weekend getaway from Nairobi)',
    heroImage: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Boat safaris getting close to pods of hippos and fish eagles',
      'Walking safari on Crescent Island alongside giraffes & zebras',
      'Cycling through Hell’s Gate canyon landscapes (Lion King inspiration)',
      'Natural geothermal hot spring spas'
    ],
    topWildlife: ['Hippos', 'Fish Eagles', 'Giraffes', 'Zebras', 'Colobus Monkeys'],
    idealDays: '1 to 2 Days',
    climate: 'Pleasant and temperate (24°C / 75°F)',
    coordinates: { lat: -0.7667, lng: 36.4333 }
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar Spice Island',
    country: 'Tanzania',
    tagline: 'Turquoise Indian Ocean & Historic Swahili Culture',
    description: 'The perfect tropical conclusion to a dusty bush safari. Pristine white sands, coral reef diving, sunset sailing on wooden dhows, and the evocative historic UNESCO Stone Town.',
    bestTimeToVisit: 'June to October & December to February',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Nungwi & Kendwa beaches with minimal tides and crystal turquoise water',
      'Sunset dhow cruises with fresh tropical seafood',
      'Stone Town spice markets and historic Arab architecture',
      'Mnemba Atoll snorkeling with dolphins and sea turtles'
    ],
    topWildlife: ['Dolphins', 'Sea Turtles', 'Red Colobus Monkeys', 'Tropical Reef Fish'],
    idealDays: '3 to 5 Days',
    climate: 'Tropical coastal warm climate (28-32°C)',
    coordinates: { lat: -6.1659, lng: 39.2026 }
  }
];

export const WILDLIFE_GUIDE: WildlifeProfile[] = [
  {
    id: 'african-lion',
    name: 'African Lion',
    swahiliName: 'Simba',
    scientificName: 'Panthera leo',
    category: 'The Big Five',
    sightingLikelihood: 'Very High',
    bestParks: ['Masai Mara', 'Serengeti', 'Ngorongoro Crater'],
    description: 'The undisputed monarch of the African savannah. Lions live in social prides of up to 30 members, with females doing most of the hunting at dusk and night.',
    funFact: 'A lion’s roar can be heard from up to 8 kilometers (5 miles) away across the plains.',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'african-elephant',
    name: 'African Bush Elephant',
    swahiliName: 'Tembo / Ndovu',
    scientificName: 'Loxodonta africana',
    category: 'The Big Five',
    sightingLikelihood: 'Very High',
    bestParks: ['Amboseli', 'Tarangire', 'Masai Mara', 'Samburu'],
    description: 'The largest terrestrial animal on Earth. Amboseli and Tarangire boast some of the oldest tuskers with ivory reaching near the ground.',
    funFact: 'An elephant’s trunk has over 40,000 individual muscles and can lift up to 350 kg or delicately pick a single blade of grass.',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'african-leopard',
    name: 'African Leopard',
    swahiliName: 'Chui',
    scientificName: 'Panthera pardus',
    category: 'The Big Five',
    sightingLikelihood: 'Moderate',
    bestParks: ['Serengeti (Seronera)', 'Masai Mara', 'Samburu'],
    description: 'Master of stealth and solitary elegance. Leopards frequently haul heavy prey up into yellow-barked acacia trees to keep it safe from hyenas and lions.',
    funFact: 'Leopards can leap up to 6 meters horizontally and 3 meters straight up into tree branches.',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'black-rhino',
    name: 'Black Rhinoceros',
    swahiliName: 'Kifaru',
    scientificName: 'Diceros bicornis',
    category: 'The Big Five',
    sightingLikelihood: 'Moderate',
    bestParks: ['Ngorongoro Crater', 'Lake Nakuru', 'Ol Pejeta Conservancy', 'Masai Mara'],
    description: 'Critically endangered and heavily guarded. Ol Pejeta and Ngorongoro are two of the best strongholds in Africa for seeing them in the wild.',
    funFact: 'Black rhinos have a prehensile hooked upper lip designed for browsing thorny acacia branches and herbs.',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cape-buffalo',
    name: 'Cape Buffalo',
    swahiliName: 'Nyati / Mbogo',
    scientificName: 'Syncerus caffer',
    category: 'The Big Five',
    sightingLikelihood: 'Very High',
    bestParks: ['Ngorongoro Crater', 'Masai Mara', 'Serengeti', 'Amboseli'],
    description: 'Known for their fused horn "boss" and protective herd solidarity. They have remarkable memory and will defend calves aggressively against lion prides.',
    funFact: 'Cape buffaloes have never been successfully domesticated and are considered one of the most formidable defenders in the wild.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    swahiliName: 'Duma',
    scientificName: 'Acinonyx jubatus',
    category: 'Predators',
    sightingLikelihood: 'High',
    bestParks: ['Masai Mara', 'Serengeti', 'Samburu'],
    description: 'The fastest land mammal, capable of accelerating from 0 to 60 mph in 3 seconds. They use termite mounds as lookout points across the open plains.',
    funFact: 'Unlike other big cats, cheetahs cannot roar; they communicate with bird-like chirps, purrs, and high-pitched whistles.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'David & Sarah Mitchell',
    country: 'United States (California)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'February 2026',
    safariTaken: '7-Day East Africa Legends: Mara, Serengeti & Ngorongoro',
    title: 'The trip of our lifetimes! CBSI exceeded every expectation',
    comment: 'From the moment we landed at Nairobi JKIA, CBSI took care of every detail. Our guide John had an uncanny ability to spot leopards and cheetahs before anyone else. We saw the Big Five in the first 48 hours! The 4x4 Land Cruiser was spotless with power sockets to keep our camera batteries full.',
    guideName: 'John Mwangi (Senior Naturalist)'
  },
  {
    id: 'rev-2',
    author: 'Dr. Michael Harrington & Family',
    country: 'United Kingdom (London)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'January 2026',
    safariTaken: '4-Day Kenya Explorer: Lake Nakuru & Masai Mara',
    title: 'Flawless family safari with teenagers',
    comment: 'Traveling with two teenagers can be challenging, but CBSI made it an unforgettable adventure. The WhatsApp communication prior to arrival was instant and reassuring (+254 722 774952 answered our questions even at odd hours). The Mara camp was pure luxury under canvas.',
    guideName: 'Sammy Ole Kaelo'
  },
  {
    id: 'rev-3',
    author: 'Elena & Markus Weber',
    country: 'Germany (Munich)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'August 2025',
    safariTaken: '8-Day Bush to Beach: Serengeti, Ngorongoro & Zanzibar',
    title: 'Unbelievable wildebeest crossing + Zanzibar paradise',
    comment: 'Seeing thousands of wildebeests plunge across the river while crocodiles waited was thrilling. Following that with the sunset dhow in Zanzibar was pure romantic perfection. The booking deposit was smooth and the cross-border transfer was seamless.',
    guideName: 'Peter Kibet'
  }
];

export const SAFARI_FAQ = [
  {
    question: 'How do I book and pay for a safari with CBSI Safaris?',
    answer: 'You can request a custom quote via our website builder or message us directly on WhatsApp (+254 722 774952). To confirm your booking and secure high-demand lodge rooms, we require a 40% to 50% deposit via secure bank wire transfer or online credit card link, with the balance payable 30 days prior to arrival or upon arrival in Nairobi.'
  },
  {
    question: 'What is included in the 4x4 Safari Land Cruiser?',
    answer: 'All our road safaris operate in custom-built 4x4 Toyota Land Cruisers featuring a high-clearance pop-up photographic roof hatch, guaranteed window seat for every guest, high-power USB charging inverters, mini-cooler with cold water/soft drinks, pair of high-magnification binoculars, VHF wildlife communication radio, and reference wildlife field guides.'
  },
  {
    question: 'When is the best time to see the Great Wildebeest Migration?',
    answer: 'The Great Migration is a continuous annual cycle! The dramatic Mara River crossings in Kenya’s Masai Mara happen between July and October. The calving season in Southern Serengeti (Ndutu) happens between January and March with 8,000 calves born daily. Prides of lions and resident wildlife can be seen year-round with exceptional visibility.'
  },
  {
    question: 'What visas and vaccinations do I need for Kenya and Tanzania?',
    answer: 'Kenya requires an Electronic Travel Authorization (eTA) applied online before departure (approx $34). Tanzania requires an online eVisa ($50 for most nationalities, $100 for US citizens). Yellow Fever vaccination certificate is mandatory if traveling between Kenya and Tanzania or from yellow fever endemic zones.'
  },
  {
    question: 'Can CBSI customize a safari for solo travelers, families, or honeymoons?',
    answer: 'Yes! Over 80% of our itineraries are 100% tailor-made. Whether you want budget camping under the stars, private luxury fly-in suites with plunge pools, hot air balloons, or beach extensions in Diani or Zanzibar, our safari planners design your dream trip to your exact dates and budget.'
  }
];