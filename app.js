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

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function updateQuote() {
  const base = Number(budgetSelect.value);
  const urgency = timeSelect.value === "urgent" ? 32 : 0;
  const recurringCredit = timeSelect.value === "recurring" ? -18 : 0;
  const total = Math.max(65, base + urgency + recurringCredit);
  const fee = Math.round(total * 0.18);
  quotePrice.textContent = currency(total);
  assistantPayout.textContent = currency(total - fee);
  auraFee.textContent = currency(fee);
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
  const service = document.querySelector(".service-chip.is-active").dataset.service;
  const assistant = assistants.find((item) => item.tags.join(" ").toLowerCase().includes(service)) || assistants[0];
  bookingStatus.textContent = `Matching ${assistant.name}. ETA ${assistant.eta} minutes. Booking intelligence is preparing the checklist.`;
  liveBookings.textContent = (Number(liveBookings.textContent.replace(",", "")) + 1).toLocaleString("en-US");

  try {
    const result = await postJson("/api/bookings", {
      taskSummary: taskInput.value,
      serviceCategory: service,
      urgency: timeSelect.value,
      budgetCents: Number(budgetSelect.value) * 100,
      assistantId: assistant.id,
      market: "Miami"
    });
    bookingStatus.textContent = result.message;
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
});

renderAssistants();
renderTimeline();
renderChecklists();
renderDetections();
updateQuote();
