# Bob Review Fixes

## BLOCKERS

### 1. Delete dead `.gh-star-btn` CSS
- File: `src/browser.css:380-395`
- Action: remove the entire rule block

### 2. Fix `urlParts.slice(0,1).join('/')` → `urlParts[0]`
- File: `src/components/wm/BrowserChrome.tsx:13`
- Action: `const domain = urlParts[0]`

### 3. Fix HTML entity props not rendering
- `GitHubBrowser.tsx:27,82` — `tabFavicon="&#9783;"` → `tabFavicon={'\u2637'}`
- `ForumBrowser.tsx:8` — `tabFavicon="&#129302;"` → `tabFavicon={'\u{1F916}'}`

## SUGGESTIONS

### 4. Fix `.browser-chrome` background color
- File: `src/browser.css:9`
- Change `background: #0d1117` → `background: #202124` (Chrome frame color, not GitHub canvas)

### 5. DRY: merge `.gh-tab` + `.gh-detail-tab`
- Rename both to shared `.gh-tab` base
- Detail tabs already inside `.gh-detail-tabs` container — use that for scoping if needed
- Remove duplicate `.gh-detail-tab` / `.gh-detail-tab.active` rules
- Update `GitHubBrowser.tsx` detail view markup: change `gh-detail-tab` → `gh-tab`

### 6. DRY: merge `.gh-repo-visibility` + `.gh-visibility-badge`
- Keep `.gh-visibility-badge` as the single class
- Update list view markup: `gh-repo-visibility` → `gh-visibility-badge`
- Delete `.gh-repo-visibility` rule from CSS

### 7. Extract shared `Project` type from `GitHubBrowser.tsx`
- `WorkOutput.tsx` already defines `Project` interface locally
- Move to `src/types/project.ts`, import in both files
- Delete local `Project` + `typed` cast from `WorkOutput.tsx`

### 8. Skip keyboard nav fix
- Out of scope for this PR — decorative browser windows don't need keyboard nav
- Can address in a follow-up if needed

## NITS

### 9. Remove `gap: 0` declarations
- `browser.css` lines with `gap: 0` — delete them (3 occurrences)

### 10. Fix `forum-divider` fragility
- Change `<div className="forum-divider" />` → `<hr className="forum-divider" />`

### 11. Add comment for `740px` max-width
- Add `/* matches Reddit's feed max-width */` above `.forum-feed`

## SKIP

- `package-lock.json` peer changes — don't stage lockfile per CLAUDE.md rules

## Order
1 → 2 → 3 → 4 → 5 → 6 → 7 → 9 → 10 → 11 → verify build
