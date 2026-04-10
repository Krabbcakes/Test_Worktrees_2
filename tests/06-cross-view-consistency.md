# Test 06: Cross-View Consistency

## Purpose

Verify that the worktree toggle appears and behaves identically across all session creation surfaces: Monitor grid, Monitor table, Sessions toolbar, and Terminal tab.

## Preconditions

- Test_Worktrees_2 project selected with worktree mode ENABLED
- Toggle at default state
- Electron app running (Terminal tab requires Electron)

## Test Steps

### 6.1 — Monitor Grid View

**Action:**
1. Navigate to Monitor tab
2. Ensure layout is "Grid" (4-panel)
3. Locate the toggle button in an empty cell toolbar

**Expected:**
- [ ] Toggle is visible between "New session" button and provider picker
- [ ] Shows default ON state (green)
- [ ] Clicking cycles through all 3 states correctly
- [ ] All empty cells update simultaneously

**Observations:**

---

### 6.2 — Monitor Table View

**Action:**
1. Switch Monitor layout to "Table" view
2. Scroll to the bottom where the "New Session" row appears
3. Locate the toggle button

**Expected:**
- [ ] Toggle is present in the table's new-session toolbar
- [ ] Same visual appearance as grid view
- [ ] Clicking updates state (and syncs with any grid cells if visible)
- [ ] State matches whatever was set in grid view

**Observations:**

---

### 6.3 — Sessions Tab Toolbar

**Action:**
1. Navigate to Sessions tab
2. Locate the toggle button in the session creation toolbar at the top

**Expected:**
- [ ] Toggle is visible in the toolbar (between "New session" button and provider picker)
- [ ] State matches Monitor view (same global `useWorktree` value)
- [ ] Clicking cycles through states
- [ ] Seg-btn sync works from this view too

**Observations:**

---

### 6.4 — Terminal Tab (Electron Only)

**Action:**
1. Navigate to Terminal tab
2. Observe empty terminal cells
3. Locate the toggle button in a cell's toolbar

**Expected:**
- [ ] Toggle is present in terminal empty cell toolbars
- [ ] State matches Monitor and Sessions views
- [ ] Clicking updates state and syncs across all terminal cells
- [ ] Toggle state persists when switching back to Monitor

**Observations:**

---

### 6.5 — Cross-View State Sync

**Action:**
1. Set toggle to "Override ON" on the Monitor tab
2. Switch to Sessions tab — check toggle state
3. Switch to Terminal tab — check toggle state
4. Set toggle to "Override OFF" on Terminal tab
5. Switch back to Monitor — check toggle state

**Expected:**
- [ ] State is consistent across all views at every step
- [ ] Changing the toggle on any view immediately reflects on all other views
- [ ] No stale state after tab switching

**Observations:**

---

### 6.6 — Session Launch from Different Views

**Action:** (If time permits — this is a longer test)
1. Set toggle to "Override ON"
2. Launch a session from Monitor grid — verify worktree created
3. Set toggle to "Override OFF"
4. Launch a session from Sessions tab — verify NO worktree
5. Set toggle to default
6. Launch a session from Terminal tab — verify matches project default

**Expected:**
- [ ] All three sessions respect the toggle state active at launch time
- [ ] Launching from any view uses the same `useWorktree` value

**Observations:**

---

## Pass/Fail Criteria

- **PASS:** Toggle appears in all 4 views, state is consistent, launches respect the toggle from any view
- **FAIL:** Toggle missing from a view, state desyncs between views, or launch behavior differs by view
