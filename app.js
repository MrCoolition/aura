let assistantSupply = [];

const serviceTemplates = {
  home: "Reset the apartment before 6 PM, restock sparkling water, prep guest towels, and move dinner reservation if traffic gets bad.",
  calendar: "Clean up tomorrow's calendar, protect two focus blocks, move low-priority calls, and book a car between meetings.",
  errands: "Pick up dry cleaning, return two packages, buy a host gift, and send photo confirmation for each stop.",
  travel: "Find two flight options, hold a dinner reservation near the hotel, and build a no-stress airport timeline.",
  inventory: "Scan the fridge and supply closet, flag low stock, create a shopping list, and schedule a restock assistant."
};

const timelineItems = [
  { time: "9:20", title: "Assistant arrival window", body: "AURA confirms access, proof expectations, and the first room or stop before dispatch.", score: 98 },
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

const assistantMissions = [];

const routeLegs = [];

const proofstreamItems = [
  "Entry condition photo",
  "Restock receipt captured",
  "Guest bath final proof",
  "Client preference delta logged"
];

const intakeDefaults = {
  client: {
    market: "",
    homeType: "Condo",
    cadence: "Weekly flow",
    budgetStyle: "140",
    services: ["Home reset", "Calendar", "Errands", "Inventory"],
    preferences: ["Topo Chico glass bottles", "White towels folded thirds", "Late seating, quiet room"],
    boundaries: ["Ask before substitutions", "Photo proof before checkout"],
    access: "Front desk release",
    proof: "Photo proof"
  },
  assistant: {
    market: "",
    radius: "8 miles",
    hours: "24",
    minimum: "85",
    services: ["Home reset", "Errands", "Inventory", "Events"],
    strengths: ["Hotel reset standards", "Receipt capture", "Hosting prep"],
    filters: ["No heavy lifting", "Premium routes preferred"],
    availability: ["Weekday mornings", "Afternoons", "Rush windows"],
    payoutStrategy: "High trust, high payout"
  }
};

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
const marketPill = document.querySelector("#marketPill");
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
const intakeStudio = document.querySelector("#intakeStudio");
const intakeModeButtons = document.querySelectorAll("[data-intake-mode-button]");
const intakeRailTitle = document.querySelector("#intakeRailTitle");
const intakeCompleteness = document.querySelector("#intakeCompleteness");
const intakeProgress = document.querySelector("#intakeProgress");
const intakeStatus = document.querySelector("#intakeStatus");
const clientIntake = document.querySelector("#clientIntake");
const assistantIntake = document.querySelector("#assistantIntake");
const clientMarket = document.querySelector("#clientMarket");
const clientHomeType = document.querySelector("#clientHomeType");
const clientCadence = document.querySelector("#clientCadence");
const clientBudgetStyle = document.querySelector("#clientBudgetStyle");
const clientServiceToggles = document.querySelector("#clientServiceToggles");
const clientPreferenceChips = document.querySelector("#clientPreferenceChips");
const clientBoundaryList = document.querySelector("#clientBoundaryList");
const clientAccess = document.querySelector("#clientAccess");
const clientProof = document.querySelector("#clientProof");
const assistantMarket = document.querySelector("#assistantMarket");
const assistantRadius = document.querySelector("#assistantRadius");
const assistantHours = document.querySelector("#assistantHours");
const assistantMinimum = document.querySelector("#assistantMinimum");
const assistantServiceToggles = document.querySelector("#assistantServiceToggles");
const assistantStrengthList = document.querySelector("#assistantStrengthList");
const assistantFilterList = document.querySelector("#assistantFilterList");
const assistantAvailabilityToggles = document.querySelector("#assistantAvailabilityToggles");
const assistantPayoutStrategy = document.querySelector("#assistantPayoutStrategy");
const clientServiceCount = document.querySelector("#clientServiceCount");
const clientPreferenceCount = document.querySelector("#clientPreferenceCount");
const clientBoundaryCount = document.querySelector("#clientBoundaryCount");
const assistantServiceCount = document.querySelector("#assistantServiceCount");
const assistantStrengthCount = document.querySelector("#assistantStrengthCount");
const assistantFilterCount = document.querySelector("#assistantFilterCount");
const assistantAvailabilityCount = document.querySelector("#assistantAvailabilityCount");
const intakeLiveMode = document.querySelector("#intakeLiveMode");
const intakeLiveTitle = document.querySelector("#intakeLiveTitle");
const intakeLiveBody = document.querySelector("#intakeLiveBody");
const intakeLiveMetrics = document.querySelector("#intakeLiveMetrics");
const intakeLiveStack = document.querySelector("#intakeLiveStack");
const saveIntake = document.querySelector("#saveIntake");
const resetIntake = document.querySelector("#resetIntake");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const authPortal = document.querySelector("#authPortal");
const authPortalClose = document.querySelector("#authPortalClose");
const authPortalContinue = document.querySelector("#authPortalContinue");
const authPortalContext = document.querySelector("#authPortalContext");
const authPortalStatus = document.querySelector("#authPortalStatus");
const authUser = document.querySelector("#authUser");
const authAvatar = document.querySelector("#authAvatar");
const authName = document.querySelector("#authName");
const authEmail = document.querySelector("#authEmail");
const authStatus = document.querySelector("#authStatus");
const authGreeting = document.querySelector("#authGreeting");
const adminNavLink = document.querySelector("#adminNavLink");
const adminSection = document.querySelector("#admin");
const adminMode = document.querySelector("#adminMode");
const adminStats = document.querySelector("#adminStats");
const adminUsers = document.querySelector("#adminUsers");
const adminRequests = document.querySelector("#adminRequests");
const adminCleanprints = document.querySelector("#adminCleanprints");
const adminInventory = document.querySelector("#adminInventory");
const adminFeedback = document.querySelector("#adminFeedback");
const adminUserCount = document.querySelector("#adminUserCount");
const adminRequestCount = document.querySelector("#adminRequestCount");
const adminCleanprintCount = document.querySelector("#adminCleanprintCount");
const adminInventoryCount = document.querySelector("#adminInventoryCount");
const adminFeedbackCount = document.querySelector("#adminFeedbackCount");

let authConfig = null;
const defaultAuthContext = "Save your preferences, bookings, home routines, inventory, and assistant history.";
let authState = {
  ready: false,
  enabled: false,
  apiProtectionEnabled: false,
  authenticated: false,
  user: null,
  role: "client",
  profilePersistence: "unknown",
  authMessage: ""
};
let preferenceSaveTimer = null;
let pendingAuthContext = defaultAuthContext;

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

function currentMarket() {
  return cleanTokenValue(clientMarket?.value || assistantMarket?.value) || "Your market";
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
  if (!assistantSupply.length) return null;
  const scored = assistantSupply.map((assistant) => ({
    ...assistant,
    fit:
      62 +
      (assistant.tags.join(" ").toLowerCase().includes(service) ? 22 : 6) +
      Math.round((assistant.rating - 4.9) * 80) +
      Math.max(0, 10 - Math.round(assistant.eta / 4))
  }));
  return scored.sort((a, b) => b.fit - a.fit)[0];
}

function normalizeAssistant(row) {
  const name = String(row.display_name || row.name || "Verified assistant").trim();
  return {
    id: String(row.id || name),
    name,
    initials: name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
    headline: String(row.headline || "Verified AURA operator").trim(),
    eta: Number(row.eta_minutes || row.eta || 0),
    rate: Math.round(Number(row.hourly_rate_cents || row.rate_cents || 0) / 100),
    rating: Number(row.rating || 0),
    jobs: Number(row.completed_jobs || row.jobs || 0),
    tags: Array.isArray(row.ai_tags) ? row.ai_tags : Array.isArray(row.tags) ? row.tags : [],
    bio: String(row.bio || "Profile supplied by the verified assistant network.").trim()
  };
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
  if (intakeStudio) {
    setIntakeMode(mode === "earn" ? "assistant" : "client", false);
  }
  bookingStatus.textContent =
    mode === "earn"
      ? "Provider mode ready. AURA will price jobs, route your day, and protect your rating."
      : "AURA is watching weather, traffic, ETA, and assistant fit.";
}

function renderAssistants() {
  if (!assistantSupply.length) {
    assistantList.innerHTML = `
      <article class="assistant-empty-state">
        <strong>No verified assistants loaded yet</strong>
        <p>Complete your market and service profile. AURA will show real approved supply when your network is connected.</p>
        <button class="primary-action" type="button" data-jump-profile>Build profile</button>
      </article>
    `;
    return;
  }

  assistantList.innerHTML = assistantSupply
    .map(
      (assistant) => `
        <article class="assistant-card">
          <div class="assistant-top">
            <div class="assistant-avatar" aria-hidden="true">${assistant.initials}</div>
            <div>
              <h3>${escapeHtml(assistant.name)}</h3>
              <p>${escapeHtml(assistant.headline)}</p>
            </div>
          </div>
          <p>${escapeHtml(assistant.bio)}</p>
          <div class="tag-row">
            ${assistant.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
          <div class="assistant-stats">
            <span><strong>${assistant.eta ? `${assistant.eta}m` : "Live"}</strong> ETA</span>
            <span><strong>${assistant.rating || "New"}</strong> Rating</span>
            <span><strong>${assistant.rate ? `$${assistant.rate}` : "Set"}</strong> Hour</span>
          </div>
          <button class="primary-action hire-assistant" data-assistant="${assistant.id}" type="button">Request match</button>
        </article>
      `
    )
    .join("");
}

async function loadAssistants() {
  try {
    const result = await getJson("/api/assistants");
    assistantSupply = Array.isArray(result.data) ? result.data.map(normalizeAssistant) : [];
  } catch {
    assistantSupply = [];
  }
  renderAssistants();
  updateQuote();
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
    {
      label: "Match",
      value: assistant ? `${assistant.fit} fit` : "Supply pending",
      detail: assistant ? `${assistant.name}, ${assistant.eta ? `${assistant.eta}m ETA` : "live ETA"}` : "Real verified assistants appear here"
    },
    { label: "Dispatch", value: assistant ? currency(payout) : "Ready", detail: "Proofstream and payout rules stay attached" }
  ];

  reactorMode.textContent = `${serviceLabel} reactor`;
  reactorHeadline.textContent = assistant
    ? `${assistant.name} can execute in ${assistant.eta ? `${assistant.eta} minutes` : "a live ETA window"}`
    : "AURA can price the request before verified supply is loaded";
  reactorValueBadge.textContent = `${friction}h saved`;
  reactorSummary.textContent = assistant
    ? `AURA is turning the request into an executable operation: ${currency(total)} client total, ${currency(payout)} assistant payout, ${routeCompression}% route compression, and ${repeat}% repeat odds.`
    : `AURA is turning the request into priced demand: ${currency(total)} client total, ${currency(fee)} platform revenue, proofstream requirements, and a real-supply matching slot.`;
  matchHeat.textContent = average;
  frictionSaved.textContent = `${friction}h`;
  repeatOdds.textContent = `${repeat}%`;

  reactorKpis.innerHTML = [
    { label: "ETA", value: assistant ? `${assistant.eta || "Live"}m` : "Pending" },
    { label: "Assistant fit", value: assistant ? assistant.fit : "Real only" },
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
  if (!assistantSupply.length) {
    latticeWinner.textContent = "Supply pending";
    matchLattice.innerHTML = `
      <div class="lattice-empty">
        <strong>Verified matches only</strong>
        <span>AURA will rank real verified assistants after supply is connected for your selected market.</span>
      </div>
    `;
    return;
  }

  const scored = assistantSupply
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
    { label: assistant ? `${assistant.name} payout` : "Assistant payout pool", value: currency(payout), level: Math.round((payout / total) * 100) },
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
    market: currentMarket(),
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
    const modeCopy = result.mode === "database" ? "saved" : "built";
    cleanprintStatus.textContent = `Cleanprint ${modeCopy}: ${payload.roomCount} rooms, ${payload.taskCount} tasks, ${payload.proofCount} proof points.`;
    bookingStatus.textContent = `Cleanprint ready: ${payload.taskCount} room tasks and ${payload.estimatedMinutes} minutes packaged for dispatch.`;
  } catch {
    cleanprintStatus.textContent = "Cleanprint built locally. Sign in to save and manage room plans.";
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
  missionQueue.innerHTML = assistantMissions.length
    ? assistantMissions
        .map(
          (mission) => `
            <article class="mission-card" data-mission="${mission.id}" data-payout="${mission.payout}">
              <header>
                <div>
                  <strong>${escapeHtml(mission.title)}</strong>
                  <span>${escapeHtml(mission.client)}</span>
                </div>
                <button class="tiny-action" type="button">Accept</button>
              </header>
              <p>${escapeHtml(mission.body)}</p>
              <div class="mission-meta">
                <span>${currency(mission.payout)} payout</span>
                <span>${mission.route}m route</span>
                <span>${mission.trust} trust</span>
              </div>
            </article>
          `
        )
        .join("")
    : `
      <article class="mission-empty-state">
        <strong>No live missions loaded</strong>
        <p>Complete the assistant intake, set your market, and connect real demand before AURA offers work.</p>
        <button class="primary-action" type="button" data-jump-assistant-profile>Build earning profile</button>
      </article>
    `;

  routeStack.innerHTML = routeLegs.length
    ? routeLegs
        .map(
          (leg) => `
            <div class="route-leg">
              <b>${leg.stop}</b>
              <div>
                <strong>${escapeHtml(leg.title)}</strong>
                <span>${escapeHtml(leg.detail)}</span>
              </div>
              <strong>${escapeHtml(leg.eta)}</strong>
            </div>
          `
        )
        .join("")
    : `
      <div class="route-leg route-leg-empty">
        <b>0</b>
        <div>
          <strong>Route opens when real jobs exist</strong>
          <span>AURA will only compress actual accepted work.</span>
        </div>
        <strong>--</strong>
      </div>
    `;

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
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.ok === false) {
    const error = new Error(data?.message || `Request failed with ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function getJson(url) {
  const response = await fetch(url, { headers: await requestHeaders(false) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.ok === false) {
    const error = new Error(data?.message || `Request failed with ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function requestHeaders(includeJson) {
  return includeJson ? { "Content-Type": "application/json" } : {};
}

function rootAuthCallbackSearch() {
  const params = new URLSearchParams(window.location.search);
  const hasAuthResult = (params.has("code") && params.has("state")) || (params.has("error") && params.has("state"));
  if (!hasAuthResult) return "";

  const callbackParams = new URLSearchParams();
  ["code", "state", "error", "error_description"].forEach((key) => {
    const value = params.get(key);
    if (value) callbackParams.set(key, value);
  });
  return callbackParams.toString();
}

function forwardRootAuthCallback() {
  const callbackSearch = rootAuthCallbackSearch();
  if (!callbackSearch) return false;
  window.location.replace(`/api/auth/callback?${callbackSearch}`);
  return true;
}

function cleanAuthQuery(returnTo = window.location.pathname) {
  window.history.replaceState({}, document.title, returnTo || "/");
}

function handleAuthErrorFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("error")) return false;

  cleanAuthQuery(window.location.pathname);
  authState.authMessage = "We could not finish sign-in. Please try again.";
  authStatus.textContent = "Sign-in paused";
  authGreeting.textContent = "We could not finish sign-in. Please try again.";
  if (authPortalStatus) authPortalStatus.textContent = "We could not finish sign-in. Please try again.";
  return true;
}

function authGateActive() {
  return authState.enabled && !(authState.authenticated && authState.user);
}

function renderAuthPortalState() {
  if (!authPortalStatus || !authPortalContinue) return;

  authPortalContinue.disabled = !authState.enabled;

  if (authState.authMessage) {
    authPortalContinue.textContent = authState.enabled ? "Try again" : "Try again soon";
    authPortalStatus.textContent = authState.authMessage;
    return;
  }

  if (!authState.enabled) {
    authPortalStatus.textContent = "Sign-in is not connected yet.";
    authPortalContinue.textContent = "Try again soon";
    return;
  }

  authPortalContinue.textContent = "Continue";

  if (!authState.apiProtectionEnabled) {
    authPortalStatus.textContent = "Secure sign-in is ready.";
    return;
  }

  authPortalStatus.textContent = "Secure sign-in is ready.";
}

function openAuthPortal(actionLabel = "") {
  if (!authPortal) return;
  pendingAuthContext = actionLabel
    ? `${actionLabel} needs your private AURA profile.`
    : defaultAuthContext;
  if (authPortalContext) authPortalContext.textContent = pendingAuthContext;
  renderAuthPortalState();
  authPortal.hidden = false;
  document.body.classList.add("auth-portal-open");
  window.setTimeout(() => authPortalContinue?.focus(), 0);
}

function closeAuthPortal() {
  if (authGateActive()) return;
  if (!authPortal) return;
  authPortal.hidden = true;
  document.body.classList.remove("auth-portal-open");
}

function renderAuthGate(signedIn) {
  const booting = !authState.ready && authConfig === null;
  const gated = !booting && authState.enabled && !signedIn;
  shell.classList.toggle("is-auth-booting", booting);
  shell.classList.toggle("is-auth-gated", gated);
  authPortalClose.hidden = booting || gated;

  if (booting) {
    return;
  }

  if (gated) {
    pendingAuthContext = defaultAuthContext;
    if (authPortalContext) authPortalContext.textContent = defaultAuthContext;
    renderAuthPortalState();
    authPortal.hidden = false;
    document.body.classList.add("auth-portal-open");
    return;
  }

  if (signedIn) closeAuthPortal();
}

function renderAuthState() {
  const signedIn = Boolean(authState.authenticated && authState.user);
  renderAuthGate(signedIn);

  loginButton.hidden = signedIn;
  logoutButton.hidden = !signedIn;
  authUser.hidden = !signedIn;

  if (!authState.enabled) {
    loginButton.disabled = false;
    loginButton.textContent = "Sign in";
    authStatus.textContent = "Guest mode";
    authGreeting.textContent = "Sign in to save preferences and bookings.";
    renderAuthPortalState();
    return;
  }

  loginButton.disabled = false;
  loginButton.textContent = "Sign in";
  renderAuthPortalState();

  if (!signedIn) {
    authState.role = "client";
    authState.profilePersistence = "unknown";
    renderAdminAccess(false);
    authStatus.textContent = "Guest mode";
    authGreeting.textContent = "Sign in to save preferences and bookings.";
    return;
  }

  const displayName = authState.user.name || authState.user.nickname || "AURA Client";
  const email = authState.user.email || authState.user.sub || "Secure profile";
  authName.textContent = displayName;
  authEmail.textContent = email;
  authAvatar.src = authState.user.picture || "/assets/aura-app-icon.png";
  if (authState.profilePersistence === "database") {
    authStatus.textContent = authState.role === "admin" ? "Admin saved" : "Profile saved";
  } else if (authState.profilePersistence === "local") {
    authStatus.textContent = "Profile local";
  } else if (authState.profilePersistence === "error") {
    authStatus.textContent = "Save failed";
  } else {
    authStatus.textContent = authState.role === "admin" ? "Admin profile" : "Signed in";
  }
  authGreeting.textContent = `${displayName.split(" ")[0] || "Your"} AURA profile is active.`;
  renderAdminAccess(authState.role === "admin");
  closeAuthPortal();
}

function renderAdminAccess(enabled) {
  adminNavLink.hidden = !enabled;
  adminSection.hidden = !enabled;
}

function cloneIntakeDefaults() {
  return JSON.parse(JSON.stringify(intakeDefaults));
}

function cleanTokenValue(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 72);
}

