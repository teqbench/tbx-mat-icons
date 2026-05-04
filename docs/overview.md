---
tagline: Abstract icon service contracts for [Angular Material ↗](https://material.angular.dev) — a generic TbxMatIconService base plus two strategy subclasses (TbxMatSvgIconService for inline SVG via [MatIconRegistry ↗](https://material.angular.dev/components/icon/api) and TbxMatFontIconService for font ligature resolution) that consumers extend to register typed icon keys.
---

## Overview

`@teqbench/tbx-mat-icons` provides the abstract service contracts that every other `@teqbench` package uses to register and resolve icons. It is not a runtime library of icons — it is a service pattern. Consumers subclass one of the two concrete strategies (SVG or font) and override `initialize()` to register the icon keys they need, producing a typed, DI-friendly service that the rest of the application can inject and call `resolve(key)` on.

The abstract design is deliberate: icon registration is inherently per-application domain work (what icons does this app need, mapped to what keys), but the _mechanics_ of registration, resolution, default fontSet cascading, and integration with [Angular Material's ↗](https://material.angular.dev) `MatIconRegistry` are identical across every such service. By shipping the mechanics as reusable abstract bases and leaving the domain registration to subclasses, applications get a typed icon service with ~10 lines of subclass code.

### Two rendering strategies

The package supports two icon rendering strategies in parallel, each backed by a dedicated abstract base:

- **SVG strategy** — `TbxMatSvgIconService` registers raw SVG markup with [Angular Material's ↗](https://material.angular.dev) `MatIconRegistry` via the integrated `DomSanitizer`. Consumers bind `<mat-icon [svgIcon]="service.resolve(key)">`. Good for custom-designed brand icons, icon sprites, or any case where font-based rendering isn't an option.
- **Font strategy** — `TbxMatFontIconService` registers ligature name mappings (e.g. `Severity.Success → 'check_circle'`) and resolves a fontSet from a three-step precedence chain (constructor argument → `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token → `MAT_ICON_DEFAULT_OPTIONS`). Consumers bind `<mat-icon [fontSet]="service.fontSet">{{ service.resolve(key) }}</mat-icon>`. Good for [Material Symbols ↗](https://fonts.google.com/icons) and any other icon font.

Both strategies share `TbxMatIconService` as their common base — it owns the registration map, the `register()` / `resolve()` / `reset()` methods, and the `iconType` discriminant that lets consumers branch on rendering strategy at runtime without coupling to implementation details. A single typed service can therefore be consumed polymorphically: `iconType === 'svg'` → use `[svgIcon]`; `iconType === 'font'` → use text-content + optional `[fontSet]`.

### Generic typing

The abstract services are generic over `T extends string`. Consumers that want compile-time safety on icon keys declare their service with an enum or union type as `T`:

```typescript
enum Severity { Success = 'success', Error = 'error' }
class SeverityIconService extends TbxMatFontIconService<Severity> { … }
// service.resolve('typo') → TypeScript error
// service.resolve(Severity.Success) → 'check_circle'
```

Consumers happy with plain strings can omit the generic and get `T = string`. The generic flows through `register()` so the same compile-time constraint applies when populating the registry — you cannot accidentally register an unknown key.

### Default fontSet cascade

Font icons need to know which font family to render with. The three-step cascade is designed to satisfy three common setups without ambiguity:

1. **Per-service**: pass a fontSet string to `super()` in the subclass constructor. Scoped to that one service.
2. **Application-wide tbx default**: provide `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` in `app.config.ts`. All `TbxMatFontIconService` subclasses that don't pass a constructor argument inherit it.
3. **Angular Material-wide default**: provide `MAT_ICON_DEFAULT_OPTIONS` with a `fontSet`. [Angular Material's ↗](https://material.angular.dev) `<mat-icon>` already uses this as its global default, so the service picks up the same value and consumers don't need to bind `[fontSet]`.

Step 3 is the minimal-setup path (no binding, no token); step 1 is the explicit per-service override; step 2 is the escape hatch when you want tbx services on a different fontSet than the rest of `<mat-icon>` usage.

## When to use

Use `@teqbench/tbx-mat-icons` any time you need a typed, DI-friendly icon service in an [Angular Material ↗](https://material.angular.dev) application — either for your own application's icons, or as the foundation for a distributable icon package (like `@teqbench/tbx-mat-severity-icons`).

Do not use it for:

- **Ad-hoc `<mat-icon>` usage** — if you just need a handful of icons referenced by ligature name in a template, use `<mat-icon>` directly. This package is for cases where an enum-keyed service makes sense.
- **Non-Angular projects** — this package depends on [Angular Material ↗](https://material.angular.dev) and `MatIconRegistry`.
- **Runtime icon downloads** — the services register icons upfront via subclass `initialize()`. For dynamic icon sources, build directly against `MatIconRegistry`.
