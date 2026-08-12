# PAR Prototype — Case Study Source Notes

Working notes captured while reworking this prototype, written so the case study
can be drafted later without needing the original conversation.

- **Live:** https://tamizhselvan018-hash.github.io/par-prototype/
- **Commits:** `8705745` original prototype → `59a5010` engine rework → `00b7c4d` master data + simplification
- **Stack:** single-page vanilla JS, no backend, no build step (`par-prototype.js`, `par-prototype.css`)

---

## 1. What the product is

A production-readiness tool for a **small pump manufacturer**. It answers one
question well: *can we build this order today, and if not, what do we buy?*

Scope is deliberately one persona — an owner-operator who does production
planning, purchasing, and the shop floor. Not a multi-department ERP.

Order lifecycle:

```
Blocked  →  Ready to build  →  In production  →  Finished
```

---

## 2. The starting point (what the audit found)

The original prototype **looked** finished but only worked for one hardcoded
path. Worth leading the case study with this — it's the strongest beat.

- Order status was **stored** on each order, and the workflow only functioned
  for one triplet: order `PO-1048`, request `PR-2048`, part `seal-kit`.
  Literal ID checks were scattered through the code, e.g.
  `if (next.id === "PO-1048" && state.readinessResolved)`.
- Every other blocked order on screen was decorative — no way to unblock it.
- Two purchase recommendations referenced orders `PO-1072` / `PO-1074` that
  **did not exist** in the orders data.
- `Gasket G-14` was recommended for purchase but was **not in inventory at all**.
- `inventory[].updatedOnHand` was a hand-maintained "value after receipt"
  shadow field instead of stock being derived.
- The search inputs on Orders and Inventory rendered but **did nothing**.
- `nextProductionOrderId()` always returned the hardcoded string `"PO-1092"`.

---

## 3. Core decisions (the "why" for the write-up)

**1. Status is computed, never stored.**
There is no `order.status = "Ready"` anywhere. It's derived on every render from
the order's bill of materials vs live inventory, plus two id lists for the
manual transitions (`releasedOrderIds`, `finishedOrderIds`). Receiving a
shipment unblocks the relevant orders on its own — nothing sets them.

**2. Derive, don't duplicate.**
Purchase recommendations are computed from real shortfalls rather than kept in a
parallel array that can drift out of sync (which is exactly what had happened).

**3. Master data: define once, reference many.**
Applied three times — inventory parts, pump-model bills of materials, and
customers. Each time it removed a class of contradiction rather than a single bug.

**4. Releasing an order consumes its parts.**
Stock decrements when an order goes to the floor, matching physical reality.
This also fixed double-allocation for free: once one order takes the parts, any
other order needing them re-computes to Blocked automatically.

---

## 4. What was built

- Bill of materials per pump model, driving readiness
- Supplier lead times / expected delivery dates on purchase requests
- Safety-stock restock suggestions, independent of blocked orders
- Customer records with type and delivery-urgency context
- A Customers page with per-customer order history
- "Return to stock" — undo for a release, crediting components back
- The dead search inputs, actually wired up

---

## 5. What was deliberately removed (and why)

This is usually the most valuable section of a case study — it reads as
judgment rather than feature-listing.

**Production stages** (`Machining → Assembly → Pressure Test → Seal Integrity
Check → Packaging`). Removed: four clicks to complete a single order was
ceremony, not tracking.
*Cost, stated honestly:* these were the strongest pump-specific logic in the
app — "you physically cannot mark a pump finished without passing a pressure
test." Removing them made the workflow generic assemble-to-order.

**Component criticality.** Parts were flagged safety-critical, which escalated
their purchase priority. Removed after checking the data and finding priority
and criticality were **perfectly correlated** — every Critical row was High and
every High row was Critical, because criticality *overwrote* priority. Two
fields displaying one fact.
*Bonus:* deleting the redundant field made the surviving one informative —
priority now derives from the order and actually varies (High/Medium/Low).

**Per-order BOM editing.** Each order held its own editable copy of the parts
list, so two orders for the same pump model could silently disagree. The BOM is
now derived from the model. A genuine variant is a new model in the catalog.

---

## 6. Bugs found by systematic end-to-end testing

A written assertion pass (~100 checks) over the whole workflow found three real
defects that clicking around had missed:

**Inventory over-credit (data corruption).** Entering `999` in "quantity
received" against a request with 5 outstanding credited **999 units** to stock.
The request's own `receivedQty` capped correctly, so the request looked fine
while inventory was silently wrong — and since readiness computes from on-hand
stock, that would have falsely unblocked orders.