function tokenListValues(container) {
  return Array.from(container?.querySelectorAll(".intake-token") || [])
    .map((token) => cleanTokenValue(token.dataset.tokenValue))
    .filter(Boolean);
}

function tokenMarkup(value) {
  const safe = escapeHtml(cleanTokenValue(value));
  return `
    <span class="intake-token" data-token-value="${safe}">
      <span>${safe}</span>
      <button class="intake-token-remove" type="button" aria-label="Remove ${safe}">x</button>
    </span>
  `;
}

function renderTokenList(container, values = []) {
  if (!container) return;
  const unique = [...new Set(values.map(cleanTokenValue).filter(Boolean))];
  container.innerHTML = unique.map(tokenMarkup).join("");
}

function addTokenFromInput(containerId, inputId) {
  const container = document.querySelector(`#${containerId}`);
  const input = document.querySelector(`#${inputId}`);
  const value = cleanTokenValue(input?.value);
  if (!container || !input || !value) return;
  renderTokenList(container, [...tokenListValues(container), value]);
  input.value = "";
  updateIntakeExperience("Profile updated.");
  queuePreferenceSave("intake-token");
}

function selectedToggleValues(container) {
  return Array.from(container?.querySelectorAll("button.is-active") || []).map((button) => button.dataset.value);
}

