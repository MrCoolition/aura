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
const reactorSummary = document.querySelector("#reactorSummary");
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

  reactorMode.textContent = `${serviceLabel} reactor`;
  reactorSummary.textContent = `AURA split this request into ${atoms.length} task atoms with ${average}% operational confidence.`;
  matchHeat.textContent = average;
  frictionSaved.textContent = `${friction}h`;
  repeatOdds.textContent = `${repeat}%`;

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
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json();
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.modeButton));
});

serviceChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    serviceChips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    taskInput.value = serviceTemplates[chip.dataset.service];
    updateQuote();
  });
});

budgetSelect.addEventListener("change", updateQuote);
timeSelect.addEventListener("change", updateQuote);

document.querySelector("#jumpToBooking").addEventListener("click", () => {
  document.querySelector("#marketplace").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#jumpToProvider").addEventListener("click", () => {
  setMode("earn");
  document.querySelector("#earn").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#bookRequest").addEventListener("click", async () => {
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
renderChecklists();
renderLifeprint();
renderMissionControl();
renderDetections();
updateQuote();
