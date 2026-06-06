const assistants = [
  {
    id: "marisol",
    name: "Marisol V.",
    initials: "MV",
    headline: "Estate resets, hosting, pantry flow",
    eta: 18,
    rate: 68,
    rating: 4.98,
    jobs: 612,
    acceptance: "96%",
    tags: ["Home reset", "Events", "Inventory"],
    bio: "Luxury hotel standards with home memory. Great for before-guests and after-party recovery."
  },
  {
    id: "dante",
    name: "Dante R.",
    initials: "DR",
    headline: "Calendar rescue, travel, reservations",
    eta: 11,
    rate: 74,
    rating: 4.96,
    jobs: 438,
    acceptance: "93%",
    tags: ["Calendar", "Travel", "Dining"],
    bio: "Turns chaotic days into clean routes. Strong with VIP reservations and last minute changes."
  },
  {
    id: "imani",
    name: "Imani K.",
    initials: "IK",
    headline: "Errands, shopping, client taste profiles",
    eta: 24,
    rate: 62,
    rating: 4.94,
    jobs: 521,
    acceptance: "98%",
    tags: ["Errands", "Wardrobe", "Gifts"],
    bio: "Precise, warm, and fast. Builds preference memory so repeat tasks get easier every time."
  }
];

const serviceTemplates = {
  home: "Reset the apartment before 6 PM, restock sparkling water, prep guest towels, and move dinner reservation if traffic gets bad.",
  calendar: "Clean up tomorrow's calendar, protect two focus blocks, move low-priority calls, and book a car between meetings.",
  errands: "Pick up dry cleaning, return two packages, buy a host gift, and send photo confirmation for each stop.",
  travel: "Find two flight options, hold a dinner reservation near the hotel, and build a no-stress airport timeline.",
  inventory: "Scan the fridge and supply closet, flag low stock, create a shopping list, and schedule a restock assistant."
};

const timelineItems = [
  { time: "9:20", title: "Assistant arrives", body: "Marisol gets building access and starts the home reset.", score: 98 },
  { time: "11:10", title: "Errand route", body: "Dry cleaning, package return, and grocery restock batched into one loop.", score: 94 },
  { time: "3:40", title: "Reservation watch", body: "AURA monitors traffic and moves dinner by 20 minutes if needed.", score: 91 },
  { time: "5:35", title: "Quality check", body: "Photo proof, checklist completion, and feedback prompt before wrap.", score: 96 }
];

const calendarInsights = [
  "Move the 4:30 call to tomorrow. Saves 38 minutes of dead travel time.",
  "Bundle grocery restock with dry cleaning. Assistant payout rises without raising client friction.",
  "Hold a 6:45 dinner reservation now and release it if traffic stays clear."
];

const checklists = [
  {
    title: "Hotel-level home reset",
    items: ["Clear surfaces", "Fresh towels", "Restock drinks", "Scent check", "Photo proof"]
  },
  {
    title: "Errand route",
    items: ["Confirm stops", "Optimize route", "Send pickup photos", "Track receipts", "Final drop"]
  },
  {
    title: "Travel ready",
    items: ["Flight options", "Packing list", "Car timing", "Dining hold", "Weather note"]
  }
];

const cleaningRooms = [
  {
    id: "kitchen",
    name: "Kitchen",
    zone: "Food + surfaces",
    minutes: 34,
    proof: 3,
    tasks: [
      "Clear counters and stage items by use",
      "Sanitize sink, faucet, handles, and backsplash",
      "Wipe appliances, cabinet touchpoints, and cooktop",
      "Reset fridge front and remove expired visible items",
      "Restock paper goods and preferred water"
    ],
    deepAdds: ["Degrease hood and cabinet edges", "Detail inside microwave and drawer pulls"],
    turnoverAdds: ["Stage coffee, glasses, and guest snack zone"]
  },
  {
    id: "primary-bath",
    name: "Primary bath",
    zone: "Spa standard",
    minutes: 28,
    proof: 3,
    tasks: [
      "Disinfect vanity, sink, faucet, and mirror",
      "Scrub shower glass, fixtures, and drain line",
      "Clean toilet exterior, seat, base, and floor edge",
      "Replace towels with saved fold standard",
      "Confirm scent, tissue, soap, and guest-ready counter"
    ],
    deepAdds: ["Descale shower head and detail grout lines", "Polish metal fixtures to reflection check"],
    turnoverAdds: ["Stage fresh hand towels and sealed guest amenities"]
  },
  {
    id: "guest-bath",
    name: "Guest bath",
    zone: "Arrival impression",
    minutes: 22,
    proof: 3,
    tasks: [
      "Disinfect sink, faucet, mirror, and counter",
      "Clean toilet and floor perimeter",
      "Replace towels and align hand soap",
      "Restock tissue and visible guest supplies",
      "Final scent and dry-floor check"
    ],
    deepAdds: ["Detail grout corners and vent face", "Polish fixtures and baseboards"],
    turnoverAdds: ["Set guest towel stack and visible amenity tray"]
  },
  {
    id: "living",
    name: "Living room",
    zone: "Visual reset",
    minutes: 24,
    proof: 2,
    tasks: [
      "Clear surfaces and return objects to memory map",
      "Dust tables, media console, lamps, and frames",
      "Reset pillows, throws, remotes, and charging areas",
      "Vacuum traffic paths and under visible furniture",
      "Final room photo from entry angle"
    ],
    deepAdds: ["Detail baseboards and under cushions", "Spot clean glass and high-touch edges"],
    turnoverAdds: ["Stage room for first-view guest impression"]
  },
  {
    id: "bedroom",
    name: "Bedroom",
    zone: "Rest standard",
    minutes: 30,
    proof: 2,
    tasks: [
      "Make bed to hotel fold standard",
      "Clear nightstands and align charging items",
      "Dust surfaces, lamps, mirror, and visible shelves",
      "Reset laundry, hamper, and wardrobe overflow",
      "Vacuum floor and confirm calm-room finish"
    ],
    deepAdds: ["Rotate detail pass under bed edge", "Wipe closet handles and drawer faces"],
    turnoverAdds: ["Change linens and stage guest sleep setup"]
  },
  {
    id: "entry",
    name: "Entry",
    zone: "First 10 seconds",
    minutes: 16,
    proof: 2,
    tasks: [
      "Clear shoes, bags, mail, and visual clutter",
      "Wipe console, door handles, and switch plates",
      "Reset keys, tray, scent, and arrival surface",
      "Vacuum or mop entry path",
      "Photo proof from door swing angle"
    ],
    deepAdds: ["Detail threshold, baseboard, and door scuffs"],
    turnoverAdds: ["Stage welcome tray or guest access note"]
  },
  {
    id: "laundry",
    name: "Laundry",
    zone: "Utility flow",
    minutes: 20,
    proof: 2,
    tasks: [
      "Sort visible laundry by client preference",
      "Wipe machines, folding surface, and lint area",
      "Restock detergent, pods, dryer sheets, and bags",
      "Fold or stage completed items",
      "Flag damaged, delicate, or unknown garments"
    ],
    deepAdds: ["Clean lint trap housing and machine gasket", "Detail storage shelf and floor corners"],
    turnoverAdds: ["Run guest towel and sheet readiness check"]
  }
];