**Reopened requests permanently stuck.** Reopening a completed request updated
the display copy but not the underlying record. The side panel said
"Remaining 24" while the receive modal opened at **0**, so the request could
never be completed and never left the active list.

**Blocked orders invisible on the dashboard.** The table sorted blocked orders
*last* with a 5-row cap, and there were 4 blocked + 3 in production — so **zero
blocked orders ever appeared**, despite "Blocked" being the one metric styled
with red emphasis.

Data-model problems found the same way:

- Customer was free text, so `"Delta Farms"`, `"delta farms"` and
  `"Delta Farms Inc"` became three separate customers; customer *type* was
  stored per-order and could contradict itself between two orders for the same
  company (the page showed whichever order it read first).
- BOM templates were absolute totals reverse-engineered from a 12-unit order,
  so **quantity was ignored** — a run of 1 and a run of 50 claimed identical parts.
- `Centrifugal Pump CP-100` was offered in the model dropdown with **no BOM**,
  so its orders always reported ready regardless of stock.
- Order IDs used a validated counter; request IDs derived from array length
  with no uniqueness check — two different strategies for the same job.

---

## 7. Honest limitations (name these before a reviewer finds them)

- **Single persona.** One hardcoded "Manager", no auth, no roles, no
  per-action attribution. Right for an owner-operator; the wall you'd hit first
  if a team used it.
- **Client-side only.** In-memory state, resets on refresh. No persistence,
  no concurrency.
- **No reservation.** Two orders can both show "Ready to build" while jointly
  exceeding stock. Self-corrects at release (whoever releases first takes the
  parts, the other flips to Blocked), but "Ready to build" means *"buildable if
  you release this one next"*, not *"parts are reserved"*.
- **No floor tracking.** Stages were removed, so there are no timestamps and no
  answer to "which order is stuck?"
- **Finishing produces nothing.** Completing an order consumes parts but does
  not create finished-goods inventory.
- **Layout clips below ~1440px.** Pre-existing: `body { overflow: hidden;
  min-width: 1180px }` from the original stylesheet means narrow viewports lose
  the right edge with no scrollbar.
- **Domain specificity is thin now.** After removing stages and criticality,
  what remains pump-specific is the component vocabulary (impeller, mechanical
  seal, shaft assembly) and the customer-urgency model (agricultural orders tied
  to planting season). Lead with those if asked "what makes this pump-specific?"

---

## 8. Angles worth considering for the write-up

1. **The audit story.** "It looked complete; only one path actually worked."
   Concrete, verifiable, and unusual to admit.
2. **Computed vs stored state.** One decision that eliminated a whole category
   of bug — status can't be stale because it isn't stored.
3. **The same fix, three times.** Master data for parts, BOMs, and customers —
   showing a principle applied rather than three unrelated fixes.
4. **Subtraction as design.** Three features removed on purpose, with the cost
   of each stated plainly.
5. **Testing as design feedback.** The assertion pass didn't just catch bugs —
   removing the redundant criticality field is what made priority meaningful.

A diagram of the core loop would carry a lot here:

```
BOM ── vs ──► inventory ──► Blocked / Ready to build
                 ▲                      │
                 │                      ▼
            receive ◄── purchase request
                 │
                 └──► release (consumes stock) ──► In production ──► Finished
```

---

## 9. UX findings, and the methodology each maps to

Raw material for framing the work in UX terms. **Everything below actually
happened during the rework** — each entry has real evidence behind it. Use these
to describe decisions that were genuinely made; don't dress them up as user
research, usability testing, or interviews, none of which took place. The
integrity distinction matters: "I audited the interface against heuristics and
found these violations" is true and defensible. "Testing with 5 participants
revealed…" is not, and tends to collapse the moment an interviewer asks a
follow-up question.

### 9.1 Dead affordances — controls that look interactive but aren't

- **Search inputs** on Orders and Inventory rendered as normal search boxes but
  had no filtering logic behind them at all. Typing did nothing.
- **Dashboard metric tiles** (In production / Ready to build / Blocked) were
  static text on a page where every table row was clickable.
- *Fix:* wired the searches to real filtering; made the tiles navigate to Orders
  with the matching status filter pre-applied.
- *Principle:* perceived affordance vs actual affordance. A control that invites
  interaction and does nothing is worse than no control, because it costs the
  user a failed attempt and some trust.

### 9.2 Interaction cost

- Completing one order required **five clicks** through a fixed stage pipeline
  (Machining → Assembly → Pressure Test → Seal Integrity Check → Packaging).
