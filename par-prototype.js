const state = {
  route: "dashboard",
  selectedOrderId: "PO-1048",
  selectedDashboardOrderId: "PO-1069",
  selectedInventoryId: "seal-kit",
  selectedRecommendationId: "PO-1048::seal-kit",
  selectedRequestId: "PR-2048",
  selectedCompletedRequestId: null,
  selectedCustomer: null,
  customerSearch: "",
  statusFilter: "All",
  pumpFilter: "All",
  stockFilter: "All",
  orderSearch: "",
  inventorySearch: "",
  releasedOrderIds: [],
  finishedOrderIds: [],
  createdOrders: [],
  nextOrderSeq: 1092,
  nextRequestSeq: 2090,
  createOrderError: "",
  createRequestError: "",
  receivedRequestIds: [],
  cancelledRequestIds: [],
  partialReceipts: {
    "PR-2057": 10,
    "PR-2063": 2,
  },
  createdRequests: [],
  createOrderId: "",
  createCustomerChoice: "Select customer",
  createNewCustomerName: "",
  createCustomerType: "Commercial",
  createPump: "Select pump model",
  createQty: "",
  createOrderedDate: "",
  createDate: "",
  createNotes: "",
  priority: "High",
  supplier: "Preferred supplier",
  editPriority: null,
  editSupplier: null,
  editCompletedStatus: null,
  historyNoteDraft: null,
  reopenedHistoryIds: [],
  editDraft: null,
  receiptDraft: null,
  createRequestMode: "recommendation",
  activeModal: null,
};

// Customers are master data: defined once, referenced by orders via customerId.
// Customer type lives here, not on the order, so it cannot contradict itself
// between two orders for the same company.
const customers = [
  { id: "northfield", name: "Northfield Waterworks", type: "Municipal" },
  { id: "delta-farms", name: "Delta Farms", type: "Agricultural" },
  { id: "city-utilities", name: "City Utilities", type: "Municipal" },
  { id: "riverbend", name: "Riverbend Co-op", type: "Agricultural" },
  { id: "oakridge", name: "Oakridge Processing", type: "Industrial" },
  { id: "harbor-supply", name: "Harbor Supply", type: "Commercial" },
  { id: "mesa-agri", name: "Mesa Agri Systems", type: "Agricultural" },
  { id: "fairview", name: "Fairview Water Systems", type: "Municipal" },
  { id: "crestline", name: "Crestline Municipal", type: "Municipal" },
];

const orders = [
  { id: "PO-1048", customerId: "northfield", model: "Pump A-12", qty: 12, ordered: "Jun 8, 2026", date: "Jun 12, 2026", notes: "Priority replacement order for site maintenance.", priority: "High", components: [{ itemId: "seal-kit", required: 12 }, { itemId: "impeller", required: 8 }, { itemId: "fastener", required: 24 }] },
  { id: "PO-1051", customerId: "delta-farms", model: "Pump B-20", qty: 6, ordered: "Jun 9, 2026", date: "Jun 14, 2026", notes: "Standard irrigation pump batch.", priority: "Medium", stage: "released", components: [{ itemId: "motor", required: 20 }] },
  { id: "PO-1057", customerId: "city-utilities", model: "Pump C-05", qty: 18, ordered: "Jun 10, 2026", date: "Jun 18, 2026", notes: "Split delivery acceptable if assembly runs late.", priority: "Medium", stage: "released", components: [{ itemId: "impeller", required: 27 }] },
  { id: "PO-1062", customerId: "riverbend", model: "Pump A-12", qty: 8, ordered: "Jun 12, 2026", date: "Jun 21, 2026", notes: "Hold finished units for customer pickup.", priority: "Medium", components: [{ itemId: "shaft", required: 8 }] },
  { id: "PO-1064", customerId: "oakridge", model: "Pump D-10", qty: 4, ordered: "Jun 13, 2026", date: "Jun 24, 2026", notes: "Use standard packaging.", priority: "Medium", components: [{ itemId: "casing", required: 4 }] },
  { id: "PO-1069", customerId: "harbor-supply", model: "Pump D-10", qty: 5, ordered: "Jun 14, 2026", date: "Jun 25, 2026", notes: "Confirm final inspection before dispatch.", priority: "Medium", stage: "released", components: [{ itemId: "coupling", required: 5 }] },
  { id: "PO-1068", customerId: "mesa-agri", model: "Pump B-20", qty: 10, ordered: "Jun 15, 2026", date: "Jun 28, 2026", notes: "Waiting for bearing stock before release.", priority: "High", components: [{ itemId: "bearing", required: 10 }, { itemId: "mechanical-seal", required: 10 }] },
  { id: "PO-1072", customerId: "fairview", model: "Pump C-05", qty: 8, ordered: "Jun 16, 2026", date: "Jun 30, 2026", notes: "Awaiting gasket restock before release.", priority: "Low", components: [{ itemId: "gasket", required: 8 }] },
  { id: "PO-1074", customerId: "crestline", model: "Pump D-10", qty: 18, ordered: "Jun 17, 2026", date: "Jul 2, 2026", notes: "Blocked on O-Ring Set until received.", priority: "Medium", components: [{ itemId: "o-ring", required: 18 }] },
  { id: "PO-1076", customerId: "riverbend", model: "Pump A-12", qty: 3, ordered: "Jun 17, 2026", date: "Jul 3, 2026", notes: "Replacement units for the east field station.", priority: "Medium", components: [{ itemId: "seal-kit", required: 3 }, { itemId: "impeller", required: 3 }, { itemId: "fastener", required: 6 }] },
  { id: "PO-1078", customerId: "city-utilities", model: "Pump C-05", qty: 2, ordered: "Jun 18, 2026", date: "Jul 6, 2026", notes: "Spare units held for the treatment plant.", priority: "Low", components: [{ itemId: "gasket", required: 2 }] },
  { id: "PO-1080", customerId: "oakridge", model: "Centrifugal Pump CP-100", qty: 4, ordered: "Jun 18, 2026", date: "Jul 8, 2026", notes: "Standard build, no special handling.", priority: "Medium", components: [{ itemId: "casing", required: 4 }, { itemId: "impeller", required: 4 }, { itemId: "shaft", required: 4 }, { itemId: "mechanical-seal", required: 4 }] },
];

const completedOrders = [
  { id: "PO-1036", customerId: "northfield", model: "Pump A-12", qty: 10, ordered: "May 26, 2026", date: "Jun 5, 2026", completed: "Jun 7, 2026", status: "Finished" },
  { id: "PO-1032", customerId: "delta-farms", model: "Pump B-20", qty: 4, ordered: "May 22, 2026", date: "Jun 4, 2026", completed: "Jun 6, 2026", status: "Finished" },
  { id: "PO-1028", customerId: "oakridge", model: "Pump D-10", qty: 6, ordered: "May 18, 2026", date: "Jun 2, 2026", completed: "Jun 4, 2026", status: "Finished" },
];

const inventory = [
  { id: "seal-kit", name: "Seal Kit SK-08", category: "Component", onHand: 4, reorder: 20, related: ["PO-1048 needs 12 units", "PO-1057 may need 18 units"] },
  { id: "bearing", name: "Bearing BR-02", category: "Component", onHand: 0, reorder: 12, related: ["PO-1068 needs this item before release."] },
  { id: "impeller", name: "Impeller 4in", category: "Component", onHand: 9, reorder: 30, related: ["PO-1057 may need 18 units"] },
  { id: "motor", name: "Motor Housing", category: "Component", onHand: 14, reorder: 10, related: ["PO-1051 needs 6 units"] },
  { id: "fastener", name: "Fastener Set FS-20", category: "Component", onHand: 30, reorder: 25, related: [] },
  { id: "shaft", name: "Shaft Assembly", category: "Component", onHand: 16, reorder: 10, related: ["PO-1062 needs 8 units"] },
  { id: "mechanical-seal", name: "Mechanical Seal", category: "Component", onHand: 6, reorder: 14, related: ["PO-1068 may need 10 units"] },
  { id: "o-ring", name: "O-Ring Set", category: "Component", onHand: 0, reorder: 18, related: ["PO-1074 cannot start until this item is received."] },
  { id: "gasket", name: "Gasket G-14", category: "Component", onHand: 3, reorder: 8, related: ["PO-1072 needs 8 units"] },
  { id: "casing", name: "Pump Casing", category: "Component", onHand: 11, reorder: 8, related: [] },
  { id: "coupling", name: "Coupling Set", category: "Component", onHand: 7, reorder: 6, related: ["PO-1069 needs 5 units"] },
  { id: "pump-cp", name: "Pump CP-100", category: "Finished good", onHand: 18, reorder: 8, related: [] },
];

