const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

const PRICE_LIMITS = {
  consultation: { min: 0, max: 10000 },
  hourly: { min: 0, max: 25000 },
  project: { min: 0, max: 100000 },
};

const CATEGORIES = [
  "Murarstwo",
  "Tynkowanie",
  "Glazurnictwo",
  "Dekarstwo",
  "Elektryka",
  "Hydraulika",
  "Stolarstwo",
  "Mechanika",
  "Lakiernictwo",
  "Wulkanizacja",
  "Informatyka",
  "Grafika",
  "Fotografia",
  "Księgowość",
  "Prawo",
  "Medycyna",
  "Fizjoterapia",
  "Kosmetologia",
  "Fryzjerstwo",
  "Dietetyka",
  "Gastronomia",
  "Ogrodnictwo",
];

export { DAYS, PRICE_LIMITS, CATEGORIES };
