export interface ParsedSpeechData {
  origin?: string;
  destination?: string;
  vehicleType?: string;
  targetPrice?: number;
  departureTime?: string;
  cropOrLoad?: string;
  notes?: string;
  postType?: "VEHICLE_AVAILABLE" | "LOAD_AVAILABLE";
  rawTranscript: string;
}

const KNOWN_CITIES = [
  { name: "Indore Mandi", aliases: ["indore", "इंदौर", "indor", "indore mandi", "chhavani"] },
  { name: "Chhindwara Mandi", aliases: ["chhindwara", "छिंदवाड़ा", "chindwara", "chhindwada"] },
  { name: "Betul Mandi", aliases: ["betul", "बैतूल", "baitul", "betool"] },
  { name: "Nagpur Kalamna Mandi", aliases: ["nagpur", "नागपुर", "nagpore", "kalamna", "nagpur mandi"] },
  { name: "Mumbai Vashi APMC", aliases: ["mumbai", "मुंबई", "bombay", "vashi", "apmc"] },
  { name: "Bhopal Karond Mandi", aliases: ["bhopal", "भोपाल", "karond"] },
  { name: "Jabalpur Mandi", aliases: ["jabalpur", "जबलपुर"] },
  { name: "Nashik Mandi", aliases: ["nashik", "नासिक", "nasik"] },
  { name: "Pune Market Yard", aliases: ["pune", "पुणे", "poona"] },
  { name: "Ujjain Mandi", aliases: ["ujjain", "उज्जैन"] },
];

const VEHICLE_MAP: { [key: string]: string[] } = {
  "Bolero Pickup": ["pickup", "bolero", "बोलेरो", "पिकअप", "bolero pickup", "maxi truck", "maxi"],
  "Tata 407": ["tata 407", "407", "टाटा 407", "tata open body"],
  "Chota Hathi / Ace": ["chota hathi", "hathi", "ace", "tata ace", "छोटा हाथी", "mini truck"],
  "6-Wheeler (Eicher/17ft)": ["6 wheeler", "che wheeler", "chhe wheeler", "eicher", "आयशर", "truck", "कंटेनर", "17 ft"],
  "Tractor Trolley": ["tractor", "ट्रैक्टर", "trolley", "ट्रॉली", "trailar"],
};