function setActiveToggles(container, values = []) {
  if (!container) return;
  const selected = new Set(values);
  container.querySelectorAll("button[data-value]").forEach((button) => {
    button.classList.toggle("is-active", selected.has(button.dataset.value));
  });
}

function setSelectValue(element, value) {
  if (!element || value === undefined || value === null) return;
  const stringValue = String(value);
  const option = Array.from(element.options || []).find((item) => item.value === stringValue || item.textContent === stringValue);
  if (option) element.value = option.value;
}

function setInputValue(element, value) {
  if (!element || value === undefined || value === null) return;
  element.value = String(value);
}

function activeIntakeMode() {
  return intakeStudio?.dataset.intakeMode || "client";
}

function setIntakeMode(mode, syncAppMode = true) {
  const normalized = mode === "assistant" ? "assistant" : "client";
  if (!intakeStudio) return;
  intakeStudio.dataset.intakeMode = normalized;
  intakeModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.intakeModeButton === normalized);
  });
  clientIntake.hidden = normalized !== "client";
  assistantIntake.hidden = normalized !== "assistant";
  intakeRailTitle.textContent = normalized === "assistant" ? "Assistant profile" : "Client profile";
  if (syncAppMode) setMode(normalized === "assistant" ? "earn" : "hire");
  updateIntakeExperience();
}