const inventorySamples = [
  { item: "Sparkling water", status: "Low stock", action: "Add 12-pack to restock run" },
  { item: "Guest towels", status: "Ready", action: "Place in guest bath" },
  { item: "Olive oil", status: "Running low", action: "Replace with saved preference" },
  { item: "Laundry pods", status: "Low stock", action: "Create cleaning supply task" }
];

const intentAtomsByService = {
  home: [
    { label: "Space reset", score: 96, detail: "Hotel-grade surface, scent, towel, and room flow" },
    { label: "Restock run", score: 88, detail: "Sparkling water, oil, laundry, guest-ready supplies" },
    { label: "Reservation watch", score: 81, detail: "Traffic-aware dinner hold with release timing" },
    { label: "Proofstream", score: 94, detail: "Before/after photos plus client confirmation" }
  ],
  calendar: [
    { label: "Conflict burn-down", score: 91, detail: "Protects focus blocks and moves low-value calls" },
    { label: "Route buffer", score: 86, detail: "Adds travel cushion where calendar usually breaks" },
    { label: "Assistant handoff", score: 89, detail: "Turns calls, cars, and errands into one mission" },
    { label: "Client memory", score: 83, detail: "Keeps preferred cadence and meeting fatigue in view" }
  ],
  errands: [
    { label: "Stop compression", score: 93, detail: "Batches dry cleaning, returns, and shopping loops" },
    { label: "Receipt capture", score: 87, detail: "Auto-tags spend for household memory" },
    { label: "Taste match", score: 84, detail: "Uses saved gift, brand, and vendor preferences" },
    { label: "Proofstream", score: 90, detail: "Pickup/drop photos and exception notes" }
  ],
  travel: [
    { label: "Flight triage", score: 89, detail: "Ranks options by stress, cost, loyalty, and timing" },
    { label: "Arrival choreography", score: 92, detail: "Cars, bags, meals, and hotel timing in sequence" },
    { label: "Hold engine", score: 82, detail: "Temporary dinner and service holds before commitment" },
    { label: "Packing memory", score: 86, detail: "Learns kit preferences and climate needs" }
  ],
  inventory: [
    { label: "Shelf vision", score: 90, detail: "Turns photos into item states and restock actions" },
    { label: "Waste radar", score: 79, detail: "Flags expiring meals, duplicates, and overbuy risk" },
    { label: "Vendor memory", score: 88, detail: "Maps item preferences to preferred stores" },
    { label: "Auto mission", score: 93, detail: "Converts low-stock signals into assistant routes" }
  ]
};

const memoryNodes = [
  { label: "Dining", value: "Late seating, quiet tables", strength: 92 },
  { label: "Home", value: "White towels, citrus scent", strength: 88 },
  { label: "Inventory", value: "Topo Chico, olive oil, pods", strength: 84 },
  { label: "Calendar", value: "No calls after airport days", strength: 79 }
];

const autopilotQueue = [
  {
    id: "guest-mode",
    title: "Guest Mode",
    body: "AURA sees towels, sparkling water, and dinner timing converging. Arm a 2-hour reset before guests arrive.",
    value: "$54 saved friction",
    readiness: 91
  },
  {
    id: "fridge-sentinel",
    title: "Fridge Sentinel",
    body: "Inventory decay and dinner calendar suggest a restock run tomorrow morning before the week gets loud.",
    value: "18 min decision saved",
    readiness: 84
  },
  {
    id: "calendar-shield",
    title: "Calendar Shield",
    body: "AURA can move one low-value call and create a pickup window without touching protected focus time.",
    value: "2.1h reclaimed",
    readiness: 78
  }
];

const preferenceVault = [
  { label: "Water", value: "Topo Chico glass bottles" },
  { label: "Towels", value: "White, guest bath folded thirds" },
  { label: "Dinner", value: "Late seating, low-noise room" },
  { label: "Errands", value: "Photo proof before checkout" }
];

const assistantMissions = [
  {
    id: "mission-reset",
    title: "Penthouse reset + restock",
    client: "Brickell, 2.8 mi",
    payout: 148,
    route: 31,
    trust: 97,
    body: "Home reset, guest towels, sparkling water, reservation watch."
  },
  {
    id: "mission-errand",
    title: "Dry cleaning + gift run",
    client: "Design District, 1.4 mi",
    payout: 86,
    route: 18,
    trust: 91,
    body: "Two pickups, one return, client taste profile attached."
  },
  {
    id: "mission-travel",
    title: "Travel calm pack",
    client: "Edgewater, 3.2 mi",
    payout: 122,
    route: 42,
    trust: 94,
    body: "Packing list, car timing, dinner hold, weather note."
  }
];

const routeLegs = [
  { stop: "01", title: "Brickell reset", detail: "Highest trust impact, start while building access is warm", eta: "9:20" },
  { stop: "02", title: "Market restock", detail: "Inventory list overlaps with gift route", eta: "11:05" },
  { stop: "03", title: "Design District", detail: "Dry cleaning return and host gift in one loop", eta: "12:10" }
];

const proofstreamItems = [
  "Entry condition photo",
  "Restock receipt captured",
  "Guest bath final proof",
  "Client preference delta logged"
];

