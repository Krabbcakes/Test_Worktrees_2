# Test 01: Toggle Visual States

## Purpose

Verify the worktree toggle button cycles through all 3 states correctly with proper visual feedback, tooltips, and seg-btn synchronization.

## Preconditions

- Test_Worktrees_2 project selected in the dashboard
- Worktree mode is **disabled** for this project (no project-level override)
- `useWorktree` session option is at default (`''`)
- Monitor tab is active with empty cells visible

## Test Steps

### 1.1 — Initial State (Default OFF)

**Action:** Observe the toggle button in an empty Monitor cell.

**Expected:**
- [ ] Toggle button is visible in the toolbar (between "New session" button and provider picker)
- [ ] Button has class `wt-toggle-btn` only (no `wt-toggle-active`, no `wt-toggle-override`)
- [ ] Icon color is muted gray (`--color-text-muted`)
- [ ] Border is `--color-border` (subtle dark border)
- [ ] No orange dot visible
- [ ] Tooltip reads: "Worktree: OFF — Click to create this session in a new git worktree"
- [ ] `aria-pressed` is `"false"`
- [ ] Button size is 28x28px, matching the gear icon

**Observations:**

---

### 1.2 — First Click: Cycle to Override ON

**Action:** Click the toggle button once.

**Expected:**
- [ ] Button gains classes `wt-toggle-active wt-toggle-override`
- [ ] Icon turns green (`--color-green`)
- [ ] Border turns green
- [ ] Background gains green tint (`--color-green-bg`)
- [ ] Small orange dot (6px) appears in top-right corner
- [ ] Tooltip changes to: "Worktree: ON (override) — Session will be created in a new git worktree"
- [ ] `aria-pressed` is `"true"`
- [ ] Color transition animates smoothly (~150ms)

**Observations:**

---

### 1.3 — Second Click: Cycle to Override OFF

**Action:** Click the toggle button again.

**Expected:**
- [ ] Button has class `wt-toggle-override` but NOT `wt-toggle-active`
- [ ] Icon turns orange-tinted (distinct from gray default)
- [ ] Border has subtle orange tint (`rgba(217, 119, 87, 0.35)`)
- [ ] Orange dot remains visible
- [ ] Tooltip changes to: "Worktree: OFF (override) — Session will run on the current branch"
- [ ] `aria-pressed` is `"false"`
- [ ] **Key check:** This state is visually distinct from the initial default-off state (orange vs gray)

**Observations:**

---

### 1.4 — Third Click: Cycle back to Default

**Action:** Click the toggle button a third time.

**Expected:**
- [ ] Button returns to initial state (no `wt-toggle-active`, no `wt-toggle-override`)
- [ ] Icon is muted gray again
- [ ] No orange dot
- [ ] Tooltip reads: "Worktree: OFF — Click to create this session in a new git worktree"
- [ ] Visual appearance matches Step 1.1 exactly

**Observations:**

---

### 1.5 — Seg-btn Synchronization (Toggle → Panel)

**Action:** 
1. Click toggle to set it to "Override ON" (green)
2. Open the session options panel (click gear icon)
3. Scroll to the "Worktree" row in the panel

**Expected:**
- [ ] The "On" seg-btn is highlighted/active
- [ ] "Default" and "Off" seg-btns are not active
- [ ] The seg-btn state matches the toggle button state

**Observations:**

---

### 1.6 — Seg-btn Synchronization (Panel → Toggle)

**Action:**
1. In the options panel, click the "Off" seg-btn
2. Observe the toggle button in the toolbar

**Expected:**
- [ ] Toggle button updates to override-off state (orange tint, orange dot)
- [ ] Tooltip updates to match
- [ ] Toggle and seg-btn are in sync

**Action continued:**
3. Click the "Default" seg-btn
4. Observe the toggle button

**Expected:**
- [ ] Toggle button returns to default state (gray, no dot)
- [ ] Full sync maintained

**Observations:**

---

### 1.7 — Multiple Empty Cells Update Together

**Action:**
1. Ensure Monitor is showing 4-panel grid layout (4 empty cells visible)
2. Click the toggle button in any one cell

**Expected:**
- [ ] ALL toggle buttons across all empty cells update simultaneously
- [ ] No cell shows stale state

**Observations:**

---

## Pass/Fail Criteria

- **PASS:** All 3 states are visually distinct, tooltips are accurate, seg-btn sync works bidirectionally, all cells update together
- **FAIL:** Any state is visually ambiguous, tooltip is wrong, sync breaks, or cells show inconsistent state
