# Components

This folder follows a lightweight atomic design structure. Keep imports direct
from the file that owns the component, and avoid component barrel files.

## Atoms

Atoms are the smallest reusable UI pieces. They should not know about app data
models or route state.

Examples: `atoms/Button`, `atoms/Input`, `atoms/Tag`, `atoms/IconBadge`.

## Molecules

Molecules combine atoms or small markup into a single reusable interaction or
visual pattern. They can accept callbacks, but they should not own page-level
state.

Examples: `molecules/SearchField`, `molecules/TagFilter`,
`molecules/StatPill`, `molecules/ImageAuthor`.

## Organisms

Organisms are feature-level UI blocks. They can use app schemas, framework
components, hooks, and multiple molecules.

Examples: `organisms/Header`, `organisms/LoginForm`,
`organisms/PersonalInfoHero`, `organisms/ImageCard`,
`organisms/ImageGallery`, `organisms/ImageDetailModal`.

## Templates

Templates compose organisms into route-sized layouts. Put state here when it
belongs to the page experience rather than to a reusable organism.

Examples: `templates/HomeFeed`, `templates/AdminLoginPanel`.

## Rules Of Thumb

- Prefer direct imports such as `@/components/atoms/Button`.
- Keep route files thin; route-specific composition belongs in templates.
- Keep atoms visually reusable and free of route or schema knowledge.
- Add `"use client"` only where a component owns hooks, router APIs, or browser
  effects. Components imported by a client parent can stay server-compatible if
  they do not need their own client boundary.
- Prefer semantic Tailwind tokens already used in this app, such as
  `bg-surface`, `text-foreground`, and `text-primary`.