const shell = document.querySelector(".app-shell");
const modeButtons = document.querySelectorAll("[data-mode-button]");
const serviceChips = document.querySelectorAll("[data-service]");
const taskInput = document.querySelector("#taskInput");
const budgetSelect = document.querySelector("#budgetSelect");
const timeSelect = document.querySelector("#timeSelect");
const quotePrice = document.querySelector("#quotePrice");
const assistantPayout = document.querySelector("#assistantPayout");
const auraFee = document.querySelector("#auraFee");
const bookingStatus = document.querySelector("#bookingStatus");
const assistantList = document.querySelector("#assistantList");
const timeline = document.querySelector("#timeline");
const calendarInsightsEl = document.querySelector("#calendarInsights");
const checklistBoard = document.querySelector("#checklistBoard");
const roomChipGrid = document.querySelector("#roomChipGrid");
const cleaningLevel = document.querySelector("#cleaningLevel");
const cleaningPriority = document.querySelector("#cleaningPriority");
const cleanprintIntensity = document.querySelector("#cleanprintIntensity");
const buildCleanprint = document.querySelector("#buildCleanprint");
const roomPlan = document.querySelector("#roomPlan");
const cleanRoomCount = document.querySelector("#cleanRoomCount");
const cleanTaskCount = document.querySelector("#cleanTaskCount");
const cleanProofCount = document.querySelector("#cleanProofCount");
const cleanMinutes = document.querySelector("#cleanMinutes");
const cleanprintStatus = document.querySelector("#cleanprintStatus");
const detectionList = document.querySelector("#detectionList");
const inventoryUpload = document.querySelector("#inventoryUpload");
const inventoryPreview = document.querySelector("#inventoryPreview");
const ratingRange = document.querySelector("#ratingRange");
const ratingOutput = document.querySelector("#ratingOutput");
const tipRange = document.querySelector("#tipRange");
const tipOutput = document.querySelector("#tipOutput");
const hoursRange = document.querySelector("#hoursRange");
const hoursOutput = document.querySelector("#hoursOutput");
const weeklyGross = document.querySelector("#weeklyGross");
const liveBookings = document.querySelector("#liveBookings");
const matchHeat = document.querySelector("#matchHeat");
const frictionSaved = document.querySelector("#frictionSaved");
const repeatOdds = document.querySelector("#repeatOdds");
const reactorMode = document.querySelector("#reactorMode");
const reactorHeadline = document.querySelector("#reactorHeadline");
const reactorValueBadge = document.querySelector("#reactorValueBadge");
const reactorSummary = document.querySelector("#reactorSummary");
const reactorKpis = document.querySelector("#reactorKpis");
const opsFlow = document.querySelector("#opsFlow");
const intentAtoms = document.querySelector("#intentAtoms");
const matchLattice = document.querySelector("#matchLattice");
const valueStack = document.querySelector("#valueStack");
const latticeWinner = document.querySelector("#latticeWinner");
const marginSignal = document.querySelector("#marginSignal");
const memoryNodesEl = document.querySelector("#memoryNodes");
const autopilotQueueEl = document.querySelector("#autopilotQueue");
const preferenceVaultEl = document.querySelector("#preferenceVault");
const autopilotReadiness = document.querySelector("#autopilotReadiness");
const missionQueue = document.querySelector("#missionQueue");
const routeStack = document.querySelector("#routeStack");
const proofstream = document.querySelector("#proofstream");
const routeLift = document.querySelector("#routeLift");
const proofScore = document.querySelector("#proofScore");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const authUser = document.querySelector("#authUser");
const authAvatar = document.querySelector("#authAvatar");
const authName = document.querySelector("#authName");
const authEmail = document.querySelector("#authEmail");
const authStatus = document.querySelector("#authStatus");
const authGreeting = document.querySelector("#authGreeting");

let auth0Client = null;
let authConfig = null;
let authState = {
  ready: false,
  enabled: false,
  apiProtectionEnabled: false,
  authenticated: false,
  user: null,
  token: ""
};
let preferenceSaveTimer = null;

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function selectedService() {
  return document.querySelector(".service-chip.is-active")?.dataset.service || "home";
}

function quoteState() {
  const base = Number(budgetSelect.value);
  const urgency = timeSelect.value === "urgent" ? 32 : 0;
  const recurringCredit = timeSelect.value === "recurring" ? -18 : 0;
  const total = Math.max(65, base + urgency + recurringCredit);
  const fee = Math.round(total * 0.18);
  return { total, fee, payout: total - fee };
}

function topAssistant(service = selectedService()) {
  const scored = assistants.map((assistant) => ({
    ...assistant,
    fit:
      62 +
      (assistant.tags.join(" ").toLowerCase().includes(service) ? 22 : 6) +
      Math.round((assistant.rating - 4.9) * 80) +
      Math.max(0, 10 - Math.round(assistant.eta / 4))
  }));
  return scored.sort((a, b) => b.fit - a.fit)[0];
}

function updateQuote() {
  const { total, fee, payout } = quoteState();
  quotePrice.textContent = currency(total);
  assistantPayout.textContent = currency(payout);
  auraFee.textContent = currency(fee);
  renderReactor(selectedService());
  renderMatchLattice(selectedService());
  renderValueStack(total, fee, payout);
}

function setMode(mode) {
  shell.dataset.mode = mode;
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.modeButton === mode);
  });
  bookingStatus.textContent =
    mode === "earn"
      ? "Provider mode ready. AURA will price jobs, route your day, and protect your rating."
      : "AURA is watching weather, traffic, ETA, and assistant fit.";
}

function renderAssistants() {
  assistantList.innerHTML = assistants
    .map(
      (assistant) => `
        <article class="assistant-card">
          <div class="assistant-top">
            <div class="assistant-avatar" aria-hidden="true">${assistant.initials}</div>
            <div>
              <h3>${assistant.name}</h3>
              <p>${assistant.headline}</p>
            </div>
          </div>
          <p>${assistant.bio}</p>
          <div class="tag-row">
            ${assistant.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="assistant-stats">
            <span><strong>${assistant.eta}m</strong> ETA</span>
            <span><strong>${assistant.rating}</strong> Rating</span>
            <span><strong>$${assistant.rate}</strong> Hour</span>
          </div>
          <button class="primary-action hire-assistant" data-assistant="${assistant.id}" type="button">Book ${assistant.name.split(" ")[0]}</button>
        </article>
      `
    )
    .join("");
}