function intakeSnapshot() {
  return {
    mode: activeIntakeMode(),
    client: {
      market: cleanTokenValue(clientMarket.value) || intakeDefaults.client.market,
      homeType: clientHomeType.value,
      cadence: clientCadence.value,
      budgetStyle: clientBudgetStyle.value,
      services: selectedToggleValues(clientServiceToggles),
      preferences: tokenListValues(clientPreferenceChips),
      boundaries: tokenListValues(clientBoundaryList),
      access: clientAccess.value,
      proof: clientProof.value
    },
    assistant: {
      market: cleanTokenValue(assistantMarket.value) || intakeDefaults.assistant.market,
      radius: assistantRadius.value,
      hours: String(Math.max(0, Number(assistantHours.value || 0))),
      minimum: String(Math.max(0, Number(assistantMinimum.value || 0))),
      services: selectedToggleValues(assistantServiceToggles),
      strengths: tokenListValues(assistantStrengthList),
      filters: tokenListValues(assistantFilterList),
      availability: selectedToggleValues(assistantAvailabilityToggles),
      payoutStrategy: assistantPayoutStrategy.value
    }
  };
}

function intakeCompletion(profile = intakeSnapshot()) {
  const mode = profile.mode === "assistant" ? "assistant" : "client";
  const data = profile[mode];
  const checks =
    mode === "assistant"
      ? [
          data.market,
          data.radius,
          Number(data.hours) > 0,
          Number(data.minimum) > 0,
          data.services?.length,
          data.strengths?.length,
          data.filters?.length,
          data.availability?.length,
          data.payoutStrategy
        ]
      : [
          data.market,
          data.homeType,
          data.cadence,
          data.budgetStyle,
          data.services?.length,
          data.preferences?.length,
          data.boundaries?.length,
          data.access,
          data.proof
        ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function countLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function updateIntakeCounts(profile = intakeSnapshot()) {
  clientServiceCount.textContent = `${profile.client.services.length} active`;
  clientPreferenceCount.textContent = countLabel(profile.client.preferences.length, "saved");
  clientBoundaryCount.textContent = countLabel(profile.client.boundaries.length, "guardrail");
  assistantServiceCount.textContent = `${profile.assistant.services.length} active`;
  assistantStrengthCount.textContent = countLabel(profile.assistant.strengths.length, "signal");
  assistantFilterCount.textContent = countLabel(profile.assistant.filters.length, "filter");
  assistantAvailabilityCount.textContent = countLabel(profile.assistant.availability.length, "window");
}

function renderIntakeLiveCard(profile = intakeSnapshot()) {
  const mode = profile.mode === "assistant" ? "assistant" : "client";
  const data = profile[mode];
  const market = cleanTokenValue(data.market) || "Your market";
  const score = intakeCompletion(profile);
  intakeCompleteness.textContent = `${score}%`;
  intakeProgress.style.width = `${score}%`;
  intakeLiveMode.textContent = mode === "assistant" ? "Earn" : "Hire";

  if (mode === "assistant") {
    intakeLiveTitle.textContent = `${market} operator, ${data.radius}`;
    intakeLiveBody.textContent = `${data.payoutStrategy} with ${data.services.slice(0, 3).join(", ") || "flexible service"} focus.`;
    intakeLiveMetrics.innerHTML = [
      ["Services", data.services.length],
      ["Hours", data.hours],
      ["Floor", currency(Number(data.minimum || 0))]
    ]
      .map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`)
      .join("");
    intakeLiveStack.innerHTML = [...data.strengths.slice(0, 4), ...data.availability.slice(0, 2)]
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
    return;
  }

  intakeLiveTitle.textContent = `${market} ${data.homeType.toLowerCase()}, ${data.cadence.toLowerCase()}`;
  intakeLiveBody.textContent = `${data.services.slice(0, 4).join(", ") || "Flexible support"} with ${data.proof.toLowerCase()} and ${data.access.toLowerCase()}.`;
  intakeLiveMetrics.innerHTML = [
    ["Services", data.services.length],
    ["Taste", data.preferences.length],
    ["Guardrails", data.boundaries.length]
  ]
    .map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`)
    .join("");
  intakeLiveStack.innerHTML = [...data.preferences.slice(0, 4), ...data.boundaries.slice(0, 2)]
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

function updateIntakeExperience(message = "") {
  const profile = intakeSnapshot();
  updateIntakeCounts(profile);
  renderIntakeLiveCard(profile);
  if (marketPill) marketPill.textContent = currentMarket();
  if (message) intakeStatus.textContent = message;
}

function applyIntakeProfile(profile = cloneIntakeDefaults()) {
  const merged = {
    ...cloneIntakeDefaults(),
    ...(profile || {}),
    client: { ...intakeDefaults.client, ...(profile?.client || {}) },
    assistant: { ...intakeDefaults.assistant, ...(profile?.assistant || {}) }
  };

  setInputValue(clientMarket, merged.client.market);
  setSelectValue(clientHomeType, merged.client.homeType);
  setSelectValue(clientCadence, merged.client.cadence);
  setSelectValue(clientBudgetStyle, merged.client.budgetStyle);
  setActiveToggles(clientServiceToggles, merged.client.services);
  renderTokenList(clientPreferenceChips, merged.client.preferences);
  renderTokenList(clientBoundaryList, merged.client.boundaries);
  setSelectValue(clientAccess, merged.client.access);
  setSelectValue(clientProof, merged.client.proof);

  setInputValue(assistantMarket, merged.assistant.market);
  setSelectValue(assistantRadius, merged.assistant.radius);
  setInputValue(assistantHours, merged.assistant.hours);
  setInputValue(assistantMinimum, merged.assistant.minimum);
  setActiveToggles(assistantServiceToggles, merged.assistant.services);
  renderTokenList(assistantStrengthList, merged.assistant.strengths);
  renderTokenList(assistantFilterList, merged.assistant.filters);
  setActiveToggles(assistantAvailabilityToggles, merged.assistant.availability);
  setSelectValue(assistantPayoutStrategy, merged.assistant.payoutStrategy);

  if (budgetSelect && merged.client.budgetStyle) {
    budgetSelect.value = merged.client.budgetStyle;
  }
  setIntakeMode(merged.mode || "client", false);
  updateIntakeExperience();
  updateQuote();
}

function renderIntakeDefaults() {
  applyIntakeProfile(cloneIntakeDefaults());
  intakeStatus.textContent = "Profile tuning is local until you save.";
}

async function saveIntakeProfile() {
  if (authState.enabled && !authState.authenticated) {
    openAuthPortal("Saving your intake profile");
    intakeStatus.textContent = "Sign in to save this profile across devices.";
    return;
  }

  intakeStatus.textContent = authState.authenticated ? "Saving profile..." : "Profile tuned locally.";
  if (authState.authenticated) {
    const saved = await saveProfilePreferences("intake-save", { showErrors: true });
    if (saved) intakeStatus.textContent = "Profile saved to AURA.";
  }
}

function preferenceSnapshot() {
  const intake = intakeSnapshot();
  return {
    mode: shell.dataset.mode || "hire",
    defaultService: selectedService(),
    defaultBudget: budgetSelect.value,
    defaultUrgency: timeSelect.value,
    market: intake.client.market || currentMarket(),
    intake,
    cleanprint: {
      level: cleaningLevel.value,
      priority: cleaningPriority.value,
      rooms: selectedCleaningRooms()
    }
  };
}

function profileSaveFailureMessage(error) {
  if (error?.data?.code === "DATABASE_NOT_CONFIGURED") {
    return "Profile saving is not connected on this deployment yet.";
  }

  if (error?.data?.code === "SCHEMA_NOT_INSTALLED") {
    return "Database is connected, but the AURA tables are not installed yet.";
  }

  if (error?.data?.code === "SCHEMA_INSTALL_FAILED") {
    return "AURA tried to install the database tables, but Neon rejected the schema install.";
  }

  if (error?.data?.code === "DATABASE_AUTH_FAILED") {
    return "Database credentials were rejected. Check the Neon connection string.";
  }

  if (error?.data?.code === "DATABASE_NOT_FOUND") {
    return "Database URL points to a database that does not exist.";
  }

  if (error?.data?.code === "DATABASE_CONNECTION_FAILED") {
    return "Database connection failed from this deployment.";
  }

  if (error?.data?.code === "DATABASE_PERMISSION_DENIED") {
    return "Database rejected this profile write.";
  }

  if (error?.status === 401) {
    return "Your secure session expired. Sign in again to save.";
  }

  return "Profile could not be saved. Try again in a moment.";
}

async function saveProfilePreferences(reason = "interaction", options = {}) {
  if (!authState.enabled || !authState.authenticated) return false;

  try {
    const result = await postJson("/api/profile", {
      reason,
      preferences: preferenceSnapshot()
    });
    if (result.mode !== "database") {
      const error = new Error(result.message || "Profile was not persisted.");
      error.data = result;
      throw error;
    }

    authState.profilePersistence = "database";
    authStatus.textContent = "Profile saved";
    return true;
  } catch (error) {
    authState.profilePersistence = error?.data?.code === "DATABASE_NOT_CONFIGURED" ? "local" : "error";
    authStatus.textContent = "Save failed";
    if (options.showErrors && intakeStatus) {
      intakeStatus.textContent = profileSaveFailureMessage(error);
    }
    return false;
  }
}

function queuePreferenceSave(reason) {
  if (!authState.enabled || !authState.authenticated) return;
  clearTimeout(preferenceSaveTimer);
  preferenceSaveTimer = setTimeout(() => {
    saveProfilePreferences(reason, { showErrors: false });
  }, 700);
}

function applyProfilePreferences(preferences) {
  if (!preferences || typeof preferences !== "object") return;

  if (preferences.intake) {
    applyIntakeProfile(preferences.intake);
  }

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
  if (!authState.enabled || !authState.authenticated) return false;

  try {
    const result = await getJson("/api/profile");
    if (result.mode !== "database") {
      authState.profilePersistence = "local";
      authStatus.textContent = "Profile local";
      intakeStatus.textContent = "Profile saving is not connected on this deployment yet.";
      return false;
    }

    authState.profilePersistence = "database";
    authState.role = result.data?.user?.role || "client";
    renderAuthState();
    applyProfilePreferences(result.data?.preferences);
    if (authState.role === "admin") {
      await loadAdminOverview();
    }
    return true;
  } catch (error) {
    authState.profilePersistence = error?.data?.code === "DATABASE_NOT_CONFIGURED" ? "local" : "error";
    authStatus.textContent = "Profile local";
    intakeStatus.textContent = profileSaveFailureMessage(error);
    return false;
  }
}

function formatDate(value) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(
    new Date(value)
  );
}

function adminRows(items, renderRow) {
  if (!items?.length) return '<p class="admin-empty">No rows yet.</p>';
  return items.map(renderRow).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]
  );
}

