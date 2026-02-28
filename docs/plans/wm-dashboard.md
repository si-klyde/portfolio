# WM Dashboard Redesign

## Summary
Replace terminal output components inside WM windows with proper dashboard UI panels. 3 purposeful workspaces: personal info, GitHub-clone project browser, comments forum browser.

## New Workspace Layout

```
WS 1: ['about', 'skills', 'contact']  - master-stack (about=left, skills+contact=right)
WS 2: ['projects']                     - full screen GitHub clone
WS 3: ['comments']                     - full screen browser window
```

## New Files (create)
- `src/components/wm/panels/AboutPanel.tsx`
- `src/components/wm/panels/SkillsPanel.tsx`
- `src/components/wm/panels/ContactPanel.tsx`
- `src/components/wm/panels/ProjectsPanel.tsx`
- `src/components/wm/panels/CommentsPanel.tsx`

## Modified Files
- `src/components/wm/WindowManager.tsx` - new WINDOW_DEFS + INITIAL_WORKSPACES
- `src/wm.css` - append all panel styles

## Untouched
- Terminal output components (stay for terminal)
- Window.tsx, TilingLayout.tsx, Waybar.tsx, KeybindHint.tsx
- wm.ts types

---

## Panel Designs

### 1. AboutPanel (WS1 master pane, left, full height)

```
[profile.JPG - circle 80px, accent border]

Clyde Baclao
Software Engineer

---

Full-stack dev at Growgami...
Most of my time goes into...

---

strengths   TypeScript, React, Python
currently   building analytics & AI tools @ Growgami
values      keep it simple, ship it, make it work

---

> Linux ricing
> AI bots
> Open source
> Automation
> Coffee
```

- Profile image: circular, 80px, `object-fit: cover`, `border: 2px solid var(--accent)`
- Dividers: `border-top: 1px solid #222`
- Meta: 2-col label/value grid
- Likes: `>` prefix in accent color

### 2. SkillsPanel (WS1 top-right)

All 4 categories with pill tags. Hover shows "used in" tooltip.

```
FRONTEND
[React] [Next.js] [TypeScript] [Tailwind CSS] [GSAP] [Vite] [Framer Motion]

BACKEND & DATABASE
[Node.js] [Express] [FastAPI] [Python] [PostgreSQL] [Firebase] [Redis] [Supabase]

AI
[OpenAI API] [Pinecone] [LangChain] [Google Cloud]

TOOLS & INFRA
[Git] [Docker] [Linux] [Nginx] [PM2]
```

- Category names: uppercase, 11px, accent, letter-spacing
- Pills: `bg: #141414, border: #222, border-radius: 4px, 12px font`
- Hover pill: border goes accent, CSS tooltip below shows "used in: project1, project2"

### 3. ContactPanel (WS1 bottom-right)

```
EMAIL
kyleclydebaclao.work@gmail.com

GITHUB
si-klyde
collide-gg

LINKEDIN
kylecydebaclao

TWITTER
@vibes_collide

---
Metro Manila, Philippines
open to local & remote work  [green dot]
```

- Labels: uppercase, 11px, dim
- Values: links in green, open in new tab
- Footer: location + availability with green status dot

### 4. ProjectsPanel (WS2 full screen) - GitHub Clone

Fake GitHub UI. Repo list sidebar + repo detail main area. Internal state to switch repos.

```
+----------------------------------------------------+
| <- -> [refresh] | github.com/si-klyde              |  <- browser toolbar
|----------------------------------------------------|
| REPOSITORIES     |  si-klyde / iPeer       Public  |
|                  |                                  |
|  Hatch           |  Peer counseling app. Handles    |
|  CreatorBook     |  auth, booking, video calls,     |
|> iPeer           |  and email notifs. Built this     |
|  Onboarding Agent|  as capstone, led the team.      |
|  Meet Agent      |                                  |
|  Twitter Scraper |  Tech                            |
|                  |  [React] [Express] [Firebase]    |
|                  |  [Tailwind CSS]                  |
|                  |                                  |
|                  |  github.com/si-klyde/iPeer  ->   |
+----------------------------------------------------+
```

- Internal `useState` for selected project index (default 0)
- Browser toolbar: same style as comments browser (back/fwd/refresh + URL bar)
- URL bar updates to show selected project's GitHub URL or "private"
- Left sidebar: repo list, active item highlighted with accent left border
- Private repos show a lock icon (unicode)
- Main area: repo name + owner, visibility badge, description, tech pills, GitHub link

### 5. CommentsPanel (WS3 full screen) - Browser Window

```
+----------------------------------------------------+
| <- -> [refresh] | https://comments.clyde.dev       |
|----------------------------------------------------|
|                                                    |
|              no comments yet                       |
|              check back later                      |
|                                                    |
+----------------------------------------------------+
```

- Browser toolbar: back/fwd/refresh buttons (unicode, non-functional) + URL bar
- URL bar: `background: #111, border: #222, border-radius: 4px`
- Empty state: centered, dim text

---

## WindowManager.tsx Changes

```tsx
import AboutPanel from './panels/AboutPanel';
import SkillsPanel from './panels/SkillsPanel';
import ContactPanel from './panels/ContactPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import CommentsPanel from './panels/CommentsPanel';

const WINDOW_DEFS: WindowDef[] = [
  { id: 'about',    title: '~/about',              content: <AboutPanel /> },
  { id: 'skills',   title: '~/skills',             content: <SkillsPanel /> },
  { id: 'contact',  title: '~/contact',            content: <ContactPanel /> },
  { id: 'projects', title: '~/projects',           content: <ProjectsPanel /> },
  { id: 'comments', title: 'comments.clyde.dev',   content: <CommentsPanel /> },
];

const INITIAL_WORKSPACES: WorkspaceState[] = [
  { slots: ['about', 'skills', 'contact'], floating: [] },
  { slots: ['projects'],                   floating: [] },
  { slots: ['comments'],                   floating: [] },
];
```

## Implementation Steps

1. Create `src/components/wm/panels/` directory
2. Build AboutPanel
3. Build SkillsPanel (with hover tooltips)
4. Build ContactPanel
5. Build ProjectsPanel (GitHub clone with repo switching)
6. Build CommentsPanel (browser chrome)
7. Update WindowManager.tsx (imports, WINDOW_DEFS, INITIAL_WORKSPACES)
8. Append all panel CSS to wm.css
9. Verify: all 3 workspaces render, keyboard nav works, mobile fallback works, build passes