export function parseHindiSpeech(text: string): ParsedSpeechData {
  const clean = text.toLowerCase().trim();
  const result: ParsedSpeechData = {
    rawTranscript: text,
  };

  // Determine intent / type
  if (
    clean.includes("khali") ||
    clean.includes("khaali") ||
    clean.includes("खाली") ||
    clean.includes("gadi khali") ||
    clean.includes("return") ||
    clean.includes("driver")
  ) {
    result.postType = "VEHICLE_AVAILABLE";
  } else if (
    clean.includes("bhejna") ||
    clean.includes("bhejna hai") ||
    clean.includes("load") ||
    clean.includes("maal") ||
    clean.includes("chahiye") ||
    clean.includes("माल") ||
    clean.includes("भेजना")
  ) {
    result.postType = "LOAD_AVAILABLE";
  }

  // Detect vehicle type
  for (const [vehicle, triggers] of Object.entries(VEHICLE_MAP)) {
    if (triggers.some((trigger) => clean.includes(trigger))) {
      result.vehicleType = vehicle;
      break;
    }
  }

  // Detect origin & destination from patterns like:
  // "X se Y ke liye" or "X se Y tak" or "X to Y"
  let originFound = false;
  let destinationFound = false;

  const seMatch = clean.match(/(.+?)\s+(?:se|say|से)\s+(.+?)(?:\s+(?:ke\s+liye|tak|ko|wapas|के लिए|तक|को)|$)/);
  if (seMatch) {
    const rawOrigin = seMatch[1];
    const rawDest = seMatch[2];

    for (const city of KNOWN_CITIES) {
      if (city.aliases.some((alias) => rawOrigin.includes(alias))) {
        result.origin = city.name;
        originFound = true;
        break;
      }
    }

    for (const city of KNOWN_CITIES) {
      if (city.aliases.some((alias) => rawDest.includes(alias))) {
        result.destination = city.name;
        destinationFound = true;
        break;
      }
    }
  }

  // Fallback city scanning if not caught by regex
  if (!originFound || !destinationFound) {
    const matchedCities: { name: string; index: number }[] = [];
    for (const city of KNOWN_CITIES) {
      for (const alias of city.aliases) {
        const idx = clean.indexOf(alias);
        if (idx !== -1) {
          if (!matchedCities.some((m) => m.name === city.name)) {
            matchedCities.push({ name: city.name, index: idx });
          }
          break;
        }
      }
    }

    matchedCities.sort((a, b) => a.index - b.index);

    if (matchedCities.length >= 2) {
      if (!originFound) result.origin = matchedCities[0].name;
      if (!destinationFound) result.destination = matchedCities[1].name;
    } else if (matchedCities.length === 1) {
      if (!originFound) result.origin = matchedCities[0].name;
    }
  }

  // Detect Price / Bhada
  // Matches e.g. "bhada 3500", "3500 rupaye", "₹3500", "rate 4000", or explicit 3-6 digit numbers
  const explicitPrice = clean.match(/(?:bhada|rate|kiraya|rupaye|rs|₹|रुपये)\s*(?:mein|me|ka)?\s*(\d{3,6})/);
  const reversePrice = clean.match(/(\d{3,6})\s*(?:bhada|rate|kiraya|rupaye|rs|₹|रुपये)/);
  const genericPrice = clean.match(/\b([1-9]\d{2,5})\b/);

  if (explicitPrice && explicitPrice[1]) {
    result.targetPrice = parseInt(explicitPrice[1], 10);
  } else if (reversePrice && reversePrice[1]) {
    result.targetPrice = parseInt(reversePrice[1], 10);
  } else if (genericPrice && genericPrice[1]) {
    const p = parseInt(genericPrice[1], 10);
    // Ignore 407 (Tata 407)
    if (p !== 407 && p >= 500 && p <= 150000) {
      result.targetPrice = p;
    }
  }

  // Detect Departure time
  if (clean.includes("aaj raat") || clean.includes("आज रात")) {
    result.departureTime = "Aaj Raat (Tonight)";
  } else if (clean.includes("kal subah") || clean.includes("कल सुबह")) {
    result.departureTime = "Kal Subah (Tomorrow Morning)";
  } else if (clean.includes("aaj shaam") || clean.includes("आज शाम")) {
    result.departureTime = "Aaj Shaam (Tonight 7:00 PM)";
  } else if (clean.includes("turant") || clean.includes("urgent") || clean.includes("अभी") || clean.includes("abhi")) {
    result.departureTime = "Turant / Urgent";
  }

  // Detect Crop/Load
  const crops: { [key: string]: string[] } = {
    "Tamatar (Tomato)": ["tamatar", "टमाटर", "tomato"],
    "Pyaz (Onion)": ["pyaz", "pyaj", "प्याज", "onion", "kanda"],
    "Gehun (Wheat)": ["gehun", "gehu", "गेहूं", "wheat"],
    "Makka (Corn)": ["makka", "मक्का", "corn", "bhutta"],
    "Aloo (Potato)": ["aloo", "aalu", "आलू", "potato"],
    "Kela (Banana)": ["kela", "केला", "banana"],
    "Mirchi (Chilli)": ["mirchi", "मिर्ची", "chilli"],
    "Sabzi (Vegetables)": ["sabzi", "sabji", "सब्जी", "vegetables"],
    "General Agri Load": ["anaj", "अनाज", "bori", "बोरी", "kisan maal"],
  };

  for (const [crop, keywords] of Object.entries(crops)) {
    if (keywords.some((k) => clean.includes(k))) {
      result.cropOrLoad = crop;
      break;
    }
  }

  // Notes extraction
  const extraNotes: string[] = [];
  if (clean.includes("tirpal") || clean.includes("तिरपाल")) extraNotes.push("Tirpal available / zaroori");
  if (clean.includes("urgent") || clean.includes("jaldi")) extraNotes.push("Urgent delivery required");
  if (clean.includes("loading") || clean.includes("hamare log")) extraNotes.push("Loading support available");

  if (extraNotes.length > 0) {
    result.notes = extraNotes.join(". ");
  }

  return result;
}