function renderAdminOverview(data) {
  const totals = data.totals || {};
  const security = data.security || {};
  adminMode.textContent = data.user?.role === "admin" ? "Admin live" : "Secure live";
  adminStats.innerHTML = [
    ["Users", totals.users || 0],
    ["Requests", totals.service_requests || 0],
    ["Cleanprints", totals.cleanprints || 0],
    ["Inventory scans", totals.inventory_scans || 0],
    ["Feedback", totals.feedback_events || 0],
    ["Secure tables", `${security.rls_forced || 0}/${security.protected_tables || 0}`]
  ]
    .map(([label, value]) => `<div class="admin-stat"><strong>${value}</strong><span>${label}</span></div>`)
    .join("");

  adminUserCount.textContent = `${data.users?.length || 0} shown`;
  adminRequestCount.textContent = `${data.serviceRequests?.length || 0} shown`;
  adminCleanprintCount.textContent = `${data.cleanprints?.length || 0} shown`;
  adminInventoryCount.textContent = `${data.inventoryScans?.length || 0} shown`;
  adminFeedbackCount.textContent = `${data.feedback?.length || 0} shown`;

  adminUsers.innerHTML = adminRows(
    data.users,
    (user) => `
      <article class="admin-row">
        <header><strong>${escapeHtml(user.full_name || "Unnamed user")}</strong><b>${escapeHtml(user.role)}</b></header>
        <span>${escapeHtml(user.email || user.auth_subject || "No email")}</span>
        <span>${formatDate(user.created_at)}</span>
      </article>
    `
  );

  adminRequests.innerHTML = adminRows(
    data.serviceRequests,
    (request) => `
      <article class="admin-row">
        <header><strong>${escapeHtml(request.service_category || "request")}</strong><b>${escapeHtml(request.status)}</b></header>
        <span>${escapeHtml(request.task_summary || "No summary")}</span>
        <span>${currency((request.budget_cents || 0) / 100)} / ${formatDate(request.created_at)}</span>
      </article>
    `
  );

  adminCleanprints.innerHTML = adminRows(
    data.cleanprints,
    (plan) => `
      <article class="admin-row">
        <header><strong>${escapeHtml(plan.level)} / ${escapeHtml(plan.priority)}</strong><b>${escapeHtml(plan.status)}</b></header>
        <span>${plan.room_count} rooms / ${plan.task_count} tasks / ${plan.proof_count} proofs</span>
        <span>${plan.estimated_minutes}m / ${formatDate(plan.created_at)}</span>
      </article>
    `
  );

  adminInventory.innerHTML = adminRows(
    data.inventoryScans,
    (scan) => `
      <article class="admin-row">
        <header><strong>${escapeHtml(scan.source_file_name || "Inventory scan")}</strong><b>${escapeHtml(scan.status)}</b></header>
        <span>${escapeHtml(scan.provider)}</span>
        <span>${formatDate(scan.created_at)}</span>
      </article>
    `
  );

  adminFeedback.innerHTML = adminRows(
    data.feedback,
    (event) => `
      <article class="admin-row">
        <header><strong>${escapeHtml(event.rating)} stars</strong><b>${escapeHtml(event.sentiment)}</b></header>
        <span>${currency((event.tip_cents || 0) / 100)} tip</span>
        <span>${formatDate(event.created_at)}</span>
      </article>
    `
  );
}