function renderTimeline() {
  timeline.innerHTML = timelineItems
    .map(
      (item) => `
        <article class="timeline-item">
          <time>${item.time}</time>
          <div>
            <strong>${item.title}</strong>
            <p>${item.body}</p>
          </div>
          <span class="score-badge">${item.score}</span>
        </article>
      `
    )
    .join("");

  calendarInsightsEl.innerHTML = calendarInsights
    .map(
      (insight) => `
        <button class="insight-button" type="button">${insight}</button>
      `
    )
    .join("");
}

function renderReactor(service) {
  const atoms = intentAtomsByService[service] || intentAtomsByService.home;
  const serviceLabel = service[0].toUpperCase() + service.slice(1);
  const average = Math.round(atoms.reduce((sum, atom) => sum + atom.score, 0) / atoms.length);
  const friction = (1.4 + average / 95).toFixed(1);
  const repeat = Math.min(91, Math.round(54 + average / 3));
  const assistant = topAssistant(service);
  const { total, fee, payout } = quoteState();
  const routeCompression = timeSelect.value === "urgent" ? 22 : 38;
  const dispatchSteps = [
    { label: "Parse", value: `${atoms.length} atoms`, detail: "AURA decomposes the request" },
    { label: "Price", value: currency(total), detail: `${currency(fee)} platform revenue` },
    { label: "Match", value: `${assistant.fit} fit`, detail: `${assistant.name}, ${assistant.eta}m ETA` },
    { label: "Dispatch", value: currency(payout), detail: "Assistant payout with proofstream" }
  ];

  reactorMode.textContent = `${serviceLabel} reactor`;
  reactorHeadline.textContent = `${assistant.name} can execute in ${assistant.eta} minutes`;
  reactorValueBadge.textContent = `${friction}h saved`;
  reactorSummary.textContent = `AURA is turning the request into an executable operation: ${currency(total)} client total, ${currency(payout)} assistant payout, ${routeCompression}% route compression, and ${repeat}% repeat odds.`;
  matchHeat.textContent = average;
  frictionSaved.textContent = `${friction}h`;
  repeatOdds.textContent = `${repeat}%`;

  reactorKpis.innerHTML = [
    { label: "ETA", value: `${assistant.eta}m` },
    { label: "Assistant fit", value: assistant.fit },
    { label: "AURA fee", value: currency(fee) },
    { label: "Route gain", value: `${routeCompression}%` }
  ]
    .map(
      (kpi) => `
        <div>
          <span>${kpi.label}</span>
          <strong>${kpi.value}</strong>
        </div>
      `
    )
    .join("");

  opsFlow.innerHTML = dispatchSteps
    .map(
      (step, index) => `
        <div class="ops-step">
          <b>${index + 1}</b>
          <strong>${step.label}</strong>
          <span>${step.value}</span>
          <small>${step.detail}</small>
        </div>
      `
    )
    .join("");

  intentAtoms.innerHTML = atoms
    .map(
      (atom) => `
        <div class="atom-card">
          <span>${atom.label}</span>
          <strong>${atom.score}</strong>
          <span>${atom.detail}</span>
        </div>
      `
    )
    .join("");
}

function renderMatchLattice(service) {
  const scored = assistants
    .map((assistant) => ({
      ...assistant,
      fit:
        62 +
        (assistant.tags.join(" ").toLowerCase().includes(service) ? 22 : 6) +
        Math.round((assistant.rating - 4.9) * 80) +
        Math.max(0, 10 - Math.round(assistant.eta / 4))
    }))
    .sort((a, b) => b.fit - a.fit);

  latticeWinner.textContent = scored[0].name;
  matchLattice.innerHTML = scored
    .map(
      (assistant) => `
        <div class="lattice-row">
          <strong>${assistant.name}</strong>
          <div class="fit-track" aria-label="${assistant.fit} fit score"><span style="--level: ${Math.min(100, assistant.fit)}%"></span></div>
          <span class="fit-score">${assistant.fit}</span>
        </div>
      `
    )
    .join("");
}

function renderValueStack(total, fee, payout) {
  const service = selectedService();
  const assistant = topAssistant(service);
  const savedMinutes = Math.round((Number(matchHeat.textContent) || 88) * 1.7);
  const routeCompression = timeSelect.value === "urgent" ? 22 : 38;

  marginSignal.textContent = `${Math.round((fee / total) * 100)}% take`;
  valueStack.innerHTML = [
    { label: "Client total", value: currency(total), level: 100 },
    { label: `${assistant.name} payout`, value: currency(payout), level: Math.round((payout / total) * 100) },
    { label: "AURA revenue", value: currency(fee), level: Math.round((fee / total) * 100) },
    { label: "Friction minutes erased", value: `${savedMinutes}m`, level: Math.min(100, savedMinutes / 2) },
    { label: "Route compression", value: `${routeCompression}%`, level: routeCompression }
  ]
    .map(
      (row) => `
        <div class="value-row">
          <div>
            <strong>${row.value}</strong>
            <span>${row.label}</span>
            <div class="value-track"><span style="--level: ${row.level}%"></span></div>
          </div>
        </div>
      `
    )
    .join("");
}

function renderChecklists() {
  checklistBoard.innerHTML = checklists
    .map(
      (list, listIndex) => `
        <article class="checklist-card" data-checklist="${listIndex}">
          <h3>${list.title}</h3>
          <p><span class="check-count">0</span> of ${list.items.length} verified</p>
          <div class="progress-track" aria-hidden="true"><span class="progress-fill"></span></div>
          ${list.items
            .map(
              (item, itemIndex) => `
                <label class="check-row">
                  <input type="checkbox" data-list="${listIndex}" data-item="${itemIndex}">
                  <span>${item}</span>
                </label>
              `
            )
            .join("")}
        </article>
      `
    )
    .join("");
}

function levelLabel(level) {
  return {
    reset: "Reset",
    deep: "Deep",
    turnover: "Turnover"
  }[level] || "Reset";
}

function selectedCleaningRooms() {
  return Array.from(roomChipGrid.querySelectorAll(".room-chip.is-selected")).map((button) => button.dataset.room);
}

