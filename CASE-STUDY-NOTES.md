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

## 9. Still outstanding

- `README.md` still describes the pre-rework app — no mention of bills of
  materials, purchasing, customers, or stock consumption.
- The case study itself.
