export const demoAssistants = [
  {
    id: "marisol",
    display_name: "Marisol V.",
    headline: "Estate resets, hosting, pantry flow",
    home_market: "Miami",
    hourly_rate_cents: 6800,
    rating: "4.98",
    completed_jobs: 612,
    eta_minutes: 18,
    ai_tags: ["Home reset", "Events", "Inventory"]
  },
  {
    id: "dante",
    display_name: "Dante R.",
    headline: "Calendar rescue, travel, reservations",
    home_market: "Miami",
    hourly_rate_cents: 7400,
    rating: "4.96",
    completed_jobs: 438,
    eta_minutes: 11,
    ai_tags: ["Calendar", "Travel", "Dining"]
  },
  {
    id: "imani",
    display_name: "Imani K.",
    headline: "Errands, shopping, client taste profiles",
    home_market: "Miami",
    hourly_rate_cents: 6200,
    rating: "4.94",
    completed_jobs: 521,
    eta_minutes: 24,
    ai_tags: ["Errands", "Wardrobe", "Gifts"]
  }
];

export const demoInventoryDetections = [
  { item: "Sparkling water", status: "Low stock", action: "Add 12-pack to restock run" },
  { item: "Guest towels", status: "Ready", action: "Place in guest bath" },
  { item: "Olive oil", status: "Running low", action: "Replace with saved preference" },
  { item: "Laundry pods", status: "Low stock", action: "Create cleaning supply task" }
];

export const demoMemoryNodes = [
  { label: "Dining", value: "Late seating, quiet tables", strength: 92 },
  { label: "Home", value: "White towels, citrus scent", strength: 88 },
  { label: "Inventory", value: "Topo Chico, olive oil, pods", strength: 84 },
  { label: "Calendar", value: "No calls after airport days", strength: 79 }
];

export const demoAssistantMissions = [
  {
    title: "Penthouse reset + restock",
    market: "Miami",
    payout_cents: 14800,
    route_minutes: 31,
    trust_score: 97,
    mission_brief: "Home reset, guest towels, sparkling water, reservation watch."
  },
  {
    title: "Dry cleaning + gift run",
    market: "Miami",
    payout_cents: 8600,
    route_minutes: 18,
    trust_score: 91,
    mission_brief: "Two pickups, one return, client taste profile attached."
  },
  {
    title: "Travel calm pack",
    market: "Miami",
    payout_cents: 12200,
    route_minutes: 42,
    trust_score: 94,
    mission_brief: "Packing list, car timing, dinner hold, weather note."
  }
];

export const demoCleaningRooms = [
  {
    id: "kitchen",
    name: "Kitchen",
    zone: "Food + surfaces",
    estimated_minutes: 34,
    proof_count: 3,
    task_count: 5
  },
  {
    id: "primary-bath",
    name: "Primary bath",
    zone: "Spa standard",
    estimated_minutes: 28,
    proof_count: 3,
    task_count: 5
  },
  {
    id: "living",
    name: "Living room",
    zone: "Flow + comfort",
    estimated_minutes: 24,
    proof_count: 2,
    task_count: 5
  },
  {
    id: "entry",
    name: "Entry",
    zone: "First impression",
    estimated_minutes: 16,
    proof_count: 2,
    task_count: 4
  }
];