function roomTasksFor(room, level, priority) {
  const tasks = [...room.tasks];
  if (level === "deep") tasks.push(...room.deepAdds);
  if (level === "turnover") tasks.push(...room.turnoverAdds);
  if (priority === "photo") tasks.push("Capture extra proof sweep from room entry and detail angle");
  if (priority === "speed") tasks.unshift("Start with visible-impact surfaces before detail pass");
  return tasks;
}

function buildCleaningPlan() {
  const level = cleaningLevel.value;
  const priority = cleaningPriority.value;
  const selected = selectedCleaningRooms();
  const rooms = cleaningRooms
    .filter((room) => selected.includes(room.id))
    .map((room) => {
      const tasks = roomTasksFor(room, level, priority);
      const multiplier = level === "deep" ? 1.35 : level === "turnover" ? 1.18 : 1;
      const priorityMinutes = priority === "photo" ? 4 : priority === "speed" ? -3 : 0;
      return {
        ...room,
        tasks,
        estimate: Math.max(12, Math.round(room.minutes * multiplier + priorityMinutes)),
        proofCount: room.proof + (priority === "photo" ? 2 : level === "turnover" ? 1 : 0)
      };
    });
  return { level, priority, rooms };
}

function renderRoomBuilder() {
  const defaultRooms = new Set(["kitchen", "primary-bath", "living", "entry"]);
  roomChipGrid.innerHTML = cleaningRooms
    .map(
      (room) => `
        <button class="room-chip ${defaultRooms.has(room.id) ? "is-selected" : ""}" data-room="${room.id}" type="button">
          <strong>${room.name}</strong>
          <span>${room.zone}</span>
        </button>
      `
    )
    .join("");
}