async function loadAdminOverview() {
  try {
    const result = await getJson("/api/admin/overview");
    renderAdminOverview(result.data);
  } catch {
    adminMode.textContent = "Admin blocked";
    adminStats.innerHTML = '<p class="admin-empty">Admin access is limited to approved AURA operators.</p>';
  }
}

async function continueAuth0Login() {
  if (!authConfig?.enabled) {
    renderAuthPortalState();
    return;
  }

  authPortalContinue.disabled = true;
  authState.authMessage = "";
  authPortalStatus.textContent = "Opening secure sign-in...";
  const returnTo = `${window.location.pathname}${window.location.hash || ""}`;
  window.location.assign(`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
}

function login() {
  openAuthPortal();
}

async function logout() {
  window.location.assign("/api/auth/logout");
}

async function ensureSignedIn(actionLabel) {
  if (!authState.enabled) return true;
  if (authState.authenticated) return true;
  bookingStatus.textContent = `${actionLabel} needs a secure AURA profile first.`;
  openAuthPortal(actionLabel);
  return false;
}

async function initAuth() {
  if (forwardRootAuthCallback()) return;

  renderAuthState();

  try {
    const result = await fetch("/api/auth-config").then((response) => response.json());
    authConfig = result.data || {};
    authState.enabled = Boolean(authConfig.enabled);
    authState.apiProtectionEnabled = Boolean(authConfig.apiProtectionEnabled);

    if (handleAuthErrorFromUrl()) {
      authState.ready = true;
      renderAuthState();
      return;
    }

    if (!authState.enabled) {
      authState.ready = true;
      renderAuthState();
      return;
    }

    const session = await fetch("/api/auth/session").then((response) => response.json());
    authState.authenticated = Boolean(session.data?.authenticated);
    if (authState.authenticated) {
      authState.user = session.data.user;
      renderAuthState();
      await loadProfilePreferences();
    }

    authState.ready = true;
    renderAuthState();
  } catch {
    authState.ready = true;
    authState.enabled = true;
    authState.apiProtectionEnabled = true;
    authState.authenticated = false;
    authState.user = null;
    authState.authMessage = "Secure access could not start. Please refresh and try again.";
    renderAuthState();
    authStatus.textContent = "Secure access";
    authGreeting.textContent = "Secure access is starting. Please refresh and try again.";
    if (authPortalStatus) authPortalStatus.textContent = "Secure access could not start. Please refresh and try again.";
    if (authPortalContinue) authPortalContinue.disabled = true;
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.modeButton);
    queuePreferenceSave("mode");
  });
});

intakeModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setIntakeMode(button.dataset.intakeModeButton);
    queuePreferenceSave("intake-mode");
  });
});

intakeStudio.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-token]");
  if (addButton) {
    addTokenFromInput(addButton.dataset.addToken, addButton.dataset.tokenInput);
    return;
  }

  const removeButton = event.target.closest(".intake-token-remove");
  if (removeButton) {
    removeButton.closest(".intake-token")?.remove();
    updateIntakeExperience("Profile updated.");
    queuePreferenceSave("intake-token-remove");
    return;
  }

  const toggle = event.target.closest(".intake-toggle-grid button[data-value]");
  if (toggle) {
    toggle.classList.toggle("is-active");
    updateIntakeExperience("Profile updated.");
    queuePreferenceSave("intake-toggle");
  }
});

intakeStudio.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const input = event.target.closest(".intake-add-row input");
  if (!input) return;
  event.preventDefault();
  const button = input.closest(".intake-add-row")?.querySelector("[data-add-token]");
  if (button) addTokenFromInput(button.dataset.addToken, button.dataset.tokenInput);
});

intakeStudio.addEventListener("input", (event) => {
  if (!event.target.closest("input, select")) return;
  if (event.target === clientBudgetStyle) {
    budgetSelect.value = clientBudgetStyle.value;
    updateQuote();
  }
  updateIntakeExperience("Profile updated.");
  queuePreferenceSave("intake-input");
});

intakeStudio.addEventListener("change", (event) => {
  if (!event.target.closest("select")) return;
  if (event.target === clientBudgetStyle) {
    budgetSelect.value = clientBudgetStyle.value;
    updateQuote();
  }
  updateIntakeExperience("Profile updated.");
  queuePreferenceSave("intake-change");
});

saveIntake.addEventListener("click", saveIntakeProfile);
resetIntake.addEventListener("click", () => {
  renderIntakeDefaults();
  queuePreferenceSave("intake-reset");
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
authPortalContinue.addEventListener("click", continueAuth0Login);
authPortalClose.addEventListener("click", closeAuthPortal);
authPortal.addEventListener("click", (event) => {
  if (event.target === authPortal) closeAuthPortal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authPortal.hidden) closeAuthPortal();
});

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
  bookingStatus.textContent = assistant
    ? `Intent Reactor locked ${assistant.name}: ${assistant.fit} fit, ${assistant.eta ? `${assistant.eta} minute ETA` : "live ETA"}, ${currency(payout)} payout.`
    : `Intent Reactor priced the request at ${currency(total)}. Real assistant supply will match after verification.`;
  liveBookings.textContent = (Number(liveBookings.textContent.replace(",", "")) + 1).toLocaleString("en-US");

  try {
    const result = await postJson("/api/bookings", {
      taskSummary: taskInput.value,
      serviceCategory: service,
      urgency: timeSelect.value,
      budgetCents: total * 100,
      assistantId: assistant?.id || null,
      market: currentMarket(),
      matchScore: assistant?.fit || null,
      platformFeeCents: fee * 100
    });
    bookingStatus.textContent = assistant
      ? `${result.message} ${assistant.name} remains the top trust-lattice match.`
      : `${result.message} AURA will attach verified supply when available.`;
  } catch {
    bookingStatus.textContent = assistant
      ? `Request drafted with ${assistant.name}. Sign in to save and manage it.`
      : "Request drafted. Sign in to save it and match verified assistants.";
  }
});

document.querySelector("#optimizeDay").addEventListener("click", () => {
  document.querySelector("#calendar").scrollIntoView({ behavior: "smooth" });
  bookingStatus.textContent = "AURA found 3 calendar improvements and one profitable task bundle.";
});

assistantList.addEventListener("click", (event) => {
  const profileJump = event.target.closest("[data-jump-profile]");
  if (profileJump) {
    document.querySelector("#profile").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const button = event.target.closest(".hire-assistant");
  if (!button) return;
  const assistant = assistantSupply.find((item) => item.id === button.dataset.assistant);
  if (!assistant) return;
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
  const assistantProfileJump = event.target.closest("[data-jump-assistant-profile]");
  if (assistantProfileJump) {
    setIntakeMode("assistant");
    document.querySelector("#profile").scrollIntoView({ behavior: "smooth" });
    return;
  }

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
      '<div class="detection-item"><strong>Saved locally</strong><span>Pending</span><span>Sign in to keep inventory scans in your AURA profile.</span></div>'
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
    feedbackResult.textContent = "Feedback captured locally. Sign in to keep it with your AURA profile.";
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
renderIntakeDefaults();
updateQuote();
loadAssistants();
initAuth();
