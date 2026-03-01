# Portfolio

A terminal + tiling window manager portfolio site. Type commands or navigate workspaces with keybinds.

**[si-klyde.github.io/portfolio](https://si-klyde.github.io/portfolio)**

---

## Stack

`React` `TypeScript` `Vite` `GSAP`

## Features

**Terminal** — command-line interface with sidebar, autocomplete, and commands like `about`, `skills`, `experience`, `work`, `contact`

**Window Manager** — Hyprland-inspired tiling WM with 3 workspaces:
- **ws1** — profile, experience, skills, contact (WM-native components, 2x2 grid)
- **ws2** — GitHub project browser with repo detail pages
- **ws3** — forum/comments browser

**Keybinds** — `1/2/3` switch workspace, arrows move focus, `shift+arrows` swap windows, `f` float, `Q` exit

## Structure

```
src/
├── components/
│   ├── terminal/       # CLI, command outputs, sidebar
│   └── wm/             # window manager, tiling, waybar, browsers
├── commands/            # command registry
├── data/                # JSON data (about, skills, experience, contact, projects)
├── terminal.css
├── wm.css
└── browser.css
```

## Dev

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run deploy    # build + push to gh-pages
```

---

Built by [Clyde](https://github.com/si-klyde)