function renderRoomPlan() {
  const plan = buildCleaningPlan();
  cleanprintIntensity.textContent = levelLabel(plan.level);

  if (!plan.rooms.length) {
    roomPlan.innerHTML = `
      <article class="room-plan-empty">
        <strong>Select at least one room</strong>
        <span>AURA needs rooms before it can build the Cleanprint.</span>
      </article>
    `;
    cleanRoomCount.textContent = "0";
    cleanTaskCount.textContent = "0";
    cleanProofCount.textContent = "0";
    cleanMinutes.textContent = "0m";
    return;
  }

  const totalTasks = plan.rooms.reduce((sum, room) => sum + room.tasks.length, 0);
  const totalProof = plan.rooms.reduce((sum, room) => sum + room.proofCount, 0);
  const totalMinutes = plan.rooms.reduce((sum, room) => sum + room.estimate, 0);
  cleanRoomCount.textContent = plan.rooms.length;
  cleanTaskCount.textContent = totalTasks;
  cleanProofCount.textContent = totalProof;
  cleanMinutes.textContent = `${totalMinutes}m`;

  roomPlan.innerHTML = plan.rooms
    .map(
      (room, roomIndex) => `
        <article class="room-card" data-room-card="${roomIndex}">
          <header>
            <div>
              <span>${room.zone}</span>
              <h3>${room.name}</h3>
            </div>
            <div class="room-metrics">
              <strong>${room.estimate}m</strong>
              <span>${room.proofCount} proofs</span>
            </div>
          </header>
          <div class="progress-track" aria-hidden="true"><span class="progress-fill"></span></div>
          <div class="room-task-list">
            ${room.tasks
              .map(
                (task, taskIndex) => `
                  <label class="room-task">
                    <input type="checkbox" data-room-card="${roomIndex}" data-task="${taskIndex}">
                    <span>${task}</span>
                  </label>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");

  taskInput.value = `Build a ${levelLabel(plan.level).toLowerCase()} Cleanprint for ${plan.rooms.map((room) => room.name).join(", ")} with ${totalTasks} tasks, ${totalProof} proof points, and a ${totalMinutes} minute estimate.`;
  updateQuote();
}

function updateRoomProgress(roomIndex) {
  const card = roomPlan.querySelector(`[data-room-card="${roomIndex}"]`);
  if (!card) return;
  const boxes = card.querySelectorAll("input[type='checkbox']");
  const complete = Array.from(boxes).filter((box) => box.checked).length;
  card.querySelector(".progress-fill").style.width = `${(complete / Math.max(1, boxes.length)) * 100}%`;
}

function cleaningPlanPayload() {
  const plan = buildCleaningPlan();
  const totalTasks = plan.rooms.reduce((sum, room) => sum + room.tasks.length, 0);
  const totalProof = plan.rooms.reduce((sum, room) => sum + room.proofCount, 0);
  const totalMinutes = plan.rooms.reduce((sum, room) => sum + room.estimate, 0);

  return {
    level: plan.level,
    priority: plan.priority,
    market: "Miami",
    roomCount: plan.rooms.length,
    taskCount: totalTasks,
    proofCount: totalProof,
    estimatedMinutes: totalMinutes,
    rooms: plan.rooms.map((room, position) => ({
      id: room.id,
      name: room.name,
      zone: room.zone,
      position: position + 1,
      estimatedMinutes: room.estimate,
      proofCount: room.proofCount,
      tasks: room.tasks.map((label, taskPosition) => ({
        label,
        position: taskPosition + 1,
        requiresPhoto: /photo|proof|receipt|final|entry|mirror|before|after/i.test(label)
      }))
    }))
  };
}

async function saveCleanprint() {
  renderRoomPlan();
  const payload = cleaningPlanPayload();

  if (!payload.rooms.length) {
    cleanprintStatus.textContent = "Select at least one room before building the Cleanprint.";
    return;
  }

  if (!(await ensureSignedIn("Building Cleanprint"))) return;

  buildCleanprint.disabled = true;
  cleanprintStatus.textContent = "Building room map, proof stream, and assistant handoff...";

  try {
    const result = await postJson("/api/cleaning-plan", payload);
    const modeCopy = result.mode === "database" ? "saved to Neon" : "built in demo mode";
    cleanprintStatus.textContent = `Cleanprint ${modeCopy}: ${payload.roomCount} rooms, ${payload.taskCount} tasks, ${payload.proofCount} proof points.`;
    bookingStatus.textContent = `Cleanprint ready: ${payload.taskCount} room tasks and ${payload.estimatedMinutes} minutes packaged for dispatch.`;
  } catch {
    cleanprintStatus.textContent = "Cleanprint built locally. Add DATABASE_URL to persist room plans.";
  } finally {
    buildCleanprint.disabled = false;
  }
}

function updateChecklistProgress(listIndex) {
  const card = document.querySelector(`[data-checklist="${listIndex}"]`);
  const boxes = card.querySelectorAll("input[type='checkbox']");
  const complete = Array.from(boxes).filter((box) => box.checked).length;
  card.querySelector(".check-count").textContent = complete;
  card.querySelector(".progress-fill").style.width = `${(complete / boxes.length) * 100}%`;
}

function renderLifeprint() {
  const averageReadiness = Math.round(
    autopilotQueue.reduce((sum, item) => sum + item.readiness, 0) / autopilotQueue.length
  );
  autopilotReadiness.textContent = `${averageReadiness}% ready`;

  memoryNodesEl.innerHTML = memoryNodes
    .map(
      (node) => `
        <div class="memory-node">
          <span>${node.label}</span>
          <strong>${node.value}</strong>
          <div class="trust-track"><span style="--level: ${node.strength}%"></span></div>
        </div>
      `
    )
    .join("");

  autopilotQueueEl.innerHTML = autopilotQueue
    .map(
      (item) => `
        <article class="autopilot-card" data-autopilot="${item.id}">
          <header>
            <div>
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </div>
            <span class="fit-score">${item.readiness}</span>
          </header>
          <span>${item.value}</span>
          <button class="tiny-action" type="button">Arm loop</button>
        </article>
      `
    )
    .join("");

  preferenceVaultEl.innerHTML = preferenceVault
    .map(
      (item) => `
        <div class="preference-row">
          <strong>${item.label}</strong>
          <span>${item.value}</span>
        </div>
      `
    )
    .join("");
}

function renderMissionControl() {
  missionQueue.innerHTML = assistantMissions
    .map(
      (mission) => `
        <article class="mission-card" data-mission="${mission.id}" data-payout="${mission.payout}">
          <header>
            <div>
              <strong>${mission.title}</strong>
              <span>${mission.client}</span>
            </div>
            <button class="tiny-action" type="button">Accept</button>
          </header>
          <p>${mission.body}</p>
          <div class="mission-meta">
            <span>${currency(mission.payout)} payout</span>
            <span>${mission.route}m route</span>
            <span>${mission.trust} trust</span>
          </div>
        </article>
      `
    )
    .join("");

  routeStack.innerHTML = routeLegs
    .map(
      (leg) => `
        <div class="route-leg">
          <b>${leg.stop}</b>
          <div>
            <strong>${leg.title}</strong>
            <span>${leg.detail}</span>
          </div>
          <strong>${leg.eta}</strong>
        </div>
      `
    )
    .join("");

  proofstream.innerHTML = proofstreamItems
    .map(
      (item, index) => `
        <label class="proof-row">
          <span>${item}</span>
          <input type="checkbox" ${index < 2 ? "checked" : ""}>
        </label>
      `
    )
    .join("");
  updateProofScore();
}

function updateMissionEconomics() {
  const accepted = document.querySelectorAll(".mission-card.is-accepted");
  const acceptedPayout = Array.from(accepted).reduce((sum, card) => sum + Number(card.dataset.payout || 0), 0);
  const boost = accepted.length ? acceptedPayout : 184;
  routeLift.textContent = `+${currency(boost)} route lift`;
  weeklyGross.textContent = currency(Math.round(Number(hoursRange.value) * 77.5 + acceptedPayout));
}

function updateProofScore() {
  const checks = proofstream.querySelectorAll("input[type='checkbox']");
  const complete = Array.from(checks).filter((check) => check.checked).length;
  const score = Math.round(76 + (complete / Math.max(1, checks.length)) * 24);
  proofScore.textContent = `${score} trust`;
}

function renderDetections(items = inventorySamples) {
  detectionList.innerHTML = items
    .map(
      (sample) => `
        <div class="detection-item">
          <strong>${sample.item}</strong>
          <span>${sample.status}</span>
          <span>${sample.action}</span>
        </div>
      `
    )
    .join("");
}

function inferInventory(file) {
  const name = file?.name?.toLowerCase() || "";
  if (name.includes("closet") || name.includes("wardrobe")) {
    return [
      { item: "Black formal jacket", status: "Ready", action: "Add to event outfit list" },
      { item: "Travel steamer", status: "Missing", action: "Assign assistant to locate" },
      { item: "Garment bags", status: "Low stock", action: "Order two more" }
    ];
  }

  if (name.includes("fridge") || name.includes("kitchen")) {
    return [
      { item: "Sparkling water", status: "Low stock", action: "Restock today" },
      { item: "Citrus", status: "Fresh", action: "Use for guest tray" },
      { item: "Prepared meals", status: "Expires soon", action: "Move to tonight plan" }
    ];
  }

  return inventorySamples;
}

async function postJson(url, payload) {
  const headers = await requestHeaders(true);
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json();
}

async function getJson(url) {
  const response = await fetch(url, { headers: await requestHeaders(false) });
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json();
}

async function requestHeaders(includeJson) {
  const headers = includeJson ? { "Content-Type": "application/json" } : {};
  const token = await accessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function accessToken() {
  if (!authState.enabled || !authState.authenticated || !auth0Client || !authConfig?.audience) {
    return "";
  }

  if (authState.token) return authState.token;

  try {
    authState.token = await auth0Client.getTokenSilently({
      authorizationParams: {
        audience: authConfig.audience,
        scope: authConfig.scope
      }
    });
    return authState.token;
  } catch {
    return "";
  }
}

function authRedirectUri() {
  return window.location.origin;
}

function renderAuthState() {
  loginButton.hidden = authState.authenticated;
  logoutButton.hidden = !authState.authenticated;
  authUser.hidden = !authState.authenticated;

  if (!authState.enabled) {
    loginButton.disabled = true;
    loginButton.textContent = "Auth0 off";
    authStatus.textContent = "Demo profile";
    authGreeting.textContent = "Add Auth0 env vars to unlock secure user profiles.";
    return;
  }

  loginButton.disabled = false;
  loginButton.textContent = "Sign in";

  if (!authState.authenticated || !authState.user) {
    authStatus.textContent = authState.apiProtectionEnabled ? "Secure ready" : "Audience needed";
    authGreeting.textContent = authState.apiProtectionEnabled
      ? "Sign in to make AURA yours."
      : "Create an Auth0 API audience to protect Vercel writes.";
    return;
  }

  const displayName = authState.user.name || authState.user.nickname || "AURA Client";
  const email = authState.user.email || authState.user.sub || "Secure profile";
  authName.textContent = displayName;
  authEmail.textContent = email;
  authAvatar.src = authState.user.picture || "/assets/aura-app-icon.png";
  authStatus.textContent = "Private profile";
  authGreeting.textContent = `${displayName.split(" ")[0] || "Your"} AURA defaults are syncing.`;
}

function preferenceSnapshot() {
  return {
    mode: shell.dataset.mode || "hire",
    defaultService: selectedService(),
    defaultBudget: budgetSelect.value,
    defaultUrgency: timeSelect.value,
    market: "Miami",
    cleanprint: {
      level: cleaningLevel.value,
      priority: cleaningPriority.value,
      rooms: selectedCleaningRooms()
    }
  };
}

async function saveProfilePreferences(reason = "interaction") {
  if (!authState.enabled || !authState.authenticated) return;

  try {
    await postJson("/api/profile", {
      reason,
      preferences: preferenceSnapshot()
    });
  } catch {
    authStatus.textContent = "Profile local";
  }
}

function queuePreferenceSave(reason) {
  if (!authState.enabled || !authState.authenticated) return;
  clearTimeout(preferenceSaveTimer);
  preferenceSaveTimer = setTimeout(() => {
    saveProfilePreferences(reason);
  }, 700);
}

function applyProfilePreferences(preferences) {
  if (!preferences || typeof preferences !== "object") return;

  if (preferences.mode) {
    setMode(preferences.mode);
  }

  if (preferences.defaultBudget) {
    budgetSelect.value = preferences.defaultBudget;
  }

  if (preferences.defaultUrgency) {
    timeSelect.value = preferences.defaultUrgency;
  }

  if (preferences.defaultService) {
    const chip = document.querySelector(`[data-service="${preferences.defaultService}"]`);
    if (chip) {
      serviceChips.forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");
      taskInput.value = serviceTemplates[preferences.defaultService] || taskInput.value;
    }
  }

  if (preferences.cleanprint) {
    if (preferences.cleanprint.level) cleaningLevel.value = preferences.cleanprint.level;
    if (preferences.cleanprint.priority) cleaningPriority.value = preferences.cleanprint.priority;
    if (Array.isArray(preferences.cleanprint.rooms)) {
      const selected = new Set(preferences.cleanprint.rooms);
      roomChipGrid.querySelectorAll(".room-chip").forEach((chip) => {
        chip.classList.toggle("is-selected", selected.has(chip.dataset.room));
      });
    }
  }

  renderRoomPlan();
  updateQuote();
}

async function loadProfilePreferences() {
  if (!authState.enabled || !authState.authenticated) return;

  try {
    const result = await getJson("/api/profile");
    applyProfilePreferences(result.data?.preferences);
  } catch {
    authStatus.textContent = "Profile local";
  }
}

async function login() {
  if (!auth0Client || !authConfig?.enabled) return;
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: authRedirectUri(),
      audience: authConfig.audience || undefined,
      scope: authConfig.scope
    },
    appState: {
      returnTo: `${window.location.pathname}${window.location.hash || ""}`
    }
  });
}