const requests = [
  { id: "PR-2048", item: "Seal Kit SK-08", itemId: "seal-kit", order: "PO-1048", qty: 8, priority: "High", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 10, 2026", expectedDate: "2026-06-15" },
  { id: "PR-2051", item: "Bearing BR-02", itemId: "bearing", order: "PO-1068", qty: 10, priority: "High", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 9, 2026", expectedDate: "2026-06-16" },
  { id: "PR-2057", item: "Impeller 4in", itemId: "impeller", order: "PO-1057", qty: 18, priority: "Medium", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 8, 2026", expectedDate: "2026-06-20" },
  { id: "PR-2063", item: "Gasket G-14", itemId: "gasket", order: "PO-1072", qty: 5, priority: "Low", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 11, 2026", expectedDate: "2026-06-25" },
];

const requestHistory = [
  { id: "PR-2038", item: "Fastener Set FS-20", itemId: "fastener", order: "PO-1036", qty: 24, priority: "Low", status: "Received", completed: "Jun 8, 2026", notes: "Parts received and inventory updated." },
  { id: "PR-2034", item: "Gasket G-14", itemId: "gasket", order: "PO-1032", qty: 6, priority: "Medium", status: "Cancelled", completed: "Jun 6, 2026", notes: "Cancelled after order quantity was revised." },
];

const app = document.getElementById("app");
const appTodayIso = "2026-06-12";

function pumpModelOptions() {
  return ["Select pump model", "Centrifugal Pump CP-100", "Pump A-12", "Pump B-20", "Pump C-05", "Pump D-10"];
}

function customerTypeOptions() {
  return ["Commercial", "Agricultural", "Industrial", "Municipal"];
}

// Quantities are PER PUMP. The order's total requirement is per-unit x order qty,
// so a run of 50 pumps claims 50x the parts of a run of 1.
const pumpModelDefaultComponents = {
  "Centrifugal Pump CP-100": [{ itemId: "casing", required: 1 }, { itemId: "impeller", required: 1 }, { itemId: "shaft", required: 1 }, { itemId: "mechanical-seal", required: 1 }],
  "Pump A-12": [{ itemId: "seal-kit", required: 1 }, { itemId: "impeller", required: 1 }, { itemId: "fastener", required: 2 }],
  "Pump B-20": [{ itemId: "bearing", required: 1 }, { itemId: "mechanical-seal", required: 1 }],
  "Pump C-05": [{ itemId: "gasket", required: 1 }],
  "Pump D-10": [{ itemId: "o-ring", required: 1 }],
};

function defaultComponentsForModel(model) {
  const template = pumpModelDefaultComponents[model];
  return template ? template.map((component) => ({ ...component })) : [];
}

function parsePositiveInt(value) {
  const n = Number(String(value ?? "").trim());
  return Number.isInteger(n) && n > 0 ? n : null;
}

function nextProductionOrderId() {
  return `PO-${state.nextOrderSeq}`;
}

function isOrderIdTaken(id) {
  return [...orders, ...state.createdOrders].some((order) => order.id === id);
}

const NEW_CUSTOMER_OPTION = "+ Add new customer";

function customerChoiceOptions() {
  return ["Select customer", ...customers.map((customer) => customer.name), NEW_CUSTOMER_OPTION];
}

function isAddingNewCustomer() {
  return state.createCustomerChoice === NEW_CUSTOMER_OPTION;
}

// Type is read off the chosen customer record; only a brand-new customer lets
// you set it, which is what stops two orders disagreeing about the same company.
function customerTypeForChoice() {
  if (isAddingNewCustomer()) return state.createCustomerType || "Commercial";
  const picked = customers.find((customer) => customer.name === state.createCustomerChoice);
  return picked ? picked.type : "—";
}

function customerIdBySlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Resolves the form's customer selection to a master-data record, creating one
// only when the user explicitly chose "add new".
function resolveCreateCustomer() {
  if (isAddingNewCustomer()) {
    const name = state.createNewCustomerName.trim();
    if (!name) return { error: "Enter a name for the new customer." };
    const existing = customers.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (existing) return { error: `${existing.name} already exists — pick them from the list instead.` };
    const record = { id: customerIdBySlug(name) || `customer-${customers.length + 1}`, name, type: state.createCustomerType || "Commercial" };
    return { record, isNew: true };
  }
  const picked = customers.find((c) => c.name === state.createCustomerChoice);
  if (!picked) return { error: "Select a customer for this order." };
  return { record: picked, isNew: false };
}

function resetCreateOrderForm() {
  state.createOrderId = nextProductionOrderId();
  state.createCustomerChoice = "Select customer";
  state.createNewCustomerName = "";
  state.createCustomerType = "Commercial";
  state.createPump = "Select pump model";
  state.createQty = "";
  state.createOrderedDate = appTodayIso;
  state.createDate = "";
  state.createNotes = "";
  state.createOrderError = "";
}

function ensureCreateOrderDefaults() {
  if (!state.createOrderId) state.createOrderId = nextProductionOrderId();
  if (!state.createOrderedDate) state.createOrderedDate = appTodayIso;
}

// The bill of materials belongs to the pump model, not the order. The order's
// requirement is simply the model's per-pump list multiplied by the quantity.
function validCreateComponents(orderQty = 1) {
  return defaultComponentsForModel(state.createPump).map((component) => ({
    itemId: component.itemId,
    required: component.required * orderQty,
  }));
}

function buildOrderFromForm(id, qty, customerId) {
  return {
    id,
    customerId,
    model: state.createPump && state.createPump !== "Select pump model" ? state.createPump : "Custom pump model",
    qty,
    ordered: formatDateLabel(state.createOrderedDate),
    date: formatDateLabel(state.createDate),
    notes: state.createNotes.trim() || "No notes added",
    priority: "Medium",
    components: validCreateComponents(qty),
  };
}

function tryCreateOrder() {
  const id = (state.createOrderId || "").trim();
  const qty = parsePositiveInt(state.createQty);
  if (!id) {
    state.createOrderError = "Order ID is required.";
    return null;
  }
  if (isOrderIdTaken(id)) {
    state.createOrderError = `Order ID ${id} already exists. Choose a different ID.`;
    return null;
  }
  if (!qty) {
    state.createOrderError = "Enter a quantity greater than 0.";
    return null;
  }
  const resolvedCustomer = resolveCreateCustomer();
  if (resolvedCustomer.error) {
    state.createOrderError = resolvedCustomer.error;
    return null;
  }
  if (resolvedCustomer.isNew) customers.push(resolvedCustomer.record);
  const order = buildOrderFromForm(id, qty, resolvedCustomer.record.id);
  state.createdOrders.push(order);
  state.nextOrderSeq += 1;
  state.createOrderError = "";
  state.selectedOrderId = order.id;
  return order;
}

function currentPurchaseRequests() {
  return [...state.createdRequests, ...requests];
}

function findPurchaseRequest(id) {
  return currentPurchaseRequests().find((r) => r.id === id) || requestHistory.find((r) => r.id === id);
}

function isRequestIdTaken(id) {
  return requests.some((r) => r.id === id) || requestHistory.some((r) => r.id === id) || state.createdRequests.some((r) => r.id === id);
}

function nextPurchaseRequestId() {
  let id = `PR-${state.nextRequestSeq}`;
  while (isRequestIdTaken(id)) {
    state.nextRequestSeq += 1;
    id = `PR-${state.nextRequestSeq}`;
  }
  return id;
}

function inventoryItemById(id) {
  return inventory.find((item) => item.id === id);
}

function customerById(id) {
  return customers.find((customer) => customer.id === id);
}

function orderCustomerName(order) {
  return customerById(order.customerId)?.name || "Not recorded";
}

function orderCustomerType(order) {
  return customerById(order.customerId)?.type || "Commercial";
}

function inventoryStockStatus(item) {
  if (item.onHand <= 0) return "Out of stock";
  if (item.onHand < item.reorder) return "Low stock";
  return "In stock";
}

function orderShortages(order) {
  return (order.components || []).map((component) => {
    const item = inventoryItemById(component.itemId);
    const available = item ? item.onHand : 0;
    return {
      itemId: component.itemId,
      item,
      required: component.required,
      available,
      shortage: Math.max(component.required - available, 0),
    };
  });
}

function isOrderBlocked(order) {
  return orderShortages(order).some((component) => component.shortage > 0);
}

function findAnyOrder(orderId) {
  return [...orders, ...state.createdOrders].find((order) => order.id === orderId);
}

// Parts physically leave the shelf when an order is released to the floor.
function applyComponentStock(order, direction) {
  (order.components || []).forEach((component) => {
    const item = inventoryItemById(component.itemId);
    if (item) item.onHand = Math.max(0, item.onHand + direction * component.required);
  });
}

function releaseOrder(orderId) {
  if (state.releasedOrderIds.includes(orderId)) return false;
  const order = findAnyOrder(orderId);
  if (!order || isOrderBlocked(order)) return false;
  applyComponentStock(order, -1);
  state.releasedOrderIds.push(orderId);
  return true;
}

function returnOrderToQueue(orderId) {
  if (!state.releasedOrderIds.includes(orderId)) return false;
  const order = findAnyOrder(orderId);
  if (!order) return false;
  applyComponentStock(order, 1);
  state.releasedOrderIds = state.releasedOrderIds.filter((id) => id !== orderId);
  return true;
}

function isOrderQueued(order) {
  return !(state.releasedOrderIds.includes(order.id) || state.finishedOrderIds.includes(order.id));
}

function computedOrderStatus(order) {
  if (state.finishedOrderIds.includes(order.id)) return "Finished";
  if (state.releasedOrderIds.includes(order.id)) return "In production";
  return isOrderBlocked(order) ? "Blocked" : "Ready to build";
}

function blockingSummary(order) {
  return orderShortages(order)
    .filter((component) => component.shortage > 0)
    .map((component) => component.item?.name)
    .filter(Boolean)
    .join(", ");
}

function activeRequestForShortfall(orderId, itemId) {
  return currentPurchaseRequests().find(
    (request) => request.order === orderId && request.itemId === itemId && ["Pending", "Partially received"].includes(requestStatus(request))
  );
}

function orderExpectedReadyLabel(order) {
  const dates = orderShortages(order)
    .filter((component) => component.shortage > 0)
    .map((component) => activeRequestForShortfall(order.id, component.itemId)?.expectedDate)
    .filter(Boolean);
  if (!dates.length) return null;
  const latest = dates.reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
  return formatDateLabel(latest);
}

const customerUrgencyNotes = {
  Agricultural: "Delivery is tied to planting season — a delay can cost the customer the full growing season.",
  Industrial: "Tied to a customer production line changeover — a delay can halt the customer's own output.",
  Municipal: "Scheduled infrastructure replacement — typically has more flexibility if delayed.",
  Commercial: "Standard delivery — no seasonal or regulatory deadline pressure.",
};

const customerUrgencyWeight = { Agricultural: 3, Industrial: 2, Municipal: 1, Commercial: 0 };

function orderUrgencyWeight(order) {
  return customerUrgencyWeight[orderCustomerType(order)] ?? 0;
}

function computeRecommendations() {
  const list = currentOrders()
    .filter((order) => isOrderQueued(order) && order.status === "Blocked")
    .flatMap((order) =>
      orderShortages(order)
        .filter((component) => component.shortage > 0)
        .map((component) => ({
          id: `${order.id}::${component.itemId}`,
          itemId: component.itemId,
          item: component.item?.name || component.itemId,
          order: order.id,
          required: component.required,
          available: component.available,
          shortage: component.shortage,
          priority: order.priority || "Medium",
        }))
    );
  const rank = { High: 0, Medium: 1, Low: 2 };
  return list.sort((a, b) => (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3));
}

function hasAnyActiveRequestForItem(itemId) {
  return currentPurchaseRequests().some(
    (request) => request.itemId === itemId && ["Pending", "Partially received"].includes(requestStatus(request))
  );
}

function restockRecommendations() {
  const orderDrivenItemIds = new Set(computeRecommendations().map((recommendation) => recommendation.itemId));
  return inventory
    .filter((item) => item.category === "Component")
    .filter((item) => inventoryStockStatus(item) !== "In stock")
    .filter((item) => !orderDrivenItemIds.has(item.id))
    .filter((item) => !hasAnyActiveRequestForItem(item.id))
    .map((item) => ({
      id: `restock::${item.id}`,
      itemId: item.id,
      item: item.name,
      order: "General restock",
      required: item.reorder,
      available: item.onHand,
      shortage: Math.max(item.reorder - item.onHand, 0),
      priority: item.onHand <= 0 ? "High" : "Low",
    }))
    .sort((a, b) => (a.priority === "High" ? 0 : 1) - (b.priority === "High" ? 0 : 1));
}

function allRecommendations() {
  return [...computeRecommendations(), ...restockRecommendations()];
}

function hasActiveRequestFor(orderId, itemId) {
  return currentPurchaseRequests().some(
    (request) => request.order === orderId && request.itemId === itemId && ["Pending", "Partially received"].includes(requestStatus(request))
  );
}

function availableRecommendations() {
  return allRecommendations().filter((recommendation) => !hasActiveRequestFor(recommendation.order, recommendation.itemId));
}

function selectedAvailableRecommendation() {
  const available = availableRecommendations();
  return available.find((recommendation) => recommendation.id === state.selectedRecommendationId) || available[0] || null;
}

function recommendationForInventoryItem(item) {
  return allRecommendations().find((recommendation) => recommendation.itemId === item.id);
}

function selectedInventoryItem() {
  return inventory.find((item) => item.id === state.selectedInventoryId && item.category === "Component") || inventory.find((item) => item.category === "Component");
}

function formatDateLabel(value) {
  if (!value) return "Not set";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateCompact(value) {
  if (!value) return "Not set";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function addDaysIso(iso, days) {
  const parsed = new Date(`${iso}T00:00:00`);
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function normalized(value) {
  return String(value).toLowerCase().replace(/\s+/g, "-");
}

function badge(value) {
  return `<i class="badge ${normalized(value)}">${value}</i>`;
}

function compactStatusBadge(value) {
  if (value === "Partially received") return badge("Partial");
  return badge(value);
}

function button(label, route, variant = "", extra = "") {
  return `<button class="button ${variant}" data-route="${route}" ${extra}>${label}</button>`;
}

function dropdown(id, value, options) {
  return `
    <div class="dropdown" data-dropdown="${id}">
      <button class="dropdown-trigger" type="button">
        <span>${value}</span>
        <span class="dropdown-chevron" aria-hidden="true"></span>
      </button>
      <div class="dropdown-menu">
        ${options
          .map(
            (option) =>
              `<button class="dropdown-option ${option === value ? "selected" : ""}" type="button" data-dropdown-option="${id}" data-value="${option}">${option}</button>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function createOrderFormFields() {
  ensureCreateOrderDefaults();
  return `
    ${state.createOrderError ? `<div class="field-error">${state.createOrderError}</div>` : ""}
    <div class="field"><label>Order ID</label><input data-create-field="orderId" value="${state.createOrderId}" /></div>
    <div class="field"><label>Customer</label>${dropdown("createCustomerChoice", state.createCustomerChoice, customerChoiceOptions())}</div>
    ${
      isAddingNewCustomer()
        ? `<div class="field"><label>New customer name</label><input data-create-field="newCustomerName" value="${state.createNewCustomerName}" placeholder="Enter customer name" /></div>
           <div class="field"><label>Customer type</label>${dropdown("createCustomerType", state.createCustomerType, customerTypeOptions())}</div>`
        : `<div class="field"><label>Customer type</label><input value="${customerTypeForChoice()}" readonly /></div>`
    }
    <div class="field"><label>Ordered date</label><input type="date" data-create-field="orderedDate" value="${state.createOrderedDate}" /></div>
    <div class="field"><label>Required date</label><input type="date" data-create-field="date" value="${state.createDate}" /></div>
    <div class="field"><label>Pump model</label>${dropdown("createPump", state.createPump, pumpModelOptions())}</div>
    <div class="field"><label>Quantity</label><input data-create-field="qty" value="${state.createQty}" placeholder="Enter quantity" /></div>
    <div class="field wide"><label>Notes</label><textarea data-create-field="notes" placeholder="Add production notes">${state.createNotes}</textarea></div>
    <p class="sub field-hint">${customerUrgencyNotes[customerTypeForChoice()] || ""}</p>
    ${componentEditorFields()}
  `;
}

// Read-only: the bill of materials comes from the pump model, so it cannot differ
// between two orders for the same model.
function componentEditorFields() {
  const perUnit = defaultComponentsForModel(state.createPump);
  const qty = parsePositiveInt(state.createQty) || 1;
  const rows = perUnit
    .map((component) => {
      const item = inventoryItemById(component.itemId);
      return `
        <div class="component-row-readonly">
          <span>${item ? item.name : component.itemId}</span>
          <small>${component.required} per pump</small>
          <strong>${component.required * qty} total</strong>
        </div>`;
    })
    .join("");
  return `
    <div class="component-editor">
      <div class="component-editor-head">
        <label>Components required</label>
        ${perUnit.length ? `<span class="panel-meta">${perUnit.length} parts</span>` : ""}
      </div>
      ${
        perUnit.length
          ? `<p class="sub">From the ${state.createPump} bill of materials, multiplied by the order quantity (&times; ${qty}).</p>${rows}`
          : `<p class="sub component-editor-empty">Select a pump model to see the components it needs.</p>`
      }
    </div>
  `;
}

function search(id, placeholder, value = "") {
  return `<input id="${id}" class="search-input" type="search" placeholder="${placeholder}" value="${value}" />`;
}

function toolbarField(label, control, wide = false) {
  return `<label class="toolbar-field ${wide ? "wide" : ""}"><span>${label}</span>${control}</label>`;
}

function pageMeta() {
  const meta = {
    dashboard: ["Dashboard", "Production readiness and inventory visibility"],
    orders: ["Production Orders", "Review order readiness against current inventory"],
    inventory: ["Inventory", "Check available parts and stock levels"],
    recommendations: ["Purchase Recommendations", "Items to purchase to unblock production orders"],
    requests: ["Purchase Requests", "Manage active purchase requests"],
    customers: ["Customers", "Review customer order history and context"],
    "create-order": ["Create Production Order", "Add a new internal production order"],
    "order-created": ["Order Created", "Production order created"],
    readiness: ["Order Readiness", "Automatic inventory result for this order"],
    "release-success": ["Release Complete", "Order released to assembly"],
    "no-issues": ["No Issues", "No blocked orders or inventory shortages"],
  };
  return meta[state.route] || meta.dashboard;
}

function shell(content) {
  const [pageTitle] = pageMeta();
  return `
    <div class="layout-shell">
      <aside class="sidebar">
        <a class="brand" href="#dashboard" data-route="dashboard">
          <span class="brand-text"><strong>PAR</strong></span>
        </a>
        <div class="nav-section-label">MAIN</div>
        <nav class="nav" aria-label="Prototype navigation">
          ${navLink("Dashboard", "dashboard")}
          ${navLink("Orders", "orders")}
          ${navLink("Inventory", "inventory")}
          ${navLink("Purchasing", "recommendations")}
          ${navLink("Requests", "requests")}
          ${navLink("Customers", "customers")}
        </nav>
      </aside>
      <main class="main-content">
        <header class="app-topbar">
          <div>
            <strong>${pageTitle}</strong>
          </div>
          <div class="topbar-actions">
            <span>Jun 12, 2026</span>
            <span>Manager</span>
          </div>
        </header>
        <div class="content-area">
          ${content}
        </div>
      </main>
    </div>
    ${modalLayer()}
  `;
}

function navLink(label, route) {
  return `<a href="#${route}" data-route="${route}" class="${activeNav(route)}">${label}</a>`;
}

function activeNav(route) {
  const current = state.route;
  if (route === "dashboard" && current === "dashboard") return "active";
  if (route === "orders" && ["orders", "create-order", "order-created", "readiness", "release-success"].includes(current)) return "active";
  if (route === "inventory" && current === "inventory") return "active";
  if (route === "recommendations" && current === "recommendations") return "active";
  if (route === "requests" && current === "requests") return "active";
  if (route === "customers" && current === "customers") return "active";
  return "";
}

function header(title, subtitle, action = "") {
  if (!action) return "";
  return `
    <section class="page-header action-only">
      <div>${action}</div>
    </section>
  `;
}

function productionOrdersWithState() {
  return [...orders, ...state.createdOrders].map((order) => {
    const status = computedOrderStatus(order);
    return { ...order, status, blocking: status === "Blocked" ? blockingSummary(order) : "" };
  });
}

function currentOrders() {
  return productionOrdersWithState().filter((order) => order.status !== "Finished");
}

function finishedOrders() {
  const newlyFinished = productionOrdersWithState()
    .filter((order) => order.status === "Finished")
    .map((order) => ({ ...order, completed: "Today" }));
  return [...newlyFinished, ...completedOrders];
}

function allCustomers() {
  const allOrders = [...currentOrders(), ...finishedOrders()];
  return customers
    .map((customer) => ({
      id: customer.id,
      name: customer.name,
      customerType: customer.type,
      orders: allOrders.filter((order) => order.customerId === customer.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function customerSummary(customer) {
  const active = customer.orders.filter((order) => order.status !== "Finished");
  return {
    active: active.length,
    blocked: active.filter((order) => order.status === "Blocked").length,
    finished: customer.orders.length - active.length,
  };
}

// The dashboard shows a short, representative slice rather than the whole queue:
// take orders round-robin across the statuses so every status is visible, then
// group them back so the table still reads blocked-first.
function dashboardOrderSample(list, limit) {
  const statusOrder = ["Blocked", "In production", "Ready to build"];
  const byStatus = statusOrder.map((status) =>
    list.filter((order) => order.status === status).sort((a, b) => orderUrgencyWeight(b) - orderUrgencyWeight(a))
  );
  const picked = [];
  for (let round = 0; picked.length < limit; round += 1) {
    let addedThisRound = false;
    byStatus.forEach((group) => {
      if (picked.length < limit && group[round]) {
        picked.push(group[round]);
        addedThisRound = true;
      }
    });
    if (!addedThisRound) break;
  }
  return picked.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
}

function dashboard() {
  const list = currentOrders();
  const inProduction = list.filter((o) => o.status === "In production");
  const ready = list.filter((o) => o.status === "Ready to build");
  const blocked = list.filter((o) => o.status === "Blocked");
  const low = inventory.filter((i) => ["Low stock", "Out of stock"].includes(inventoryStockStatus(i)));
  const dashboardOrders = dashboardOrderSample(list, 6);
  const receiptDue = currentPurchaseRequests()
    .filter((request) => ["Pending", "Partially received"].includes(requestStatus(request)))
    .slice(0, 3);
  const selectedDashboardOrder = dashboardOrders.find((o) => o.id === state.selectedDashboardOrderId) || dashboardOrders[0];
  return shell(`
    ${header("Dashboard", "Production readiness and inventory visibility")}
    <section class="grid summary">
      <article class="card metric clickable" data-route="orders" data-status-filter="In production"><span>In production</span><strong>${inProduction.length}</strong><small>Currently being built</small></article>
      <article class="card metric clickable" data-route="orders" data-status-filter="Ready to build"><span>Ready to build</span><strong>${ready.length}</strong><small>All components in stock</small></article>
      <article class="card metric emphasis clickable" data-route="orders" data-status-filter="Blocked"><span>Blocked</span><strong>${blocked.length}</strong><small>Need inventory action</small></article>
      <article class="card metric clickable" data-route="requests"><span>Purchase requests pending</span><strong>${currentPurchaseRequests().filter((r) => requestStatus(r) === "Pending").length}</strong><small>Awaiting receipt</small></article>
    </section>
    <section class="two-col">
      <article class="card">
        <div class="panel-head">
          <div>
            <h2>Production Orders</h2>
            <p>Active orders sorted by current production status</p>
          </div>
          <span class="panel-meta">${dashboardOrders.length} shown</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Pump model</th><th>Required date</th><th>Status</th></tr></thead>
            <tbody>
              ${dashboardOrders
                .map(
                  (o) =>
                    `<tr class="${selectedDashboardOrder && o.id === selectedDashboardOrder.id ? "selected" : ""}" data-dashboard-order="${o.id}"><td>${o.id}</td><td>${o.model}</td><td>${o.date}</td><td>${badge(o.status)}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="footer-row"><button class="button" data-route="orders">View production orders</button><span>Sample across statuses</span></div>
        </div>
      </article>
      <aside class="card side-panel">
        <h3>Order Summary</h3>
        ${
          selectedDashboardOrder
            ? `<p class="sub">Selected order: ${selectedDashboardOrder.id}</p>
              <div class="detail-list">
                <div class="full"><span>Pump model</span><strong>${selectedDashboardOrder.model}</strong></div>
                <div><span>Status</span>${badge(selectedDashboardOrder.status)}</div>
                <div><span>Customer type</span><strong>${orderCustomerType(selectedDashboardOrder)}</strong></div>
                <div><span>Ordered date</span><strong>${selectedDashboardOrder.ordered || "Today"}</strong></div>
                <div><span>Required date</span><strong>${selectedDashboardOrder.date}</strong></div>
                ${selectedDashboardOrder.status === "Blocked" && orderExpectedReadyLabel(selectedDashboardOrder) ? `<div class="full"><span>Expected ready</span><strong>${orderExpectedReadyLabel(selectedDashboardOrder)}</strong></div>` : ""}
              </div>`
            : `<p class="sub">No order selected</p>`
        }
      </aside>
    </section>
    <section class="two-col dashboard-inventory dashboard-split">
      <article class="card">
        <div class="panel-head"><div><h2>Inventory Attention</h2><p>Parts most likely to affect upcoming orders</p></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>On hand</th><th>Needed</th><th>Status</th></tr></thead>
            <tbody>
              ${low
                .slice(0, 3)
                .map((item) => {
                  const rec = recommendationForInventoryItem(item);
                  return `<tr data-inventory="${item.id}"><td>${item.name}</td><td>${item.onHand}</td><td>${rec ? rec.required : item.reorder}</td><td>${badge(inventoryStockStatus(item))}</td></tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
      <article class="card">
        <div class="panel-head"><div><h2>Inventory Receipts Due</h2><p>Requested parts still waiting to arrive</p></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Remaining</th><th>Status</th><th>Expected</th></tr></thead>
            <tbody>
              ${receiptDue
                .map((request) => `<tr data-request="${request.id}"><td>${request.item}</td><td>${remainingQty(request)}</td><td>${compactStatusBadge(requestStatus(request))}</td><td>${request.expectedDate ? formatDateCompact(request.expectedDate) : "Not set"}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `);
}

function ordersPage() {
  const orderSearch = state.orderSearch.trim().toLowerCase();
  const orderList = currentOrders().filter((o) => {
    const statusMatch = state.statusFilter === "All" || o.status === state.statusFilter;
    const pumpMatch = state.pumpFilter === "All" || o.model === state.pumpFilter;
    const searchMatch = !orderSearch || o.id.toLowerCase().includes(orderSearch) || o.model.toLowerCase().includes(orderSearch);
    return statusMatch && pumpMatch && searchMatch;
  });
  const finishedList = finishedOrders();
  const selectedOrder = currentOrders().find((o) => o.id === state.selectedOrderId) || orderList[0] || currentOrders()[0];
  return shell(`
    ${header("Production Orders", "Review order readiness against current inventory")}
    <section class="two-col-wide orders-layout">
      <div class="left-stack">
        <article class="card">
          <div class="panel-head"><div><h2>Order List</h2><p>Search and filter active production orders</p></div><button class="button" data-modal="create-production-order">Create production order</button></div>
          <div class="toolbar orders-toolbar">
            ${toolbarField("Search", search("order-search", "Search by order ID or pump model", state.orderSearch), true)}
            ${toolbarField("Status", dropdown("statusFilter", state.statusFilter, ["All", "Ready to build", "Blocked", "In production"]))}
            ${toolbarField("Pump model", dropdown("pumpFilter", state.pumpFilter, ["All", "Pump A-12", "Pump B-20", "Pump C-05", "Pump D-10"]))}
            <button class="button secondary" data-action="reset-order-filters">Reset filters</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Order ID</th><th>Pump model</th><th>Quantity</th><th>Required date</th><th>Status</th></tr></thead>
              <tbody>
                ${
                  orderList.length
                    ? orderList
                        .map(
                          (o) =>
                            `<tr class="${selectedOrder && o.id === selectedOrder.id ? "selected" : ""}" data-order-select="${o.id}"><td>${o.id}</td><td>${o.model}</td><td>${o.qty}</td><td>${o.date}</td><td>${badge(o.status)}</td></tr>`
                        )
                        .join("")
                    : `<tr><td colspan="5">No orders match these filters.</td></tr>`
                }
              </tbody>
            </table>
            <div class="footer-row"><span>Rows per page: 25</span><span>${orderList.length ? `1-${orderList.length} of ${orderList.length}` : "0 of 0"}</span></div>
          </div>
        </article>
        <article class="card">
          <div class="panel-head"><div><h2>Finished Orders</h2><p>Orders completed from production</p></div><span class="panel-meta">${finishedList.length} finished</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Order ID</th><th>Pump model</th><th>Quantity</th><th>Completed</th><th>Status</th></tr></thead>
              <tbody>
                ${
                  finishedList.length
                    ? finishedList.map((o) => `<tr><td>${o.id}</td><td>${o.model}</td><td>${o.qty}</td><td>${o.completed || "Today"}</td><td>${badge("Finished")}</td></tr>`).join("")
                    : `<tr><td colspan="5">No finished orders yet.</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </article>
      </div>
      <aside class="card side-panel">
        <h3>Order Detail</h3>
        ${
          selectedOrder
            ? `<p class="sub">Selected order: ${selectedOrder.id}</p>
              <div class="detail-list">
                <div class="full"><span>Customer</span><strong>${orderCustomerName(selectedOrder)}</strong></div>
                <div><span>Pump model</span><strong>${selectedOrder.model}</strong></div>
                <div><span>Customer type</span><strong>${orderCustomerType(selectedOrder)}</strong></div>
                <div><span>Quantity</span><strong>${selectedOrder.qty}</strong></div>
                <div><span>Status</span>${badge(selectedOrder.status)}</div>
                <div><span>Ordered date</span><strong>${selectedOrder.ordered || "Today"}</strong></div>
                <div><span>Required date</span><strong>${selectedOrder.date}</strong></div>
              </div>
              <div class="divider"></div>
              <h3>Next step</h3>
              ${
                selectedOrder.status === "Ready to build"
                  ? `<p>Components are in stock. Releasing takes them out of inventory.</p><button class="button full" data-order-status="In production" data-order="${selectedOrder.id}">Move to in production</button>`
                  : selectedOrder.status === "In production"
                    ? `<p>Being built. Mark it finished once it is ready to ship.</p>
                      <button class="button full" data-order-status="Finished" data-order="${selectedOrder.id}">Mark as finished</button>
                      <p class="sub" style="margin-top: 16px;">Returning this order puts its components back into stock.</p>
                      <button class="button secondary full" data-return-to-queue data-order="${selectedOrder.id}">Return to stock</button>`
                    : `<p>This order is blocked until missing inventory is resolved.${orderExpectedReadyLabel(selectedOrder) ? ` Expected by ${orderExpectedReadyLabel(selectedOrder)}.` : ""}</p><button class="button full" data-modal="create-purchase-request" data-rec-action="${selectedOrder.id}::${(orderShortages(selectedOrder).find((c) => c.shortage > 0) || {}).itemId || ""}">Create purchase request</button>`
              }`
            : `<p>No order selected.</p>`
        }
      </aside>
    </section>
  `);
}

function readinessPage() {
  const order = currentOrders().find((o) => o.id === state.selectedOrderId) || currentOrders()[0];
  const shortages = order ? orderShortages(order) : [];
  const blocked = shortages.some((c) => c.shortage > 0);
  const status = blocked ? "Blocked" : "Ready to build";
  const firstShortfall = shortages.find((c) => c.shortage > 0);
  const expectedReady = order && blocked ? orderExpectedReadyLabel(order) : null;
  return shell(`
    ${header("Order Readiness", "Automatic inventory result for this production order", button("Back to orders", "orders", "secondary"))}
    <section class="card pad status-panel">
      <div>
        <p class="mini-label">Order</p>
        <h2>${order ? order.id : "No order selected"}</h2>
        <p class="sub">${order ? `${order.model} - Quantity ${order.qty} - Required ${order.date}` : ""}</p>
      </div>
      <div>
        <p class="mini-label">Readiness status</p>
        <div class="status-word ${blocked ? "blocked-text" : "ready-text"}">${status}</div>
        <p class="sub">${
          blocked
            ? `Release is unavailable until the shortage is resolved.${expectedReady ? ` Expected by ${expectedReady}.` : ""}`
            : "All required components are available."
        }</p>
      </div>
      <div>${
        blocked
          ? `<button class="button" data-modal="create-purchase-request" data-rec-action="${order.id}::${firstShortfall?.itemId || ""}">Create purchase request</button>`
          : button("Release to production", "release-success")
      }</div>
    </section>
    <section class="card">
      <div class="panel-head"><div><h2>Component Availability</h2><p>Only components with shortages block the order release.</p></div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Component</th><th>Required quantity</th><th>Available quantity</th><th>Shortage quantity</th><th>Status</th></tr></thead>
          <tbody>${
            shortages.length
              ? shortages
                  .map(
                    (c) =>
                      `<tr class="${c.shortage > 0 ? "selected" : ""}"><td>${c.item?.name || c.itemId}</td><td>${c.required}</td><td>${c.available}</td><td>${c.shortage}</td><td>${badge(c.shortage > 0 ? "Blocked" : "Ready")}</td></tr>`
                  )
                  .join("")
              : `<tr><td colspan="5">No components recorded for this order.</td></tr>`
          }</tbody>
        </table>
      </div>
    </section>
    <section class="card pad" style="margin-top: 28px;">
      <h2>Recommended Action</h2>
      <p>${blocked ? `Create purchase request for ${firstShortfall.shortage} missing ${firstShortfall.item?.name || ""} units.` : `Release ${order ? order.id : "this order"} to production.`}</p>
    </section>
  `);
}

function inventoryPage() {
  const inventorySearch = state.inventorySearch.trim().toLowerCase();
  const items = inventory.filter((item) => {
    const statusMatch = state.stockFilter === "All" || inventoryStockStatus(item) === state.stockFilter;
    const searchMatch = !inventorySearch || item.name.toLowerCase().includes(inventorySearch);
    return statusMatch && searchMatch;
  });
  const componentItems = items.filter((item) => item.category === "Component");
  const selected = componentItems.find((i) => i.id === state.selectedInventoryId) || componentItems[0] || inventory.find((item) => item.category === "Component");
  const selectedRecommendation = recommendationForInventoryItem(selected);
  return shell(`
    ${header("Inventory", "Check available parts and stock levels for production planning")}
    <section class="two-col">
      <div class="left-stack">
        <article class="card">
          <div class="panel-head"><div><h2>Component Inventory</h2></div><span class="panel-meta">${componentItems.length} components</span></div>
          <div class="toolbar inventory-toolbar">
            ${toolbarField("Search", search("inventory-search", "Search by item name or part number", state.inventorySearch), true)}
            ${toolbarField("Stock status", dropdown("stockFilter", state.stockFilter, ["All", "In stock", "Low stock", "Out of stock"]))}
            <button class="button secondary" data-action="reset-inventory-filters">Reset filters</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Item name</th><th>Category</th><th>On hand</th><th>Minimum stock</th><th>Stock status</th></tr></thead>
              <tbody>${
                componentItems.length
                  ? componentItems.map((item) => `<tr class="${selected && item.id === selected.id ? "selected" : ""}" data-inventory="${item.id}"><td>${item.name}</td><td>${item.category}</td><td>${item.onHand}</td><td>${item.reorder}</td><td>${badge(inventoryStockStatus(item))}</td></tr>`).join("")
                  : `<tr><td colspan="5">No items match these filters.</td></tr>`
              }</tbody>
            </table>
          </div>
        </article>
      </div>
      <aside class="card side-panel">
        <h3>Item Detail</h3>
        <p class="sub">Selected item: ${selected.name}</p>
        <div class="divider"></div>
        ${
          selectedRecommendation
            ? `<p class="mini-label">Shortage summary</p>
              <p>${selectedRecommendation.shortage} units needed for ${selectedRecommendation.order}.</p>
              <div class="divider"></div>`
            : ""
        }
        <h3>Action</h3>
        <p>${selectedRecommendation ? "Create a purchase request for the current shortage." : "Create a purchase request if additional stock is needed."}</p>
        <button class="button full" data-modal="create-purchase-request" data-inventory-request="true">Create request</button>
        <div class="divider"></div>
        <h3>Related orders</h3>
        <p>${selected.related.join("<br />") || "No blocked orders currently linked."}</p>
        ${button("View related orders", "orders", "full")}
      </aside>
    </section>
  `);
}

function recommendationsPage() {
  const visibleRecommendations = availableRecommendations();
  const selected = selectedAvailableRecommendation();
  return shell(`
    ${header("Purchase Recommendations", "Items to purchase to unblock production orders")}
    <section class="two-col-wide">
      <article class="card">
        <div class="panel-head"><div><h2>Recommended Purchases</h2><p>Items that need purchasing to keep production moving</p></div><span class="panel-meta">${visibleRecommendations.length} recommendations</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Item name</th><th>Shortage</th><th>Priority</th><th>Affected order</th></tr></thead>
            <tbody>${visibleRecommendations.map((r) => `<tr class="${selected && r.id === selected.id ? "selected" : ""}" data-rec="${r.id}"><td>${r.item}</td><td>${r.shortage}</td><td>${badge(r.priority)}</td><td>${r.order}</td></tr>`).join("")}</tbody>
          </table>
          <div class="footer-row"><span>Rows per page: 25</span><span>${visibleRecommendations.length ? `1-${visibleRecommendations.length} of ${visibleRecommendations.length}` : "0 of 0"}</span></div>
        </div>
      </article>
      <aside class="card side-panel">
        <h3>Recommendation Detail</h3>
        ${
          selected
            ? `<p class="sub">Selected item: ${selected.item}</p>
              <div class="detail-list">
                <div class="full"><span>Item name</span><strong>${selected.item}</strong></div>
                <div><span>Affected order</span><strong>${selected.order}</strong></div>
                <div><span>Priority</span>${badge(selected.priority)}</div>
                <div><span>Required</span><strong>${selected.required}</strong></div>
                <div><span>Available</span><strong>${selected.available}</strong></div>
                <div><span>Shortage</span><strong>${selected.shortage}</strong></div>
              </div>
              <p class="mini-label">Suggested action</p>
              <p>Create purchase request for ${selected.shortage} missing units.</p>
              <button class="button full" data-modal="create-purchase-request" data-rec-action="${selected.id}">Create request</button>`
            : `<p class="sub">No recommendation selected</p>
              <p>All current recommendations already have purchase requests.</p>`
        }
      </aside>
    </section>
  `);
}

function createOrderPage() {
  const previewComponents = validCreateComponents(parsePositiveInt(state.createQty) || 1);
  const previewBlocked = orderShortages({ components: previewComponents }).some((c) => c.shortage > 0);
  const previewStatus = previewBlocked ? "Blocked" : "Ready to build";
  return shell(`
    ${header("Create Production Order", "Add a new internal production order and calculate readiness automatically")}
    <section class="two-col">
      <article class="card pad">
        <h2>Order details</h2>
        <div class="form-grid" style="margin-top: 28px;">
          ${createOrderFormFields()}
        </div>
        <div class="form-actions">${button("Create order", "order-created")} ${button("Cancel", "orders", "secondary")}</div>
      </article>
      <aside class="card side-panel">
        <h3>Order preview</h3>
        <p class="sub">Inventory availability is calculated immediately from the components you list.</p>
        <div class="detail-list"><div><span>Expected result</span>${badge(previewStatus)}</div><div><span>Next step</span><strong>${previewBlocked ? "Create purchase request" : "Release if needed"}</strong></div></div>
      </aside>
    </section>
  `);
}

function orderCreatedPage() {
  const order = state.createdOrders.find((o) => o.id === state.selectedOrderId) || state.createdOrders[state.createdOrders.length - 1];
  if (!order) return dashboard();
  return successPage("Order Created", "Production order created", `Inventory was checked automatically and ${order.id} is ready to release.`, [
    ["Order ID", order.id],
    ["Customer", orderCustomerName(order)],
    ["Readiness result", badge(computedOrderStatus(order))],
    ["Pump model", order.model],
    ["Ordered date", order.ordered],
    ["Required date", order.date],
  ], [
    ["View readiness result", "readiness", ""],
    ["View order list", "orders", "secondary"],
  ]);
}

function requestsPage() {
  const reopenedRequests = requestHistory
    .filter((r) => state.reopenedHistoryIds.includes(r.id))
    .map((r) => ({ ...r, status: "Pending", requestedOn: r.completed, supplier: "Not assigned" }));
  const openRequests = [...currentPurchaseRequests(), ...reopenedRequests];
  const activeRequests = openRequests.filter((r) => requestStatus(r) === "Pending");
  const partialRequests = openRequests.filter((r) => requestStatus(r) === "Partially received");
  const completedRequests = [
    ...currentPurchaseRequests()
      .filter((r) => ["Received", "Cancelled"].includes(requestStatus(r)))
      .map((r) => ({ ...r, status: requestStatus(r), completed: r.completed || "Today", notes: r.notes || "Moved from active requests." })),
    ...requestHistory.filter((r) => !state.reopenedHistoryIds.includes(r.id)),
  ];
  const selectedCompleted = completedRequests.find((r) => r.id === state.selectedCompletedRequestId);
  const selected = state.selectedCompletedRequestId
    ? null
    : activeRequests.find((r) => r.id === state.selectedRequestId) ||
      partialRequests.find((r) => r.id === state.selectedRequestId) ||
      activeRequests[0] ||
      partialRequests[0];
  return shell(`
    ${header("Purchase Requests", "Manage active purchase requests and review recent history")}
    <section class="two-col-wide">
      <div class="left-stack">
        <article class="card">
          <div class="panel-head">
            <div><h2>Active Purchase Requests</h2><p>Pending requests waiting for parts to arrive</p></div>
            <div class="panel-actions"><span class="panel-meta">${activeRequests.length} active</span><button class="button small" data-modal="create-purchase-request" data-manual-request="true">Create request</button></div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Request ID</th><th>Item</th><th>Related order</th><th>Qty</th><th>Priority</th><th>Expected</th></tr></thead>
              <tbody>${activeRequests.map((r) => `<tr class="${selected && r.id === selected.id ? "selected" : ""}" data-request="${r.id}"><td>${r.id}</td><td>${r.item}</td><td>${r.order}</td><td>${r.qty}</td><td>${badge(r.priority)}</td><td>${r.expectedDate ? formatDateLabel(r.expectedDate) : "Not set"}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </article>
        <article class="card">
          <div class="panel-head"><div><h2>Partially Received</h2><p>Requests with some parts received and a remaining quantity still open</p></div><span class="panel-meta">${partialRequests.length} partial</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Request ID</th><th>Item</th><th>Received</th><th>Remaining</th><th>Status</th><th>Expected</th></tr></thead>
              <tbody>${partialRequests.map((r) => `<tr class="${selected && r.id === selected.id ? "selected" : ""}" data-request="${r.id}"><td>${r.id}</td><td>${r.item}</td><td>${receivedQty(r)}</td><td>${remainingQty(r)}</td><td>${compactStatusBadge(requestStatus(r))}</td><td>${r.expectedDate ? formatDateLabel(r.expectedDate) : "Not set"}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </article>
        <article class="card">
          <div class="panel-head"><div><h2>Recently Completed</h2><p>Received or cancelled requests kept for reference</p></div><span class="panel-meta">${completedRequests.length} records</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Request ID</th><th>Item</th><th>Related order</th><th>Qty</th><th>Status</th><th>Completed</th></tr></thead>
              <tbody>${completedRequests.map((r) => `<tr class="${selectedCompleted && r.id === selectedCompleted.id ? "selected" : ""}" data-completed-request="${r.id}"><td>${r.id}</td><td>${r.item}</td><td>${r.order}</td><td>${r.qty}</td><td>${badge(r.status)}</td><td>${r.completed}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </article>
      </div>
      <aside class="card side-panel">
        <h3>Request Details</h3>
        ${
          selected
            ? `<p class="sub">${selected.id} · ${selected.item}</p>
              <div class="detail-list">
                <div><span>Ordered</span><strong>${orderedQty(selected)}</strong></div>
                <div><span>Received</span><strong>${receivedQty(selected)}</strong></div>
                <div><span>Remaining</span><strong>${remainingQty(selected)}</strong></div>
                <div><span>Status</span>${badge(requestStatus(selected))}</div>
                <div><span>Requested on</span><strong>${selected.requestedOn}</strong></div>
                <div><span>Expected</span><strong>${selected.expectedDate ? formatDateLabel(selected.expectedDate) : "Not set"}</strong></div>
                <div class="full"><span>Supplier</span><strong>${selected.supplier}</strong></div>
              </div>
              <p class="mini-label">Next step</p>
              <p>${requestStatus(selected) === "Partially received" ? "Mark the remaining quantity as received when the rest of the parts arrive." : "Mark parts as received when they arrive, or edit/cancel this request if details are wrong."}</p>
              <div class="form-actions"><button class="button secondary" data-modal="edit-request">Edit request</button><button class="button danger" data-modal="cancel-request">Cancel request</button></div>
              <div style="margin-top: 16px;"><button class="button full" data-modal="receive-inventory">Mark as received</button></div>`
            : selectedCompleted
              ? `<p class="sub">${selectedCompleted.id} · ${selectedCompleted.item}</p>
                <p class="mini-label">Update history</p>
                <div class="field"><label>Status</label>${dropdown("editCompletedStatus", state.editCompletedStatus || selectedCompleted.status, ["Received", "Cancelled", "Reopen request"])}</div>
                <div class="field side-note-field"><label>Notes</label><textarea data-history-note>${state.historyNoteDraft ?? selectedCompleted.notes ?? ""}</textarea></div>
                <div class="form-actions"><button class="button secondary" data-action="discard-history-edit">Discard</button><button class="button" data-action="save-history-edit">Save update</button></div>`
            : `<p class="sub">No active request selected</p>
              <p>Select a recently completed request to review or update its history.</p>`
        }
      </aside>
    </section>
  `);
}

function customersPage() {
  const customerSearch = state.customerSearch.trim().toLowerCase();
  const customerList = allCustomers().filter((customer) => !customerSearch || customer.name.toLowerCase().includes(customerSearch));
  const selected = customerList.find((customer) => customer.id === state.selectedCustomer) || customerList[0] || null;
  const selectedOrders = selected
    ? [...selected.orders].sort((a, b) => (a.status === "Finished" ? 1 : 0) - (b.status === "Finished" ? 1 : 0))
    : [];
  return shell(`
    ${header("Customers", "Review customer order history and context")}
    <section class="two-col-wide customers-layout">
      <article class="card">
        <div class="panel-head"><div><h2>Customer List</h2><p>Every customer on record</p></div><span class="panel-meta">${customerList.length} customers</span></div>
        <div class="toolbar">
          ${toolbarField("Search", search("customer-search", "Search by customer name", state.customerSearch), true)}
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Type</th><th>Active orders</th><th>Blocked</th></tr></thead>
            <tbody>${
              customerList.length
                ? customerList
                    .map((customer) => {
                      const summary = customerSummary(customer);
                      return `<tr class="${selected && customer.id === selected.id ? "selected" : ""}" data-customer="${customer.id}"><td>${customer.name}</td><td>${customer.customerType}</td><td>${summary.active}</td><td>${summary.blocked}</td></tr>`;
                    })
                    .join("")
                : `<tr><td colspan="4">No customers match this search.</td></tr>`
            }</tbody>
          </table>
        </div>
      </article>
      <aside class="card side-panel">
        <h3>Customer Detail</h3>
        ${
          selected
            ? `<p class="sub">Selected customer: ${selected.name}</p>
              <div class="detail-list">
                <div><span>Customer type</span><strong>${selected.customerType}</strong></div>
                <div><span>Active orders</span><strong>${customerSummary(selected).active}</strong></div>
                <div><span>Blocked</span><strong>${customerSummary(selected).blocked}</strong></div>
                <div><span>Finished orders</span><strong>${customerSummary(selected).finished}</strong></div>
                <div class="full"><span>Delivery context</span><strong>${customerUrgencyNotes[selected.customerType] || customerUrgencyNotes.Commercial}</strong></div>
              </div>
              <div class="divider"></div>
              <h3>Order history</h3>
              <div class="history-list">${selectedOrders
                .map((order) => {
                  const inner = `
                    <div class="history-row-head">
                      <strong>${order.id}</strong>
                      ${badge(order.status)}
                    </div>
                    <small>${order.model} · Qty ${order.qty}</small>
                    <div class="history-row-dates">
                      <div><span>Ordered</span><strong>${order.ordered || "Not set"}</strong></div>
                      <div><span>Required</span><strong>${order.date || "Not set"}</strong></div>
                    </div>`;
                  return order.status === "Finished"
                    ? `<div class="history-row">${inner}</div>`
                    : `<div class="history-row" data-row-route="orders" data-order="${order.id}">${inner}</div>`;
                })
                .join("")}</div>`
            : `<p class="sub">No customers found.</p>`
        }
      </aside>
    </section>
  `);
}

function requestStatus(request) {
  if (state.cancelledRequestIds.includes(request.id)) return "Cancelled";
  if (state.receivedRequestIds.includes(request.id)) return "Received";
  if ((state.partialReceipts[request.id] || 0) > 0) return "Partially received";
  return request.status;
}

function orderedQty(request) {
  return Number(request?.qty) || 0;
}

function receivedQty(request) {
  if (!request) return 0;
  if (requestStatus(request) === "Received") return orderedQty(request);
  return Math.min(state.partialReceipts[request.id] || 0, orderedQty(request));
}

function remainingQty(request) {
  return Math.max(orderedQty(request) - receivedQty(request), 0);
}

function releaseSuccessPage() {
  const orderId = state.selectedOrderId;
  releaseOrder(orderId);
  return successPage("Released to Production", "Order released to assembly", `${orderId} has been released to assembly and is now in production.`, [
    ["Order ID", orderId],
    ["Status", badge("In production")],
    ["Next team", "Assembly"],
  ], [
    ["View order list", "orders", ""],
    ["Go to dashboard", "dashboard", "secondary"],
  ]);
}

function noIssuesPage() {
  return shell(`
    ${header("No Issues", "Empty state example for a fully clear production queue")}
    <section class="card empty-state">
      <div>
        <h2>No blocked orders or inventory shortages</h2>
        <p>All checked production orders can be fulfilled with current inventory. New shortages will appear here when inventory drops below required levels.</p>
        <div class="form-actions" style="justify-content:center;">${button("Go to dashboard", "dashboard")}</div>
      </div>
    </section>
  `);
}

function successPage(title, heading, copy, facts, actions) {
  return shell(`
    ${header(title, copy)}
    <section class="success-layout">
      <article class="card success-card">
        <div class="success-icon">OK</div>
        <h2>${heading}</h2>
        <p>${copy}</p>
        <div class="summary-strip">${facts.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}</div>
        <div class="form-actions" style="justify-content:center;">${actions.map(([label, route, variant]) => button(label, route, variant)).join("")}</div>
      </article>
    </section>
  `);
}

function modalLayer() {
  if (!state.activeModal) return "";
  const selected =
    findPurchaseRequest(state.selectedRequestId) ||
    requests[0];

  let content = "";
  if (state.activeModal === "create-production-order") {
    content = `
        <div class="modal-card wide-modal">
          <div class="modal-head">
            <div>
              <h2>Create production order</h2>
              <p>Create one production order for one pump model. Use the same customer name for related models.</p>
            </div>
            <button class="modal-close" data-close-modal aria-label="Close modal">x</button>
          </div>
          <div class="modal-grid">
            ${createOrderFormFields()}
          </div>
          <div class="modal-actions">
            <button class="button secondary" data-close-modal>Cancel</button>
            <button class="button" data-confirm-create-order>Create order</button>
          </div>
        </div>
      `;
  } else if (state.activeModal === "create-purchase-request") {
    const recs = allRecommendations();
    const rec = selectedAvailableRecommendation() || recs.find((r) => r.id === state.selectedRecommendationId) || recs[0] || { id: null, itemId: null, item: "", order: "Not linked", shortage: "", priority: "Medium" };
    const inventoryItem = selectedInventoryItem();
    const inventoryRecommendation = inventoryItem ? recommendationForInventoryItem(inventoryItem) : null;
    const isManualRequest = state.createRequestMode === "manual";
    const isInventoryRequest = state.createRequestMode === "inventory";
    const savedPriority = state.priority === "Select priority" ? "" : state.priority;
    const currentPriority = isManualRequest ? state.priority || "Select priority" : isInventoryRequest ? savedPriority || inventoryRecommendation?.priority || "Low" : savedPriority || rec.priority;
    const currentSupplier = isManualRequest ? state.supplier || "Select supplier" : state.supplier === "Select supplier" ? "Preferred supplier" : state.supplier || "Preferred supplier";
    const supplierOptions = isManualRequest ? ["Select supplier", "Preferred supplier", "Alternate supplier"] : ["Preferred supplier", "Alternate supplier", "Not assigned"];
    const priorityOptions = isManualRequest ? ["Select priority", "High", "Medium", "Low"] : ["High", "Medium", "Low"];
    const itemValue = isManualRequest ? "" : isInventoryRequest ? inventoryItem?.name || "" : rec.item;
    const qtyValue = isManualRequest ? "" : isInventoryRequest ? inventoryRecommendation?.shortage || "" : rec.shortage;
    const requestNote = `Please confirm availability and earliest delivery date for ${rec.shortage} ${rec.item} units.`;
    const inventoryNote = inventoryRecommendation
      ? `Please confirm availability and earliest delivery date for ${inventoryRecommendation.shortage} ${inventoryItem.name} units.`
      : `Request additional ${inventoryItem?.name || "inventory item"} for stock replenishment.`;
    const noteValue = isManualRequest ? "" : isInventoryRequest ? inventoryNote : requestNote;
    const expectedDateValue = addDaysIso(appTodayIso, 7);
    content = `
        <div class="modal-card wide-modal">
          <div class="modal-head">
            <div>
              <h2>Create purchase request</h2>
              <p>Request the missing parts needed to unblock the selected production order.</p>
            </div>
            <button class="modal-close" data-close-modal aria-label="Close modal">x</button>
          </div>
          <div class="modal-grid create-request-grid">
            ${state.createRequestError ? `<div class="field-error">${state.createRequestError}</div>` : ""}
            <div class="field wide"><label>Item name</label><input data-create-request-field="item" value="${itemValue}" placeholder="Enter item name" /></div>
            <div class="field"><label>Quantity to order</label><input data-create-request-field="qty" value="${qtyValue}" placeholder="Enter quantity" /></div>
            <div class="field"><label>Supplier</label>${dropdown("supplier", currentSupplier, supplierOptions)}</div>
            <div class="field"><label>Priority</label>${dropdown("priority", currentPriority, priorityOptions)}</div>
            <div class="field"><label>Expected delivery date</label><input type="date" data-create-request-field="expectedDate" value="${expectedDateValue}" /></div>
            <div class="field wide"><label>Supplier note or comments</label><textarea data-create-request-field="note" placeholder="Add supplier notes, delivery requirements, or approval context.">${noteValue}</textarea></div>
          </div>
          <div class="modal-actions">
            <button class="button secondary" data-close-modal>Cancel</button>
            <button class="button" data-confirm-create-request>Create request</button>
          </div>
        </div>
      `;
  } else if (state.activeModal === "purchase-request-success") {
    content = `
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <h2>Purchase request created</h2>
              <p>The request has been added to the active purchase request queue.</p>
            </div>
            <button class="modal-close" data-close-modal aria-label="Close modal">x</button>
          </div>
          <div class="modal-body">
            <p>You can review it in Requests, or stay on this screen and continue checking other recommendations.</p>
          </div>
          <div class="modal-actions">
            <button class="button secondary" data-close-modal>Close</button>
            <button class="button" data-route="requests">View requests</button>
          </div>
        </div>
      `;
  } else if (state.activeModal === "edit-request" && selected) {
    const draft = state.editDraft || selected;
    content = `
        <div class="modal-card wide-modal">
          <div class="modal-head">
            <div>
              <h2>Edit purchase request</h2>
              <p>Correct request details before parts are received.</p>
            </div>
            <button class="modal-close" data-close-modal aria-label="Close modal">x</button>
          </div>
          <div class="modal-grid">
            <div class="field wide"><label>Item name</label><input data-edit-field="item" value="${draft.item}" /></div>
            <div class="field"><label>Quantity to order</label><input data-edit-field="qty" value="${draft.qty}" /></div>
            <div class="field"><label>Related production order</label><input data-edit-field="order" value="${draft.order}" /></div>
            <div class="field"><label>Priority</label>${dropdown("editPriority", state.editPriority || draft.priority, ["High", "Medium", "Low"])}</div>
            <div class="field"><label>Supplier</label>${dropdown("editSupplier", state.editSupplier || draft.supplier || "Not assigned", ["Preferred supplier", "Alternate supplier", "Not assigned"])}</div>
            <div class="field"><label>Expected delivery date</label><input type="date" data-edit-field="expectedDate" value="${draft.expectedDate || ""}" /></div>
            <div class="field wide"><label>Supplier note</label><textarea data-edit-field="note">${draft.note || "Confirm lead time before submitting."}</textarea></div>
          </div>
          <div class="modal-actions">
            <button class="button secondary" data-close-modal>Discard changes</button>
            <button class="button" data-save-modal>Save changes</button>
          </div>
        </div>
      `;
  } else if (state.activeModal === "receive-inventory" && selected) {
    const remaining = remainingQty(selected);
    content = `
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <h2>Mark parts as received</h2>
              <p>Record how many parts arrived now. A partial receipt stays open until the remaining quantity is received.</p>
            </div>
            <button class="modal-close" data-close-modal aria-label="Close modal">x</button>
          </div>
          <div class="modal-grid">
            <div class="field"><label>Purchase request</label><input value="${selected.id}" /></div>
            <div class="field"><label>Quantity received now</label><input data-receive-field="qty" value="${state.receiptDraft ?? remaining}" /></div>
            <div class="field"><label>Remaining before receipt</label><input value="${remaining}" /></div>
            <div class="field wide"><label>Item</label><input value="${selected.item}" /></div>
            <div class="field wide"><label>Receipt note</label><textarea>Receive up to ${remaining} units for ${selected.order}.</textarea></div>
          </div>
          <div class="modal-actions">
            <button class="button secondary" data-close-modal>Cancel</button>
            <button class="button" data-confirm-receive>Mark as received</button>
          </div>
        </div>
      `;
  } else if (selected) {
    content = `
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <h2>Cancel purchase request?</h2>
              <p>This will close the request and keep the related production order blocked until another request is created or inventory is received.</p>
            </div>
            <button class="modal-close" data-close-modal aria-label="Close modal">x</button>
          </div>
          <div class="summary-strip modal-summary">
            <div><span>Request</span><strong>${selected.id}</strong></div>
            <div><span>Item</span><strong>${selected.item}</strong></div>
            <div><span>Quantity</span><strong>${selected.qty}</strong></div>
          </div>
          <div class="modal-actions">
            <button class="button secondary" data-close-modal>Keep request</button>
            <button class="button danger" data-confirm-cancel>Cancel request</button>
          </div>
        </div>
      `;
  }
  if (!content) return "";

  return `<div class="modal-backdrop" role="dialog" aria-modal="true">${content}</div>`;
}

function render() {
  const route = state.route;
  const routes = {
    dashboard,
    orders: ordersPage,
    inventory: inventoryPage,
    recommendations: recommendationsPage,
    "create-order": createOrderPage,
    "order-created": orderCreatedPage,
    readiness: readinessPage,
    requests: requestsPage,
    customers: customersPage,
    "release-success": releaseSuccessPage,
    "no-issues": noIssuesPage,
  };
  app.innerHTML = (routes[route] || dashboard)();
}

function routeTo(route) {
  state.route = route || "dashboard";
  window.location.hash = state.route;
  render();
  window.scrollTo(0, 0);
}

function readCreateOrderFormInputs() {
  const orderId = document.querySelector("[data-create-field='orderId']");
  const newCustomerName = document.querySelector("[data-create-field='newCustomerName']");
  const qty = document.querySelector("[data-create-field='qty']");
  const orderedDate = document.querySelector("[data-create-field='orderedDate']");
  const date = document.querySelector("[data-create-field='date']");
  const notes = document.querySelector("[data-create-field='notes']");
  state.createOrderId = orderId?.value.trim() || "";
  if (newCustomerName) state.createNewCustomerName = newCustomerName.value.trim();
  state.createQty = qty?.value.trim() || "";
  state.createOrderedDate = orderedDate?.value.trim() || "";
  state.createDate = date?.value.trim() || "";
  state.createNotes = notes?.value.trim() || "";
}

document.addEventListener("click", (event) => {
  const option = event.target.closest("[data-dropdown-option]");
  if (option) {
    const key = option.dataset.dropdownOption;
    state[key] = option.dataset.value;
    render();
    return;
  }

  const trigger = event.target.closest(".dropdown-trigger");
  if (trigger) {
    const dropdownEl = trigger.closest(".dropdown");
    document.querySelectorAll(".dropdown.open").forEach((node) => {
      if (node !== dropdownEl) node.classList.remove("open");
    });
    dropdownEl.classList.toggle("open");
    return;
  }

  if (!event.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown.open").forEach((node) => node.classList.remove("open"));
  }

  const modalTrigger = event.target.closest("[data-modal]");
  if (modalTrigger) {
    if (modalTrigger.dataset.recAction) state.selectedRecommendationId = modalTrigger.dataset.recAction;
    state.activeModal = modalTrigger.dataset.modal;
    state.createRequestMode = modalTrigger.dataset.manualRequest ? "manual" : modalTrigger.dataset.inventoryRequest ? "inventory" : "recommendation";
    if (state.activeModal === "create-production-order") {
      resetCreateOrderForm();
    }
    if (state.activeModal === "create-purchase-request") {
      state.createRequestError = "";
    }
    const selectedRequest = findPurchaseRequest(state.selectedRequestId);
    const recs = allRecommendations();
    const selectedRecommendation = selectedAvailableRecommendation() || recs.find((r) => r.id === state.selectedRecommendationId) || recs[0];
    if (state.activeModal === "create-purchase-request" && state.createRequestMode === "manual") {
      state.priority = "Select priority";
      state.supplier = "Select supplier";
    } else if (state.activeModal === "create-purchase-request" && state.createRequestMode === "inventory") {
      const inventoryRecommendation = recommendationForInventoryItem(selectedInventoryItem());
      state.priority = inventoryRecommendation?.priority || "Low";
      state.supplier = !state.supplier || state.supplier === "Select supplier" ? "Preferred supplier" : state.supplier;
    } else if (state.activeModal === "create-purchase-request" && selectedRecommendation) {
      state.selectedRecommendationId = selectedRecommendation.id;
      state.priority = selectedRecommendation.priority;
      state.supplier = !state.supplier || state.supplier === "Select supplier" ? "Preferred supplier" : state.supplier;
    }
    if (state.activeModal === "edit-request" && selectedRequest) {
      state.editPriority = selectedRequest.priority;
      state.editSupplier = selectedRequest.supplier || "Not assigned";
      state.editDraft = { ...selectedRequest };
    }
    if (state.activeModal === "receive-inventory" && selectedRequest) {
      state.receiptDraft = String(remainingQty(selectedRequest));
    }
    render();
    return;
  }

  const closeModal = event.target.closest("[data-close-modal]");
  if (closeModal || event.target.classList.contains("modal-backdrop")) {
    state.activeModal = null;
    state.editDraft = null;
    state.receiptDraft = null;
    state.createRequestMode = "recommendation";
    state.createRequestError = "";
    render();
    return;
  }

  const confirmCreateRequest = event.target.closest("[data-confirm-create-request]");
  if (confirmCreateRequest) {
    const isManualRequest = state.createRequestMode === "manual";
    const isInventoryRequest = state.createRequestMode === "inventory";
    const inventoryItem = selectedInventoryItem();
    const inventoryRecommendation = inventoryItem ? recommendationForInventoryItem(inventoryItem) : null;
    const recs = allRecommendations();
    const rec = selectedAvailableRecommendation() || recs.find((r) => r.id === state.selectedRecommendationId) || recs[0] || { id: null, itemId: null, item: "", order: "Not linked", shortage: "", priority: "Medium" };
    const itemField = document.querySelector("[data-create-request-field='item']");
    const qtyField = document.querySelector("[data-create-request-field='qty']");
    const noteField = document.querySelector("[data-create-request-field='note']");
    const expectedDateField = document.querySelector("[data-create-request-field='expectedDate']");
    const manualItem = itemField?.value.trim() || "Manual purchase item";
    const manualQty = parsePositiveInt(qtyField?.value);
    const selectedPriority = state.priority === "Select priority" ? "Medium" : state.priority;
    const selectedSupplier = state.supplier === "Select supplier" ? "Not assigned" : state.supplier;
    if ((isManualRequest || isInventoryRequest) && !manualQty) {
      state.createRequestError = "Enter a quantity greater than 0.";
      render();
      return;
    }
    state.createRequestError = "";
    const manualMatchedItem = isManualRequest ? inventory.find((item) => item.name.toLowerCase() === manualItem.toLowerCase()) : null;
    const requestId = nextPurchaseRequestId();
    state.createdRequests.unshift({
      id: requestId,
      item: isManualRequest || isInventoryRequest ? manualItem : rec.item,
      itemId: isManualRequest ? manualMatchedItem?.id || null : isInventoryRequest ? inventoryRecommendation?.itemId || inventoryItem?.id || null : rec.itemId,
      order: isManualRequest ? "Not linked" : isInventoryRequest ? inventoryRecommendation?.order || "Not linked" : rec.order,
      qty: isManualRequest || isInventoryRequest ? manualQty : rec.shortage,
      priority: isManualRequest || isInventoryRequest ? selectedPriority : state.priority || rec.priority,
      status: "Pending",
      supplier: isManualRequest || isInventoryRequest ? selectedSupplier : state.supplier,
      requestedOn: "Today",
      expectedDate: expectedDateField?.value || "",
      notes: noteField?.value.trim() || "",
    });
    state.nextRequestSeq += 1;
    state.selectedRequestId = requestId;
    state.selectedCompletedRequestId = null;
    state.createRequestMode = "recommendation";
    state.activeModal = "purchase-request-success";
    render();
    return;
  }

  const confirmCreateOrder = event.target.closest("[data-confirm-create-order]");
  if (confirmCreateOrder) {
    readCreateOrderFormInputs();
    const created = tryCreateOrder();
    if (!created) {
      render();
      return;
    }
    state.statusFilter = "All";
    state.pumpFilter = "All";
    state.activeModal = null;
    render();
    return;
  }

  const saveModal = event.target.closest("[data-save-modal]");
  if (saveModal) {
    const selectedRequest = findPurchaseRequest(state.selectedRequestId);
    if (selectedRequest) {
      const draft = state.editDraft || {};
      selectedRequest.item = draft.item?.trim() || selectedRequest.item;
      selectedRequest.qty = draft.qty?.trim() || selectedRequest.qty;
      selectedRequest.order = draft.order?.trim() || selectedRequest.order;
      selectedRequest.priority = state.editPriority || selectedRequest.priority;
      selectedRequest.supplier = state.editSupplier || selectedRequest.supplier;
      selectedRequest.expectedDate = draft.expectedDate || selectedRequest.expectedDate;
      selectedRequest.note = draft.note?.trim() || selectedRequest.note;
      const currentPartial = state.partialReceipts[selectedRequest.id] || 0;
      if (currentPartial >= orderedQty(selectedRequest)) delete state.partialReceipts[selectedRequest.id];
    }
    state.activeModal = null;
    state.editDraft = null;
    render();
    return;
  }

  const confirmReceive = event.target.closest("[data-confirm-receive]");
  if (confirmReceive) {
    const selectedRequest = findPurchaseRequest(state.selectedRequestId);
    if (selectedRequest) {
      const alreadyReceived = receivedQty(selectedRequest);
      const amountReceived = Math.max(0, Number(state.receiptDraft ?? remainingQty(selectedRequest)) || 0);
      const totalReceived = Math.min(alreadyReceived + amountReceived, orderedQty(selectedRequest));
      const appliedToInventory = totalReceived - alreadyReceived;
      state.cancelledRequestIds = state.cancelledRequestIds.filter((requestId) => requestId !== selectedRequest.id);
      state.receivedRequestIds = state.receivedRequestIds.filter((requestId) => requestId !== selectedRequest.id);
      if (appliedToInventory > 0) {
        const inventoryItem = selectedRequest.itemId ? inventoryItemById(selectedRequest.itemId) : null;
        if (inventoryItem) inventoryItem.onHand += appliedToInventory;
      }
      if (amountReceived > 0 && totalReceived >= orderedQty(selectedRequest)) {
        delete state.partialReceipts[selectedRequest.id];
        state.reopenedHistoryIds = state.reopenedHistoryIds.filter((requestId) => requestId !== selectedRequest.id);
        selectedRequest.status = "Received";
        selectedRequest.completed = "Today";
        selectedRequest.notes = selectedRequest.notes || "Received from request details.";
        state.receivedRequestIds.push(selectedRequest.id);
        state.selectedCompletedRequestId = selectedRequest.id;
        state.historyNoteDraft = selectedRequest.notes;
      } else if (amountReceived > 0) {
        state.partialReceipts[selectedRequest.id] = totalReceived;
        selectedRequest.status = "Pending";
        state.selectedRequestId = selectedRequest.id;
        state.selectedCompletedRequestId = null;
        state.historyNoteDraft = null;
      }
    }
    state.activeModal = null;
    state.receiptDraft = null;
    render();
    return;
  }

  const confirmCancel = event.target.closest("[data-confirm-cancel]");
  if (confirmCancel) {
    const selectedRequest = findPurchaseRequest(state.selectedRequestId);
    if (selectedRequest) state.receivedRequestIds = state.receivedRequestIds.filter((requestId) => requestId !== selectedRequest.id);
    if (selectedRequest && !state.cancelledRequestIds.includes(selectedRequest.id)) state.cancelledRequestIds.push(selectedRequest.id);
    if (selectedRequest) {
      delete state.partialReceipts[selectedRequest.id];
      state.reopenedHistoryIds = state.reopenedHistoryIds.filter((requestId) => requestId !== selectedRequest.id);
      selectedRequest.status = "Cancelled";
      selectedRequest.completed = "Today";
      selectedRequest.notes = selectedRequest.notes || "Cancelled from request details.";
    }
    state.selectedCompletedRequestId = selectedRequest?.id || null;
    state.historyNoteDraft = selectedRequest?.notes || "";
    state.activeModal = null;
    render();
    return;
  }

  const inventoryRow = event.target.closest("[data-inventory]");
  if (inventoryRow) {
    state.selectedInventoryId = inventoryRow.dataset.inventory;
    render();
    return;
  }

  const recRow = event.target.closest("[data-rec]");
  if (recRow) {
    state.selectedRecommendationId = recRow.dataset.rec;
    render();
    return;
  }

  const dashboardOrderRow = event.target.closest("[data-dashboard-order]");
  if (dashboardOrderRow) {
    state.selectedDashboardOrderId = dashboardOrderRow.dataset.dashboardOrder;
    render();
    return;
  }

  const orderSelectRow = event.target.closest("[data-order-select]");
  if (orderSelectRow && !event.target.closest("[data-route]")) {
    state.selectedOrderId = orderSelectRow.dataset.orderSelect;
    render();
    return;
  }

  const orderStatusAction = event.target.closest("[data-order-status]");
  if (orderStatusAction) {
    const orderId = orderStatusAction.dataset.order;
    state.selectedOrderId = orderId;
    if (orderStatusAction.dataset.orderStatus === "In production") {
      releaseOrder(orderId);
    } else if (orderStatusAction.dataset.orderStatus === "Finished") {
      if (!state.finishedOrderIds.includes(orderId)) state.finishedOrderIds.push(orderId);
    }
    render();
    return;
  }

  const returnToQueue = event.target.closest("[data-return-to-queue]");
  if (returnToQueue) {
    const orderId = returnToQueue.dataset.order;
    state.selectedOrderId = orderId;
    returnOrderToQueue(orderId);
    render();
    return;
  }

  const requestRow = event.target.closest("[data-request]");
  if (requestRow) {
    state.selectedRequestId = requestRow.dataset.request;
    state.selectedCompletedRequestId = null;
    state.historyNoteDraft = null;
    render();
    return;
  }

  const completedRequestRow = event.target.closest("[data-completed-request]");
  if (completedRequestRow) {
    state.selectedCompletedRequestId = completedRequestRow.dataset.completedRequest;
    const completed = findPurchaseRequest(state.selectedCompletedRequestId);
    state.editCompletedStatus = completed ? requestStatus(completed) : "Received";
    state.historyNoteDraft = completed?.notes || "";
    render();
    return;
  }

  const customerRow = event.target.closest("[data-customer]");
  if (customerRow) {
    state.selectedCustomer = customerRow.dataset.customer;
    render();
    return;
  }

  const orderRow = event.target.closest("[data-row-route]");
  if (orderRow) {
    state.selectedOrderId = orderRow.dataset.order;
    routeTo(orderRow.dataset.rowRoute);
    return;
  }

  const routeEl = event.target.closest("[data-route]");
  if (routeEl) {
    event.preventDefault();
    state.activeModal = null;
    if (routeEl.dataset.route === "order-created") {
      readCreateOrderFormInputs();
      const created = tryCreateOrder();
      if (!created) {
        render();
        return;
      }
    }
    if (routeEl.dataset.order) state.selectedOrderId = routeEl.dataset.order;
    if (routeEl.dataset.statusFilter) {
      state.statusFilter = routeEl.dataset.statusFilter;
      state.pumpFilter = "All";
      state.orderSearch = "";
    }
    routeTo(routeEl.dataset.route);
    return;
  }

  const resetOrders = event.target.closest("[data-action='reset-order-filters']");
  if (resetOrders) {
    state.statusFilter = "All";
    state.pumpFilter = "All";
    state.orderSearch = "";
    render();
    return;
  }

  const resetInventory = event.target.closest("[data-action='reset-inventory-filters']");
  if (resetInventory) {
    state.stockFilter = "All";
    state.inventorySearch = "";
    render();
    return;
  }

  const saveHistoryEdit = event.target.closest("[data-action='save-history-edit']");
  if (saveHistoryEdit) {
    const id = state.selectedCompletedRequestId;
    const note = state.historyNoteDraft?.trim() || "";
    const status = state.editCompletedStatus || "Received";
    const activeRequest = currentPurchaseRequests().find((r) => r.id === id);
    const historyRequest = requestHistory.find((r) => r.id === id);
    const targetRequest = activeRequest || historyRequest;
    if (status === "Reopen request") {
      state.receivedRequestIds = state.receivedRequestIds.filter((requestId) => requestId !== id);
      state.cancelledRequestIds = state.cancelledRequestIds.filter((requestId) => requestId !== id);
      delete state.partialReceipts[id];
      if (activeRequest) {
        activeRequest.status = "Pending";
        activeRequest.notes = note || activeRequest.notes;
      }
      if (historyRequest) {
        historyRequest.status = "Pending";
        historyRequest.notes = note || historyRequest.notes;
        if (!state.reopenedHistoryIds.includes(id)) state.reopenedHistoryIds.push(id);
      }
      state.selectedRequestId = id;
      state.selectedCompletedRequestId = null;
      state.editCompletedStatus = null;
      state.historyNoteDraft = null;
      render();
      return;
    }
    const wasReceived = targetRequest ? requestStatus(targetRequest) === "Received" : false;
    if (status === "Received" && targetRequest && !wasReceived) {
      const outstanding = orderedQty(targetRequest) - receivedQty(targetRequest);
      if (outstanding > 0 && targetRequest.itemId) {
        const inventoryItem = inventoryItemById(targetRequest.itemId);
        if (inventoryItem) inventoryItem.onHand += outstanding;
      }
    }
    if (activeRequest) {
      activeRequest.notes = note;
      activeRequest.completed = activeRequest.completed || "Today";
      state.receivedRequestIds = state.receivedRequestIds.filter((requestId) => requestId !== id);
      state.cancelledRequestIds = state.cancelledRequestIds.filter((requestId) => requestId !== id);
      delete state.partialReceipts[id];
      if (status === "Received") state.receivedRequestIds.push(id);
      if (status === "Cancelled") state.cancelledRequestIds.push(id);
    }
    if (historyRequest) {
      delete state.partialReceipts[id];
      historyRequest.status = status;
      historyRequest.notes = note;
    }
    render();
    return;
  }

  const discardHistoryEdit = event.target.closest("[data-action='discard-history-edit']");
  if (discardHistoryEdit) {
    const completed = findPurchaseRequest(state.selectedCompletedRequestId);
    state.editCompletedStatus = completed ? requestStatus(completed) : "Received";
    state.historyNoteDraft = completed?.notes || "";
    render();
  }
});

function reactiveSearchInput(id, apply) {
  const el = document.getElementById(id);
  if (!el) return false;
  const cursor = el.selectionStart;
  apply();
  render();
  const next = document.getElementById(id);
  if (next) {
    next.focus();
    next.setSelectionRange(cursor, cursor);
  }
  return true;
}

document.addEventListener("input", (event) => {
  if (event.target.id === "order-search") {
    reactiveSearchInput("order-search", () => {
      state.orderSearch = event.target.value;
    });
    return;
  }

  if (event.target.id === "inventory-search") {
    reactiveSearchInput("inventory-search", () => {
      state.inventorySearch = event.target.value;
    });
    return;
  }

  if (event.target.id === "customer-search") {
    reactiveSearchInput("customer-search", () => {
      state.customerSearch = event.target.value;
    });
    return;
  }

  const createField = event.target.closest("[data-create-field]");
  if (createField) {
    if (createField.dataset.createField === "orderId") state.createOrderId = createField.value;
    if (createField.dataset.createField === "newCustomerName") state.createNewCustomerName = createField.value;
    if (createField.dataset.createField === "qty") state.createQty = createField.value;
    if (createField.dataset.createField === "orderedDate") state.createOrderedDate = createField.value;
    if (createField.dataset.createField === "date") state.createDate = createField.value;
    if (createField.dataset.createField === "notes") state.createNotes = createField.value;
    return;
  }

  const editField = event.target.closest("[data-edit-field]");
  if (editField) {
    state.editDraft = state.editDraft || {};
    state.editDraft[editField.dataset.editField] = editField.value;
    return;
  }

  const receiveField = event.target.closest("[data-receive-field]");
  if (receiveField) {
    state.receiptDraft = receiveField.value;
    return;
  }

  const historyNote = event.target.closest("[data-history-note]");
  if (historyNote) {
    state.historyNoteDraft = historyNote.value;
  }
});

window.addEventListener("hashchange", () => {
  const route = window.location.hash.replace("#", "");
  state.route = route || "dashboard";
  render();
});

// Seed orders that start mid-production are normalized into the same state the
// release action uses, so there is one code path. Their components are treated as
// already consumed, so seeded on-hand figures are the post-release position.
orders.forEach((order) => {
  if (order.stage === "released" && !state.releasedOrderIds.includes(order.id)) {
    state.releasedOrderIds.push(order.id);
  }
  if (order.stage === "finished" && !state.finishedOrderIds.includes(order.id)) {
    state.finishedOrderIds.push(order.id);
  }
});

state.route = window.location.hash.replace("#", "") || "dashboard";
render();
