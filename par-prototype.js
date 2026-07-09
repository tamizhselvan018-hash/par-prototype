const state = {
  route: "dashboard",
  selectedOrderId: "PO-1048",
  selectedDashboardOrderId: "PO-1069",
  selectedInventoryId: "seal-kit",
  selectedRecommendationId: "seal-kit",
  selectedRequestId: "PR-2048",
  selectedCompletedRequestId: null,
  statusFilter: "All",
  pumpFilter: "All",
  stockFilter: "All",
  readinessResolved: false,
  releasedOrderId: null,
  orderStatusOverrides: {},
  orderCreated: false,
  purchaseCreated: false,
  requestReceived: false,
  requestCancelled: false,
  receivedRequestIds: [],
  cancelledRequestIds: [],
  partialReceipts: {
    "PR-2057": 10,
    "PR-2063": 5,
  },
  createdRequests: [],
  createdRequestId: null,
  createOrderId: "",
  createCustomer: "",
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

const orders = [
  { id: "PO-1048", customer: "Northfield Waterworks", model: "Pump A-12", qty: 12, ordered: "Jun 8, 2026", date: "Jun 12, 2026", status: "Blocked", blocking: "Seal Kit SK-08", notes: "Priority replacement order for site maintenance." },
  { id: "PO-1051", customer: "Delta Farms", model: "Pump B-20", qty: 6, ordered: "Jun 9, 2026", date: "Jun 14, 2026", status: "In production", blocking: "", notes: "Standard irrigation pump batch." },
  { id: "PO-1057", customer: "City Utilities", model: "Pump C-05", qty: 18, ordered: "Jun 10, 2026", date: "Jun 18, 2026", status: "In production", blocking: "", notes: "Split delivery acceptable if assembly runs late." },
  { id: "PO-1062", customer: "Riverbend Co-op", model: "Pump A-12", qty: 8, ordered: "Jun 12, 2026", date: "Jun 21, 2026", status: "Ready", blocking: "", notes: "Hold finished units for customer pickup." },
  { id: "PO-1064", customer: "Oakridge Processing", model: "Pump D-10", qty: 4, ordered: "Jun 13, 2026", date: "Jun 24, 2026", status: "Ready", blocking: "", notes: "Use standard packaging." },
  { id: "PO-1069", customer: "Harbor Supply", model: "Pump D-10", qty: 5, ordered: "Jun 14, 2026", date: "Jun 25, 2026", status: "In production", blocking: "", notes: "Confirm final inspection before dispatch." },
  { id: "PO-1068", customer: "Mesa Agri Systems", model: "Pump B-20", qty: 10, ordered: "Jun 15, 2026", date: "Jun 28, 2026", status: "Blocked", blocking: "Bearing BR-02", notes: "Waiting for bearing stock before release." },
];

const completedOrders = [
  { id: "PO-1036", model: "Pump A-12", qty: 10, completed: "Jun 7, 2026", status: "Finished" },
  { id: "PO-1032", model: "Pump B-20", qty: 4, completed: "Jun 6, 2026", status: "Finished" },
  { id: "PO-1028", model: "Pump D-10", qty: 6, completed: "Jun 4, 2026", status: "Finished" },
];

const inventory = [
  { id: "seal-kit", name: "Seal Kit SK-08", category: "Component", onHand: 4, updatedOnHand: 12, reorder: 20, status: "Low stock", related: ["PO-1048 needs 12 units", "PO-1057 may need 18 units"] },
  { id: "bearing", name: "Bearing BR-02", category: "Component", onHand: 0, updatedOnHand: 0, reorder: 12, status: "Out of stock", related: ["PO-1068 and PO-1092 need this item before release."] },
  { id: "impeller", name: "Impeller 4in", category: "Component", onHand: 9, updatedOnHand: 9, reorder: 30, status: "Low stock", related: ["PO-1057 may need 18 units"] },
  { id: "motor", name: "Motor Housing", category: "Component", onHand: 14, updatedOnHand: 14, reorder: 10, status: "In stock", related: ["PO-1051 needs 6 units"] },
  { id: "fastener", name: "Fastener Set FS-20", category: "Component", onHand: 30, updatedOnHand: 30, reorder: 25, status: "In stock", related: [] },
  { id: "shaft", name: "Shaft Assembly", category: "Component", onHand: 16, updatedOnHand: 16, reorder: 10, status: "In stock", related: ["PO-1062 needs 8 units"] },
  { id: "mechanical-seal", name: "Mechanical Seal", category: "Component", onHand: 6, updatedOnHand: 6, reorder: 14, status: "Low stock", related: ["PO-1068 may need 10 units"] },
  { id: "o-ring", name: "O-Ring Set", category: "Component", onHand: 0, updatedOnHand: 0, reorder: 18, status: "Out of stock", related: ["PO-1074 cannot start until this item is received."] },
  { id: "casing", name: "Pump Casing", category: "Component", onHand: 11, updatedOnHand: 11, reorder: 8, status: "In stock", related: [] },
  { id: "coupling", name: "Coupling Set", category: "Component", onHand: 7, updatedOnHand: 7, reorder: 6, status: "In stock", related: ["PO-1069 needs 5 units"] },
  { id: "pump-cp", name: "Pump CP-100", category: "Finished good", onHand: 18, updatedOnHand: 18, reorder: 8, status: "In stock", related: [] },
];

const recommendations = [
  { id: "seal-kit", item: "Seal Kit SK-08", order: "PO-1048", required: 12, available: 4, shortage: 8, priority: "High", action: "Buy 8 units" },
  { id: "bearing", item: "Bearing BR-02", order: "PO-1068", required: 10, available: 0, shortage: 10, priority: "High", action: "Buy 10 units" },
  { id: "impeller", item: "Impeller 4in", order: "PO-1057", required: 27, available: 9, shortage: 18, priority: "Medium", action: "Buy 18 units" },
  { id: "motor", item: "Motor Housing", order: "PO-1051", required: 20, available: 14, shortage: 6, priority: "Medium", action: "Buy 6 units" },
  { id: "gasket", item: "Gasket G-14", order: "PO-1072", required: 8, available: 3, shortage: 5, priority: "Low", action: "Review supplier" },
  { id: "o-ring", item: "O-Ring Set", order: "PO-1074", required: 18, available: 0, shortage: 18, priority: "Medium", action: "Buy 18 units" },
];

const requests = [
  { id: "PR-2048", item: "Seal Kit SK-08", order: "PO-1048", qty: 8, priority: "High", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 10, 2026" },
  { id: "PR-2051", item: "Bearing BR-02", order: "PO-1068", qty: 10, priority: "High", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 9, 2026" },
  { id: "PR-2057", item: "Impeller 4in", order: "PO-1057", qty: 18, priority: "Medium", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 8, 2026" },
  { id: "PR-2063", item: "Gasket G-14", order: "PO-1072", qty: 12, priority: "Low", status: "Pending", supplier: "Preferred supplier", requestedOn: "Jun 11, 2026" },
];

const requestHistory = [
  { id: "PR-2038", item: "Fastener Set FS-20", order: "PO-1036", qty: 24, priority: "Low", status: "Received", completed: "Jun 8, 2026", notes: "Parts received and inventory updated." },
  { id: "PR-2034", item: "Gasket G-14", order: "PO-1032", qty: 6, priority: "Medium", status: "Cancelled", completed: "Jun 6, 2026", notes: "Cancelled after order quantity was revised." },
];

const app = document.getElementById("app");
const appTodayIso = "2026-06-12";

function pumpModelOptions() {
  return ["Select pump model", "Centrifugal Pump CP-100", "Pump A-12", "Pump B-20", "Pump C-05", "Pump D-10"];
}

function nextProductionOrderId() {
  return "PO-1092";
}

function resetCreateOrderForm() {
  state.createOrderId = nextProductionOrderId();
  state.createCustomer = "";
  state.createPump = "Select pump model";
  state.createQty = "";
  state.createOrderedDate = appTodayIso;
  state.createDate = "";
  state.createNotes = "";
}

function ensureCreateOrderDefaults() {
  if (!state.createOrderId) state.createOrderId = nextProductionOrderId();
  if (!state.createOrderedDate) state.createOrderedDate = appTodayIso;
}

function currentPurchaseRequests() {
  return [...state.createdRequests, ...requests];
}

function findPurchaseRequest(id) {
  return currentPurchaseRequests().find((r) => r.id === id) || requestHistory.find((r) => r.id === id);
}

function recommendationForInventoryItem(item) {
  return recommendations.find((r) => r.id === item.id || r.item === item.name);
}

function createdRecommendationIds() {
  return new Set(state.createdRequests.map((request) => request.recommendationId).filter(Boolean));
}

function availableRecommendations() {
  const requestedIds = createdRecommendationIds();
  return recommendations.filter((recommendation) => !requestedIds.has(recommendation.id));
}

function selectedAvailableRecommendation() {
  const available = availableRecommendations();
  return available.find((recommendation) => recommendation.id === state.selectedRecommendationId) || available[0] || null;
}

function selectedInventoryItem() {
  return inventory.find((item) => item.id === state.selectedInventoryId && item.category === "Component") || inventory.find((item) => item.category === "Component");
}

function createdOrderDraft() {
  return {
    id: state.createOrderId || "PO-1092",
    customer: state.createCustomer || "Not recorded",
    model: state.createPump && state.createPump !== "Select pump model" ? state.createPump : "Custom pump model",
    qty: state.createQty || "1",
    ordered: formatDateLabel(state.createOrderedDate),
    date: formatDateLabel(state.createDate),
    notes: state.createNotes || "No notes added",
  };
}

function formatDateLabel(value) {
  if (!value) return "Not set";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
    <div class="field"><label>Order ID</label><input data-create-field="orderId" value="${state.createOrderId}" /></div>
    <div class="field"><label>Customer name</label><input data-create-field="customer" value="${state.createCustomer}" placeholder="Enter customer name" /></div>
    <div class="field"><label>Ordered date</label><input type="date" data-create-field="orderedDate" value="${state.createOrderedDate}" /></div>
    <div class="field"><label>Required date</label><input type="date" data-create-field="date" value="${state.createDate}" /></div>
    <div class="field"><label>Pump model</label>${dropdown("createPump", state.createPump, pumpModelOptions())}</div>
    <div class="field"><label>Quantity</label><input data-create-field="qty" value="${state.createQty}" placeholder="Enter quantity" /></div>
    <div class="field wide"><label>Notes</label><textarea data-create-field="notes" placeholder="Add production notes">${state.createNotes}</textarea></div>
  `;
}

function search(id, placeholder) {
  return `<input id="${id}" class="search-input" type="search" placeholder="${placeholder}" />`;
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
    "create-order": ["Create Production Order", "Add a new internal production order"],
    "order-created": ["Order Created", "Production order created"],
    readiness: ["Order Readiness", "Automatic inventory result for this order"],
    "readiness-ready": ["Order Readiness", "Automatic inventory result for this order"],
    "release-success": ["Release Complete", "Order released to assembly"],
    "no-issues": ["No Issues", "No blocked orders or critical shortages"],
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
  if (route === "orders" && ["orders", "create-order", "order-created", "readiness", "readiness-ready", "release-success"].includes(current)) return "active";
  if (route === "inventory" && current === "inventory") return "active";
  if (route === "recommendations" && current === "recommendations") return "active";
  if (route === "requests" && current === "requests") return "active";
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
  const list = orders.map((order) => ({ ...order }));
  if (state.orderCreated) {
    const draft = createdOrderDraft();
    list.push({ id: draft.id, customer: draft.customer, model: draft.model, qty: draft.qty, ordered: draft.ordered, date: draft.date, status: "Ready", blocking: "", notes: draft.notes });
  }
  return list.map((order) => {
    let next = { ...order };
    if (next.id === state.releasedOrderId) next = { ...next, status: "In production", blocking: "" };
    if (next.id === "PO-1048" && state.readinessResolved) next = { ...next, status: "Ready", blocking: "" };
    if (state.orderStatusOverrides[next.id]) {
      next = { ...next, status: state.orderStatusOverrides[next.id] };
      if (next.status !== "Blocked") next.blocking = "";
    }
    return next;
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

function dashboard() {
  const list = currentOrders();
  const inProduction = list.filter((o) => o.status === "In production");
  const ready = list.filter((o) => o.status === "Ready");
  const blocked = list.filter((o) => o.status === "Blocked");
  const low = inventory.filter((i) => ["Low stock", "Out of stock"].includes(i.status));
  const statusRank = { "In production": 0, Ready: 1, Blocked: 2 };
  const dashboardOrders = [...list].sort((a, b) => (statusRank[a.status] ?? 3) - (statusRank[b.status] ?? 3)).slice(0, 5);
  const receiptDue = currentPurchaseRequests()
    .filter((request) => ["Pending", "Partially received"].includes(requestStatus(request)))
    .slice(0, 3);
  const selectedDashboardOrder = dashboardOrders.find((o) => o.id === state.selectedDashboardOrderId) || dashboardOrders[0];
  return shell(`
    ${header("Dashboard", "Production readiness and inventory visibility")}
    <section class="grid summary">
      <article class="card metric"><span>In production</span><strong>${inProduction.length}</strong><small>Currently being built</small></article>
      <article class="card metric"><span>Ready</span><strong>${ready.length}</strong><small>Can start production</small></article>
      <article class="card metric emphasis"><span>Blocked</span><strong>${blocked.length}</strong><small>Need inventory action</small></article>
      <article class="card metric"><span>Purchase requests pending</span><strong>${currentPurchaseRequests().filter((r) => requestStatus(r) === "Pending").length}</strong><small>Awaiting receipt</small></article>
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
          <div class="footer-row"><button class="button" data-route="orders">View production orders</button><span>In production shown first</span></div>
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
                <div><span>Ordered date</span><strong>${selectedDashboardOrder.ordered || "Today"}</strong></div>
                <div><span>Required date</span><strong>${selectedDashboardOrder.date}</strong></div>
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
                  const amount = state.requestReceived && item.id === "seal-kit" ? item.updatedOnHand : item.onHand;
                  return `<tr data-inventory="${item.id}"><td>${item.name}</td><td>${amount}</td><td>${rec ? rec.required : item.reorder}</td><td>${badge(item.status)}</td></tr>`;
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
            <thead><tr><th>Item</th><th>Remaining</th><th>Status</th></tr></thead>
            <tbody>
              ${receiptDue
                .map((request) => `<tr data-request="${request.id}"><td>${request.item}</td><td>${remainingQty(request)}</td><td>${compactStatusBadge(requestStatus(request))}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `);
}

function ordersPage() {
  const orderList = currentOrders().filter((o) => {
    const statusMatch = state.statusFilter === "All" || o.status === state.statusFilter;
    const pumpMatch = state.pumpFilter === "All" || o.model === state.pumpFilter;
    return statusMatch && pumpMatch;
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
            ${toolbarField("Search", search("order-search", "Search by order ID or pump model"), true)}
            ${toolbarField("Status", dropdown("statusFilter", state.statusFilter, ["All", "Ready", "Blocked", "In production"]))}
            ${toolbarField("Pump model", dropdown("pumpFilter", state.pumpFilter, ["All", "Pump A-12", "Pump B-20", "Pump C-05", "Pump D-10"]))}
            <button class="button secondary" data-action="reset-order-filters">Reset filters</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Order ID</th><th>Pump model</th><th>Quantity</th><th>Required date</th><th>Status</th></tr></thead>
              <tbody>
                ${orderList
                  .map(
                    (o) =>
                      `<tr class="${selectedOrder && o.id === selectedOrder.id ? "selected" : ""}" data-order-select="${o.id}"><td>${o.id}</td><td>${o.model}</td><td>${o.qty}</td><td>${o.date}</td><td>${badge(o.status)}</td></tr>`
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="footer-row"><span>Rows per page: 25</span><span>1-${orderList.length} of ${orderList.length}</span></div>
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
                <div class="full"><span>Customer</span><strong>${selectedOrder.customer || "Not recorded"}</strong></div>
                <div class="full"><span>Pump model</span><strong>${selectedOrder.model}</strong></div>
                <div><span>Quantity</span><strong>${selectedOrder.qty}</strong></div>
                <div><span>Status</span>${badge(selectedOrder.status)}</div>
                <div><span>Ordered date</span><strong>${selectedOrder.ordered || "Today"}</strong></div>
                <div><span>Required date</span><strong>${selectedOrder.date}</strong></div>
                <div class="full"><span>Notes</span><strong>${selectedOrder.notes || "No notes added"}</strong></div>
              </div>
              <div class="divider"></div>
              <h3>Status action</h3>
              ${
                selectedOrder.status === "Ready"
                  ? `<p>Start work on this order.</p><button class="button full" data-order-status="In production" data-order="${selectedOrder.id}">Move to in production</button>`
                  : selectedOrder.status === "In production"
                    ? `<p>Use this when assembly is complete.</p><button class="button full" data-order-status="Finished" data-order="${selectedOrder.id}">Mark as finished</button>`
                    : `<p>This order is blocked until missing inventory is resolved.</p>`
              }`
            : `<p>No order selected.</p>`
        }
      </aside>
    </section>
  `);
}

function readinessPage(ready = false) {
  const resolved = ready || state.readinessResolved;
  const status = resolved ? "Ready" : "Blocked";
  const components = resolved
    ? [
        ["Seal Kit SK-08", 12, 12, 0, "Ready"],
        ["Impeller 4in", 8, 9, 0, "Ready"],
        ["Fastener Set FS-20", 24, 30, 0, "Ready"],
      ]
    : [
        ["Seal Kit SK-08", 12, 4, 8, "Blocked"],
        ["Impeller 4in", 8, 9, 0, "Ready"],
        ["Fastener Set FS-20", 24, 30, 0, "Ready"],
      ];
  return shell(`
    ${header("Order Readiness", "Automatic inventory result for this production order", button("Back to orders", "orders", "secondary"))}
    <section class="card pad status-panel">
      <div>
        <p class="mini-label">Order</p>
        <h2>${state.selectedOrderId}</h2>
        <p class="sub">Pump A-12 - Quantity 12 - Required Jun 12, 2026</p>
      </div>
      <div>
        <p class="mini-label">Readiness status</p>
        <div class="status-word ${resolved ? "ready-text" : "blocked-text"}">${status}</div>
        <p class="sub">${resolved ? "All required components are available." : "Release is unavailable until the shortage is resolved."}</p>
      </div>
      <div>${resolved ? button("Release to production", "release-success") : `<button class="button" data-modal="create-purchase-request">Create purchase request</button>`}</div>
    </section>
    <section class="card">
      <div class="panel-head"><div><h2>Component Availability</h2><p>Only components with shortages block the order release.</p></div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Component</th><th>Required quantity</th><th>Available quantity</th><th>Shortage quantity</th><th>Status</th></tr></thead>
          <tbody>${components.map((c, index) => `<tr class="${!resolved && index === 0 ? "selected" : ""}"><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td><td>${c[3]}</td><td>${badge(c[4])}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    <section class="card pad" style="margin-top: 28px;">
      <h2>Recommended Action</h2>
      <p>${resolved ? `Release ${state.selectedOrderId} to production.` : "Create purchase request for 8 missing Seal Kit SK-08 units."}</p>
    </section>
  `);
}

function inventoryPage() {
  const items = inventory.filter((item) => {
    const statusMatch = state.stockFilter === "All" || item.status === state.stockFilter;
    return statusMatch;
  });
  const componentItems = items.filter((item) => item.category === "Component");
  const selected = componentItems.find((i) => i.id === state.selectedInventoryId) || componentItems[0] || inventory.find((item) => item.category === "Component");
  const onHand = state.requestReceived && selected.id === "seal-kit" ? selected.updatedOnHand : selected.onHand;
  const selectedRecommendation = recommendationForInventoryItem(selected);
  return shell(`
    ${header("Inventory", "Check available parts and stock levels for production planning")}
    <section class="two-col">
      <div class="left-stack">
        <article class="card">
          <div class="panel-head"><div><h2>Component Inventory</h2></div><span class="panel-meta">${componentItems.length} components</span></div>
          <div class="toolbar inventory-toolbar">
            ${toolbarField("Search", search("inventory-search", "Search by item name or part number"), true)}
            ${toolbarField("Stock status", dropdown("stockFilter", state.stockFilter, ["All", "In stock", "Low stock", "Out of stock"]))}
            <button class="button secondary" data-action="reset-inventory-filters">Reset filters</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Item name</th><th>Category</th><th>On hand</th><th>Minimum stock</th><th>Stock status</th></tr></thead>
              <tbody>${componentItems.map((item) => {
                const amount = state.requestReceived && item.id === "seal-kit" ? item.updatedOnHand : item.onHand;
                return `<tr class="${item.id === selected.id ? "selected" : ""}" data-inventory="${item.id}"><td>${item.name}</td><td>${item.category}</td><td>${amount}</td><td>${item.reorder}</td><td>${badge(item.status)}</td></tr>`;
              }).join("")}</tbody>
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
        <p class="sub">Inventory availability is calculated immediately after the order is created.</p>
        <div class="detail-list"><div><span>Expected result</span>${badge("Ready")}</div><div><span>Next step</span><strong>Release if needed</strong></div></div>
      </aside>
    </section>
  `);
}

function orderCreatedPage() {
  state.orderCreated = true;
  const draft = createdOrderDraft();
  state.selectedOrderId = draft.id;
  return successPage("Order Created", "Production order created", `Inventory was checked automatically and ${draft.id} is ready to release.`, [
    ["Order ID", draft.id],
    ["Customer", draft.customer],
    ["Readiness result", badge("Ready")],
    ["Pump model", draft.model],
    ["Ordered date", draft.ordered],
    ["Required date", draft.date],
  ], [
    ["View readiness result", "readiness-ready", ""],
    ["View order list", "orders", "secondary"],
  ]);
}

function requestsPage() {
  const reopenedRequests = requestHistory
    .filter((r) => state.reopenedHistoryIds.includes(r.id))
    .map((r) => ({ ...r, status: "Pending", requestedOn: r.completed, supplier: "Manual review" }));
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
              <thead><tr><th>Request ID</th><th>Item</th><th>Related order</th><th>Qty</th><th>Priority</th><th>Requested on</th></tr></thead>
              <tbody>${activeRequests.map((r) => `<tr class="${selected && r.id === selected.id ? "selected" : ""}" data-request="${r.id}"><td>${r.id}</td><td>${r.item}</td><td>${r.order}</td><td>${r.qty}</td><td>${badge(r.priority)}</td><td>${r.requestedOn}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </article>
        <article class="card">
          <div class="panel-head"><div><h2>Partially Received</h2><p>Requests with some parts received and a remaining quantity still open</p></div><span class="panel-meta">${partialRequests.length} partial</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Request ID</th><th>Item</th><th>Ordered</th><th>Received</th><th>Remaining</th><th>Status</th></tr></thead>
              <tbody>${partialRequests.map((r) => `<tr class="${selected && r.id === selected.id ? "selected" : ""}" data-request="${r.id}"><td>${r.id}</td><td>${r.item}</td><td>${orderedQty(r)}</td><td>${receivedQty(r)}</td><td>${remainingQty(r)}</td><td>${compactStatusBadge(requestStatus(r))}</td></tr>`).join("")}</tbody>
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
  state.releasedOrderId = state.selectedOrderId;
  return successPage("Released to Production", "Order released to assembly", `${state.selectedOrderId} has been released to assembly and is now in production.`, [
    ["Order ID", state.selectedOrderId],
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
        <h2>No blocked orders or critical shortages</h2>
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
    const rec = selectedAvailableRecommendation() || recommendations.find((r) => r.id === state.selectedRecommendationId) || recommendations[0];
    const inventoryItem = selectedInventoryItem();
    const inventoryRecommendation = inventoryItem ? recommendationForInventoryItem(inventoryItem) : null;
    const isManualRequest = state.createRequestMode === "manual";
    const isInventoryRequest = state.createRequestMode === "inventory";
    const savedPriority = state.priority === "Select priority" ? "" : state.priority;
    const currentPriority = isManualRequest ? state.priority || "Select priority" : isInventoryRequest ? savedPriority || inventoryRecommendation?.priority || "Low" : savedPriority || rec.priority;
    const currentSupplier = isManualRequest ? state.supplier || "Select supplier" : state.supplier === "Select supplier" ? "Preferred supplier" : state.supplier || "Preferred supplier";
    const supplierOptions = isManualRequest ? ["Select supplier", "Preferred supplier", "Alternate supplier", "Manual review"] : ["Preferred supplier", "Alternate supplier", "Manual review"];
    const priorityOptions = isManualRequest ? ["Select priority", "High", "Medium", "Low"] : ["High", "Medium", "Low"];
    const itemValue = isManualRequest ? "" : isInventoryRequest ? inventoryItem?.name || "" : rec.item;
    const qtyValue = isManualRequest ? "" : isInventoryRequest ? inventoryRecommendation?.shortage || "" : rec.shortage;
    const requestNote = `Please confirm availability and earliest delivery date for ${rec.shortage} ${rec.item} units.`;
    const inventoryNote = inventoryRecommendation
      ? `Please confirm availability and earliest delivery date for ${inventoryRecommendation.shortage} ${inventoryItem.name} units.`
      : `Request additional ${inventoryItem?.name || "inventory item"} for stock replenishment.`;
    const noteValue = isManualRequest ? "" : isInventoryRequest ? inventoryNote : requestNote;
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
            <div class="field wide"><label>Item name</label><input data-create-request-field="item" value="${itemValue}" placeholder="Enter item name" /></div>
            <div class="field"><label>Quantity to order</label><input data-create-request-field="qty" value="${qtyValue}" placeholder="Enter quantity" /></div>
            <div class="field"><label>Supplier</label>${dropdown("supplier", currentSupplier, supplierOptions)}</div>
            <div class="field"><label>Priority</label>${dropdown("priority", currentPriority, priorityOptions)}</div>
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
            <div class="field"><label>Supplier</label>${dropdown("editSupplier", state.editSupplier || draft.supplier || "Manual review", ["Preferred supplier", "Alternate supplier", "Manual review"])}</div>
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
    readiness: () => readinessPage(false),
    "readiness-ready": () => readinessPage(true),
    requests: requestsPage,
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

document.addEventListener("click", (event) => {
  const option = event.target.closest("[data-dropdown-option]");
  if (option) {
    const key = option.dataset.dropdownOption;
    state[key] = option.dataset.value;
    if (state.activeModal && key === "createPump") {
      const dropdownEl = option.closest(".dropdown");
      const label = dropdownEl?.querySelector(".dropdown-trigger span:first-child");
      if (label) label.textContent = option.dataset.value;
      dropdownEl?.querySelectorAll(".dropdown-option").forEach((node) => {
        node.classList.toggle("selected", node === option);
      });
      dropdownEl?.classList.remove("open");
      return;
    }
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
    const selectedRequest = findPurchaseRequest(state.selectedRequestId);
    const selectedRecommendation = selectedAvailableRecommendation() || recommendations.find((r) => r.id === state.selectedRecommendationId) || recommendations[0];
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
      state.editSupplier = selectedRequest.supplier || "Manual review";
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
    render();
    return;
  }

  const confirmCreateRequest = event.target.closest("[data-confirm-create-request]");
  if (confirmCreateRequest) {
    const isManualRequest = state.createRequestMode === "manual";
    const isInventoryRequest = state.createRequestMode === "inventory";
    const inventoryItem = selectedInventoryItem();
    const inventoryRecommendation = inventoryItem ? recommendationForInventoryItem(inventoryItem) : null;
    const rec = selectedAvailableRecommendation() || recommendations.find((r) => r.id === state.selectedRecommendationId) || recommendations[0];
    const requestId = `PR-${2090 + state.createdRequests.length}`;
    const itemField = document.querySelector("[data-create-request-field='item']");
    const qtyField = document.querySelector("[data-create-request-field='qty']");
    const noteField = document.querySelector("[data-create-request-field='note']");
    const manualItem = itemField?.value.trim() || "Manual purchase item";
    const manualQty = qtyField?.value.trim() || "1";
    const selectedPriority = state.priority === "Select priority" ? "Medium" : state.priority;
    const selectedSupplier = state.supplier === "Select supplier" ? "Manual review" : state.supplier;
    state.createdRequests.unshift({
      id: requestId,
      item: isManualRequest || isInventoryRequest ? manualItem : rec.item,
      order: isManualRequest ? "Not linked" : isInventoryRequest ? inventoryRecommendation?.order || "Not linked" : rec.order,
      qty: isManualRequest || isInventoryRequest ? manualQty : rec.shortage,
      priority: isManualRequest || isInventoryRequest ? selectedPriority : state.priority || rec.priority,
      status: "Pending",
      supplier: isManualRequest || isInventoryRequest ? selectedSupplier : state.supplier,
      requestedOn: "Today",
      recommendationId: isManualRequest ? null : isInventoryRequest ? inventoryRecommendation?.id || null : rec.id,
      notes: noteField?.value.trim() || "",
    });
    state.purchaseCreated = true;
    state.createdRequestId = requestId;
    state.selectedRequestId = requestId;
    state.selectedCompletedRequestId = null;
    state.createRequestMode = "recommendation";
    state.activeModal = "purchase-request-success";
    render();
    return;
  }

  const confirmCreateOrder = event.target.closest("[data-confirm-create-order]");
  if (confirmCreateOrder) {
    const orderId = document.querySelector("[data-create-field='orderId']");
    const customer = document.querySelector("[data-create-field='customer']");
    const qty = document.querySelector("[data-create-field='qty']");
    const orderedDate = document.querySelector("[data-create-field='orderedDate']");
    const date = document.querySelector("[data-create-field='date']");
    const notes = document.querySelector("[data-create-field='notes']");
    state.createOrderId = orderId?.value.trim() || "";
    state.createCustomer = customer?.value.trim() || "";
    state.createQty = qty?.value.trim() || "";
    state.createOrderedDate = orderedDate?.value.trim() || "";
    state.createDate = date?.value.trim() || "";
    state.createNotes = notes?.value.trim() || "";
    const draft = createdOrderDraft();
    state.orderCreated = true;
    state.selectedOrderId = draft.id;
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
      const amountReceived = Math.max(0, Number(state.receiptDraft ?? remainingQty(selectedRequest)) || 0);
      const totalReceived = Math.min(receivedQty(selectedRequest) + amountReceived, orderedQty(selectedRequest));
      state.cancelledRequestIds = state.cancelledRequestIds.filter((requestId) => requestId !== selectedRequest.id);
      state.receivedRequestIds = state.receivedRequestIds.filter((requestId) => requestId !== selectedRequest.id);
      if (amountReceived > 0 && totalReceived >= orderedQty(selectedRequest)) {
        delete state.partialReceipts[selectedRequest.id];
        state.reopenedHistoryIds = state.reopenedHistoryIds.filter((requestId) => requestId !== selectedRequest.id);
        selectedRequest.status = "Received";
        selectedRequest.completed = "Today";
        selectedRequest.notes = selectedRequest.notes || "Received from request details.";
        state.receivedRequestIds.push(selectedRequest.id);
        state.selectedCompletedRequestId = selectedRequest.id;
        state.historyNoteDraft = selectedRequest.notes;
        if (selectedRequest.id === "PR-2048") {
          state.requestReceived = true;
          state.requestCancelled = false;
          state.readinessResolved = true;
        }
      } else if (amountReceived > 0) {
        state.partialReceipts[selectedRequest.id] = totalReceived;
        selectedRequest.status = "Pending";
        state.selectedRequestId = selectedRequest.id;
        state.selectedCompletedRequestId = null;
        state.historyNoteDraft = null;
        if (selectedRequest.id === "PR-2048") {
          state.requestReceived = false;
          state.requestCancelled = false;
          state.readinessResolved = false;
        }
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
    if (selectedRequest?.id === "PR-2048") {
      state.requestCancelled = true;
      state.requestReceived = false;
      state.readinessResolved = false;
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
    state.selectedOrderId = orderStatusAction.dataset.order;
    state.orderStatusOverrides[orderStatusAction.dataset.order] = orderStatusAction.dataset.orderStatus;
    if (orderStatusAction.dataset.orderStatus === "In production") state.releasedOrderId = orderStatusAction.dataset.order;
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
      const orderId = document.querySelector("[data-create-field='orderId']");
      const customer = document.querySelector("[data-create-field='customer']");
      const qty = document.querySelector("[data-create-field='qty']");
      const orderedDate = document.querySelector("[data-create-field='orderedDate']");
      const date = document.querySelector("[data-create-field='date']");
      const notes = document.querySelector("[data-create-field='notes']");
      state.createOrderId = orderId?.value.trim() || "";
      state.createCustomer = customer?.value.trim() || "";
      state.createQty = qty?.value.trim() || "";
      state.createOrderedDate = orderedDate?.value.trim() || "";
      state.createDate = date?.value.trim() || "";
      state.createNotes = notes?.value.trim() || "";
    }
    if (routeEl.dataset.order) state.selectedOrderId = routeEl.dataset.order;
    routeTo(routeEl.dataset.route);
    return;
  }

  const resetOrders = event.target.closest("[data-action='reset-order-filters']");
  if (resetOrders) {
    state.statusFilter = "All";
    state.pumpFilter = "All";
    render();
    return;
  }

  const resetInventory = event.target.closest("[data-action='reset-inventory-filters']");
  if (resetInventory) {
    state.stockFilter = "All";
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
    if (status === "Reopen request") {
      state.receivedRequestIds = state.receivedRequestIds.filter((requestId) => requestId !== id);
      state.cancelledRequestIds = state.cancelledRequestIds.filter((requestId) => requestId !== id);
      delete state.partialReceipts[id];
      if (activeRequest) {
        activeRequest.status = "Pending";
        activeRequest.notes = note || activeRequest.notes;
      }
      if (historyRequest && !state.reopenedHistoryIds.includes(id)) {
        historyRequest.notes = note || historyRequest.notes;
        state.reopenedHistoryIds.push(id);
      }
      if (id === "PR-2048") {
        state.requestReceived = false;
        state.requestCancelled = false;
        state.readinessResolved = false;
      }
      state.selectedRequestId = id;
      state.selectedCompletedRequestId = null;
      state.editCompletedStatus = null;
      state.historyNoteDraft = null;
      render();
      return;
    }
    if (activeRequest) {
      activeRequest.notes = note;
      activeRequest.completed = activeRequest.completed || "Today";
      state.receivedRequestIds = state.receivedRequestIds.filter((requestId) => requestId !== id);
      state.cancelledRequestIds = state.cancelledRequestIds.filter((requestId) => requestId !== id);
      delete state.partialReceipts[id];
      if (status === "Received") state.receivedRequestIds.push(id);
      if (status === "Cancelled") state.cancelledRequestIds.push(id);
      if (id === "PR-2048") {
        state.requestReceived = status === "Received";
        state.requestCancelled = status === "Cancelled";
        state.readinessResolved = status === "Received";
      }
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

document.addEventListener("input", (event) => {
  const createField = event.target.closest("[data-create-field]");
  if (createField) {
    if (createField.dataset.createField === "orderId") state.createOrderId = createField.value;
    if (createField.dataset.createField === "customer") state.createCustomer = createField.value;
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

state.route = window.location.hash.replace("#", "") || "dashboard";
render();