async function logout() {
  if (!auth0Client) return;
  await auth0Client.logout({
    logoutParams: {
      returnTo: authRedirectUri()
    }
  });
}

async function ensureSignedIn(actionLabel) {
  if (!authState.enabled) return true;
  if (authState.authenticated) return true;
  bookingStatus.textContent = `${actionLabel} needs a secure AURA profile first. Redirecting to Auth0...`;
  await login();
  return false;
}

async function initAuth() {
  renderAuthState();

  try {
    const result = await fetch("/api/auth-config").then((response) => response.json());
    authConfig = result.data || {};
    authState.enabled = Boolean(authConfig.enabled);
    authState.apiProtectionEnabled = Boolean(authConfig.apiProtectionEnabled);

    if (!authState.enabled) {
      authState.ready = true;
      renderAuthState();
      return;
    }

    if (!window.auth0?.createAuth0Client) {
      authStatus.textContent = "Auth SDK blocked";
      authGreeting.textContent = "Auth0 config is present, but the browser could not load the SPA SDK.";
      return;
    }

    auth0Client = await window.auth0.createAuth0Client({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
      cacheLocation: authConfig.cacheLocation || "memory",
      authorizationParams: {
        redirect_uri: authRedirectUri(),
        audience: authConfig.audience || undefined,
        scope: authConfig.scope
      }
    });

    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
      const result = await auth0Client.handleRedirectCallback();
      const returnTo = result.appState?.returnTo || window.location.pathname;
      window.history.replaceState({}, document.title, returnTo);
    }

    authState.authenticated = await auth0Client.isAuthenticated();
    if (authState.authenticated) {
      authState.user = await auth0Client.getUser();
      await accessToken();
      renderAuthState();
      await loadProfilePreferences();
      queuePreferenceSave("auth-login");
    }

    authState.ready = true;
    renderAuthState();
  } catch {
    authState.ready = true;
    authStatus.textContent = "Auth pending";
    authGreeting.textContent = "Auth0 setup is close. Check callback URLs and audience settings.";
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.modeButton);
    queuePreferenceSave("mode");
  });
});

serviceChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    serviceChips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    taskInput.value = serviceTemplates[chip.dataset.service];
    updateQuote();
    queuePreferenceSave("service");
  });
});

budgetSelect.addEventListener("change", () => {
  updateQuote();
  queuePreferenceSave("budget");
});
timeSelect.addEventListener("change", () => {
  updateQuote();
  queuePreferenceSave("urgency");
});

loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", logout);

