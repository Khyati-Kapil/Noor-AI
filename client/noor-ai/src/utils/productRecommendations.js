const fallbackImage =
  "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=600";

const bySkinType = {
  dry: [
    {
      name: "CeraVe Hydrating Cleanser",
      image:
        "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser",
      reason: "Supports moisture barrier"
    },
    {
      name: "La Roche-Posay Toleriane Double Repair",
      image:
        "https://images.pexels.com/photos/6663469/pexels-photo-6663469.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.laroche-posay.us/our-products/face/moisturizer/toleriane-double-repair-face-moisturizer-3337872412486.html",
      reason: "Deep hydration for dry skin"
    }
  ],
  oily: [
    {
      name: "Cetaphil Oily Skin Cleanser",
      image:
        "https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.cetaphil.com/us/cleansers/oily-skin-cleanser/302993927341.html",
      reason: "Removes oil without stripping"
    },
    {
      name: "EltaMD UV Clear SPF 46",
      image:
        "https://images.pexels.com/photos/7262972/pexels-photo-7262972.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://eltamd.com/products/uv-clear-broad-spectrum-spf-46",
      reason: "Lightweight sunscreen for acne-prone skin"
    }
  ],
  combination: [
    {
      name: "CeraVe Foaming Facial Cleanser",
      image:
        "https://images.pexels.com/photos/4465822/pexels-photo-4465822.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.cerave.com/skincare/cleansers/foaming-facial-cleanser",
      reason: "Balances oily and dry zones"
    },
    {
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      image:
        "https://images.pexels.com/photos/7262969/pexels-photo-7262969.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html",
      reason: "Controls shine and helps texture"
    }
  ],
  sensitive: [
    {
      name: "Vanicream Gentle Facial Cleanser",
      image:
        "https://images.pexels.com/photos/3736396/pexels-photo-3736396.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.vanicream.com/product/vanicream-facial-cleanser",
      reason: "Minimal irritants"
    },
    {
      name: "La Roche-Posay Cicaplast Baume B5",
      image:
        "https://images.pexels.com/photos/6621146/pexels-photo-6621146.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.laroche-posay.us/our-products/body/body-lotion/cicaplast-baume-b5-for-dry-skin-irritations-3337872412998.html",
      reason: "Soothes stressed skin"
    }
  ],
  normal: [
    {
      name: "Neutrogena Hydro Boost Water Gel",
      image:
        "https://images.pexels.com/photos/6621148/pexels-photo-6621148.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.neutrogena.com/products/skincare/neutrogena-hydro-boost-water-gel/6811048.html",
      reason: "Light hydration and easy layering"
    },
    {
      name: "Supergoop Unseen Sunscreen SPF 40",
      image:
        "https://images.pexels.com/photos/7319291/pexels-photo-7319291.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://supergoop.com/products/unseen-sunscreen",
      reason: "Daily UV protection"
    }
  ]
};

const bySkinConcern = {
  acne: [
    {
      name: "Paula's Choice 2% BHA Liquid",
      image:
        "https://images.pexels.com/photos/8128068/pexels-photo-8128068.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
      reason: "Helps unclog pores"
    }
  ],
  pigmentation: [
    {
      name: "La Roche-Posay Mela B3 Serum",
      image:
        "https://images.pexels.com/photos/6621137/pexels-photo-6621137.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.laroche-posay.us/our-products/face/face-serum/mela-b3-serum-dark-spots-serum-3337875890182.html",
      reason: "Targets dark spots"
    }
  ],
  wrinkles: [
    {
      name: "Olay Retinol 24 Night Moisturizer",
      image:
        "https://images.pexels.com/photos/8127949/pexels-photo-8127949.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.olay.com/regenerist-retinol-24-night-moisturizer",
      reason: "Supports anti-aging routine"
    }
  ]
};