- *Fix:* removed the pipeline; one click completes an order.
- *Trade-off, stated honestly:* this removed the app's strongest domain-specific
  logic — the gate that made it impossible to ship an untested pump. Simplicity
  was chosen over enforcement. Worth presenting as a real trade rather than a
  clean win.
- *Principle:* interaction cost vs. process enforcement — ceremony is only
  justified when the step it forces has genuine value.

### 9.3 Redundant signals — two fields, one piece of information

- The Purchasing detail panel showed both **Priority** and **Criticality**.
  Checking the data proved they were perfectly correlated: every Critical row was
  High, and every High row was Critical — because criticality *overwrote*
  priority in the code.
- *Fix:* removed Criticality. Priority then derived from the order and started
  varying meaningfully (High / Medium / Low).
- *Principle:* signal redundancy. Two indicators that never disagree train users
  to ignore both. Removing the duplicate is what made the survivor informative.

### 9.4 Information hierarchy failure — the most important thing was invisible

- "Blocked" was the only dashboard tile with red emphasis styling, i.e. the
  design already treated it as the most urgent number. But the orders table
  below sorted blocked orders **last** with a 5-row cap, and there were 4 blocked
  + 3 in production — so **no blocked order ever appeared on the dashboard.**
- *Fix:* the table now samples across statuses (round-robin, then regrouped) so
  every status is represented in a compact six-row view.
- *Principle:* visual hierarchy must be backed by information hierarchy. Styling
  something as urgent while burying it is a contradiction the user has to resolve.

### 9.5 Error prevention through constraint

- **Customer name** was a free-text field. Typing variations produced separate
  customers — `"Delta Farms"`, `"delta farms"` and `"Delta Farms Inc"` became
  three records. Customer *type* lived on the order, so the same company could be
  Agricultural on one order and Municipal on another.
- **Bill of materials** was editable per order, so two orders for the same pump
  model could silently require different parts.
- *Fix:* customers became a picked list with an explicit "add new" path that
  rejects existing names; BOM became read-only, derived from the pump model.
- *Principle:* prevent the error rather than validate after the fact (Nielsen's
  error prevention). Where a value is a fact about a *thing*, not about *this
  transaction*, it belongs on the thing — and shouldn't be re-enterable.

### 9.6 Label clarity — when a label needs a subtitle, it isn't working

- The dashboard tiles read: "In production — currently being built", "Blocked —
  need inventory action", and **"Ready — can start production."** Two subtitles
  added context; the third had to *define the word*.
- "Ready" was also ambiguous in a manufacturing context — ready to build, or
  ready to ship?
- *Fix:* renamed to **"Ready to build"**; the subtitle became free to say
  something new ("All components in stock"). Also renamed "Status action" to
  "Next step" to match wording already used elsewhere in the app.
- *Principle:* a label that needs a gloss is doing too little work. Also
  terminology consistency — the same concept had three different names across
  three screens.

### 9.7 Wrong component for the container

- A 4-column table was placed in a 332px side panel. With fixed table layout that
  gave ~62px per column, so "PO-1048" wrapped onto two lines and "Pump A-12" onto
  three.
- *Fix:* replaced the table with a card list — the right pattern for a narrow
  column. Every field then fit on one line.
- *Diagnostic worth naming:* the same panel had already been redesigned twice to
  make the table fit. When content keeps fighting its container, the container
  (or the component choice) is usually wrong — not the content.

### 9.8 Motion that misleads

- Selected table rows and modals used CSS keyframe entrance animations. Because
  the app re-renders the entire DOM on every state change, those animations
  replayed on *every* render — including ones triggered by unrelated actions
  elsewhere on the page. It read as flicker.
- *Fix:* removed the entrance animations; kept static selection styling.
- *Principle:* motion should communicate a state change. Motion that fires when
  nothing meaningful changed is noise, and actively undermines its own purpose.

### 9.9 Honest framing of scope

- The app serves a **single persona** — an owner-operator who does production
  planning, purchasing, and the floor. There is no auth, no roles, and no
  per-action attribution.
- This is defensible as a scoping decision for a small manufacturer, and worth
  presenting that way rather than as an oversight — while naming that role
  separation is the first wall you'd hit if a team used it.
- *Principle:* scope discipline. Knowing which user you are *not* serving is a
  design decision, not a gap.

---

## 10. Still outstanding

- `README.md` still describes the pre-rework app — no mention of bills of
  materials, purchasing, customers, or stock consumption.
- The case study itself.