document.querySelector("#jumpToBooking").addEventListener("click", () => {
  document.querySelector("#marketplace").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#jumpToProvider").addEventListener("click", () => {
  setMode("earn");
  document.querySelector("#earn").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#bookRequest").addEventListener("click", async () => {
  if (!(await ensureSignedIn("Matching"))) return;

  const service = selectedService();
  const assistant = topAssistant(service);
  const { total, fee, payout } = quoteState();
  bookingStatus.textContent = `Intent Reactor locked ${assistant.name}: ${assistant.fit} fit, ${assistant.eta} minute ETA, ${currency(payout)} payout.`;
  liveBookings.textContent = (Number(liveBookings.textContent.replace(",", "")) + 1).toLocaleString("en-US");

  try {
    const result = await postJson("/api/bookings", {
      taskSummary: taskInput.value,
      serviceCategory: service,
      urgency: timeSelect.value,
      budgetCents: total * 100,
      assistantId: assistant.id,
      market: "Miami",
      matchScore: assistant.fit,
      platformFeeCents: fee * 100
    });
    bookingStatus.textContent = `${result.message} ${assistant.name} remains the top trust-lattice match.`;
  } catch {
    bookingStatus.textContent = `Demo booking created with ${assistant.name}. Add DATABASE_URL on Vercel to persist it in Neon.`;
  }
});

document.querySelector("#optimizeDay").addEventListener("click", () => {
  document.querySelector("#calendar").scrollIntoView({ behavior: "smooth" });
  bookingStatus.textContent = "AURA found 3 calendar improvements and one profitable task bundle.";
});

assistantList.addEventListener("click", (event) => {
  const button = event.target.closest(".hire-assistant");
  if (!button) return;
  const assistant = assistants.find((item) => item.id === button.dataset.assistant);
  bookingStatus.textContent = `${assistant.name} is reserved for your request. Confirm details when ready.`;
  document.querySelector(".command-console").scrollIntoView({ behavior: "smooth" });
});

calendarInsightsEl.addEventListener("click", (event) => {
  const button = event.target.closest(".insight-button");
  if (!button) return;
  button.classList.toggle("is-accepted");
  button.textContent = button.classList.contains("is-accepted")
    ? `Accepted: ${button.textContent.replace("Accepted: ", "")}`
    : button.textContent.replace("Accepted: ", "");
});

autopilotQueueEl.addEventListener("click", (event) => {
  const button = event.target.closest(".tiny-action");
  if (!button) return;
  button.classList.toggle("is-armed");
  button.textContent = button.classList.contains("is-armed") ? "Loop armed" : "Arm loop";
});

missionQueue.addEventListener("click", (event) => {
  const button = event.target.closest(".tiny-action");
  if (!button) return;
  const card = button.closest(".mission-card");
  card.classList.toggle("is-accepted");
  button.classList.toggle("is-armed");
  button.textContent = card.classList.contains("is-accepted") ? "Accepted" : "Accept";
  updateMissionEconomics();
});

proofstream.addEventListener("change", (event) => {
  if (!event.target.closest("input[type='checkbox']")) return;
  updateProofScore();
});

checklistBoard.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[type='checkbox']");
  if (!checkbox) return;
  updateChecklistProgress(checkbox.dataset.list);
});

roomChipGrid.addEventListener("click", (event) => {
  const chip = event.target.closest(".room-chip");
  if (!chip) return;
  chip.classList.toggle("is-selected");
  renderRoomPlan();
  queuePreferenceSave("cleanprint-rooms");
});

cleaningLevel.addEventListener("change", () => {
  renderRoomPlan();
  queuePreferenceSave("cleanprint-level");
});
cleaningPriority.addEventListener("change", () => {
  renderRoomPlan();
  queuePreferenceSave("cleanprint-priority");
});
buildCleanprint.addEventListener("click", saveCleanprint);

roomPlan.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[type='checkbox']");
  if (!checkbox) return;
  updateRoomProgress(checkbox.dataset.roomCard);
});

inventoryUpload.addEventListener("change", async () => {
  const [file] = inventoryUpload.files;
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  if (inventoryPreview instanceof HTMLImageElement) {
    inventoryPreview.src = previewUrl;
  } else {
    inventoryPreview.style.backgroundImage = `linear-gradient(rgba(5, 7, 11, 0.2), rgba(5, 7, 11, 0.72)), url("${previewUrl}")`;
    inventoryPreview.classList.add("has-upload");
  }
  const detected = inferInventory(file);
  renderDetections(detected);

  if (!(await ensureSignedIn("Saving inventory"))) {
    detectionList.insertAdjacentHTML(
      "beforeend",
      '<div class="detection-item"><strong>Secure profile</strong><span>Sign in</span><span>Inventory was scanned locally. Sign in to save it.</span></div>'
    );
    return;
  }

  try {
    await postJson("/api/inventory", {
      fileName: file.name,
      detectedItems: detected,
      source: "browser-upload"
    });
  } catch {
    detectionList.insertAdjacentHTML(
      "beforeend",
      '<div class="detection-item"><strong>Demo mode</strong><span>Not saved</span><span>Add DATABASE_URL to persist inventory scans.</span></div>'
    );
  }
});

ratingRange.addEventListener("input", () => {
  ratingOutput.textContent = ratingRange.value;
});

tipRange.addEventListener("input", () => {
  tipOutput.textContent = currency(Number(tipRange.value));
});

document.querySelector("#submitFeedback").addEventListener("click", async () => {
  const feedbackResult = document.querySelector("#feedbackResult");
  if (!(await ensureSignedIn("Saving feedback"))) return;

  feedbackResult.textContent = "Feedback received. AURA updated assistant coaching and client preferences.";
  try {
    await postJson("/api/feedback", {
      rating: Number(ratingRange.value),
      tipCents: Number(tipRange.value) * 100,
      note: "Submitted from AURA web console"
    });
  } catch {
    feedbackResult.textContent = "Feedback captured in demo mode. Add DATABASE_URL to persist quality signals.";
  }
});

hoursRange.addEventListener("input", () => {
  const hours = Number(hoursRange.value);
  const gross = Math.round(hours * 77.5);
  weeklyGross.textContent = currency(gross);
  hoursOutput.textContent = `${hours} hours at premium utilization`;
  updateMissionEconomics();
});

renderAssistants();
renderTimeline();
renderRoomBuilder();
renderRoomPlan();
renderChecklists();
renderLifeprint();
renderMissionControl();
renderDetections();
updateQuote();
initAuth();