const byHairType = {
  dry: [
    {
      name: "Moroccanoil Hydrating Shampoo",
      image:
        "https://images.pexels.com/photos/3993448/pexels-photo-3993448.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.moroccanoil.com/products/hydrating-shampoo",
      reason: "Adds moisture and softness"
    },
    {
      name: "Olaplex No.6 Bond Smoother",
      image:
        "https://images.pexels.com/photos/3737600/pexels-photo-3737600.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://olaplex.com/products/no-6-bond-smoother",
      reason: "Reduces dryness and breakage"
    }
  ],
  oily: [
    {
      name: "Neutrogena T/Sal Shampoo",
      image:
        "https://images.pexels.com/photos/3993311/pexels-photo-3993311.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.neutrogena.com/products/haircare/t-sal-therapeutic-shampoo/6809450.html",
      reason: "Helps control scalp build-up"
    },
    {
      name: "Living Proof Perfect Hair Day Shampoo",
      image:
        "https://images.pexels.com/photos/3993336/pexels-photo-3993336.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.livingproof.com/perfect-hair-day-shampoo/R1001.html",
      reason: "Lightweight cleansing"
    }
  ],
  combination: [
    {
      name: "Briogeo Scalp Revival Shampoo",
      image:
        "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.briogeohair.com/products/scalp-revival-charcoal-coconut-oil-micro-exfoliating-shampoo",
      reason: "Balances scalp and lengths"
    },
    {
      name: "L'Oreal Elvive Hyaluron Plump Conditioner",
      image:
        "https://images.pexels.com/photos/6621198/pexels-photo-6621198.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.lorealparisusa.com/hair-care-hair-style/shampoo/elvive-hyaluron-plump-shampoo",
      reason: "Hydrates dry ends"
    }
  ],
  normal: [
    {
      name: "SheaMoisture Daily Hydration Shampoo",
      image:
        "https://images.pexels.com/photos/3735638/pexels-photo-3735638.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.sheamoisture.com/coconut-and-hibiscus-curl-and-shine-shampoo/764302290223",
      reason: "Daily care and softness"
    },
    {
      name: "Ouai Leave-In Conditioner",
      image:
        "https://images.pexels.com/photos/7127867/pexels-photo-7127867.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://theouai.com/products/leave-in-conditioner",
      reason: "Detangles and protects"
    }
  ]
};

const byHairConcern = {
  "hair fall": [
    {
      name: "The Ordinary Multi-Peptide Serum for Hair Density",
      image:
        "https://images.pexels.com/photos/4465838/pexels-photo-4465838.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://theordinary.com/en-us/multi-peptide-serum-for-hair-density-100434.html",
      reason: "Supports scalp health"
    }
  ],
  dandruff: [
    {
      name: "Nizoral Anti-Dandruff Shampoo",
      image:
        "https://images.pexels.com/photos/3737607/pexels-photo-3737607.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://www.nizoral.com/products/nizoral-a-d-anti-dandruff-shampoo",
      reason: "Targets flakes and itch"
    }
  ],
  frizz: [
    {
      name: "Color Wow Dream Coat",
      image:
        "https://images.pexels.com/photos/3735636/pexels-photo-3735636.jpeg?auto=compress&cs=tinysrgb&w=600",
      url: "https://colorwowhair.com/products/dream-coat-supernatural-spray",
      reason: "Humidity defense"
    }
  ]
};

const uniqueByName = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
};

const normalizeKey = (value, fallback = "normal") => {
  if (!value) return fallback;
  return String(value).trim().toLowerCase();
};

const normalizeConcerns = (values) =>
  Array.isArray(values) ? values.map((v) => normalizeKey(v, "")).filter(Boolean) : [];

export const getSkinProductRecommendations = (skinType, concerns = []) => {
  const typeKey = normalizeKey(skinType, "normal");
  const concernKeys = normalizeConcerns(concerns);

  const list = [
    ...(bySkinType[typeKey] || bySkinType.normal),
    ...concernKeys.flatMap((concern) => bySkinConcern[concern] || [])
  ];

  return uniqueByName(list).slice(0, 6).map((item) => ({ ...item, image: item.image || fallbackImage }));
};

export const getHairProductRecommendations = (hairType, concerns = []) => {
  const typeKey = normalizeKey(hairType, "normal");
  const concernKeys = normalizeConcerns(concerns);

  const list = [
    ...(byHairType[typeKey] || byHairType.normal),
    ...concernKeys.flatMap((concern) => byHairConcern[concern] || [])
  ];

  return uniqueByName(list).slice(0, 6).map((item) => ({ ...item, image: item.image || fallbackImage }));
};

export const toDisplayLabel = (value, fallback = "Normal") => {
  const key = normalizeKey(value, fallback.toLowerCase());
  return key.charAt(0).toUpperCase() + key.slice(1);
};
