export const localInventoryDetections = [
  { item: "Sparkling water", status: "Low stock", action: "Add 12-pack to restock run" },
  { item: "Guest towels", status: "Ready", action: "Place in guest bath" },
  { item: "Olive oil", status: "Running low", action: "Replace with saved preference" },
  { item: "Laundry pods", status: "Low stock", action: "Create cleaning supply task" }
];

export const localMemoryNodes = [
  { label: "Dining", value: "Late seating, quiet tables", strength: 92 },
  { label: "Home", value: "White towels, citrus scent", strength: 88 },
  { label: "Inventory", value: "Topo Chico, olive oil, pods", strength: 84 },
  { label: "Calendar", value: "No calls after airport days", strength: 79 }
];

export const localCleaningRooms = [
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
