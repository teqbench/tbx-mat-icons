# @teqbench/tbx-mat-icons

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-number.json)

> Abstract icon service contracts for [Angular Material ↗](https://material.angular.dev) — a generic `TbxMatIconService` base plus two strategy subclasses (`TbxMatSvgIconService` for inline SVG via [MatIconRegistry ↗](https://material.angular.dev/components/icon/api) and `TbxMatFontIconService` for font ligature resolution) that consumers extend to register typed icon keys.

<details>
<summary><strong>Table of contents</strong></summary>

- [Overview](#overview)
- [At a glance](#at-a-glance)
- [When to use](#when-to-use)
- [Installation](#installation)
- [Usage](#usage)
- [Concepts](#concepts)
- [API Reference](#api-reference)
- [Material Symbols Variable Font Axes](#material-symbols-variable-font-axes)
- [Accessibility](#accessibility)
- [Compatibility](#compatibility)
- [Related packages](#related-packages)
- [Versioning & releases](#versioning--releases)
- [Contributing](#contributing)
- [Security](#security)
- [Feedback](#feedback)
- [License](#license)

</details>

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

## At a glance

- **Abstract-base service pattern** — three generic abstract classes (base, SVG, font) that consumers extend to register typed icon keys with ~10 lines of subclass code.
- **SVG rendering strategy** — `TbxMatSvgIconService` registers raw SVG markup with [Angular Material's ↗](https://material.angular.dev) `MatIconRegistry` for rendering via the `<mat-icon [svgIcon]>` binding.
- **Font rendering strategy** — `TbxMatFontIconService` maps keys to ligature names and resolves a `fontSet` for rendering via `<mat-icon>` text content with an optional `[fontSet]` binding.
- **Strategy discriminant** — both services expose an `iconType` property (`Font` or `Svg`) so consumers can branch on rendering strategy at runtime without coupling to implementation details.
- **Compile-time-safe icon keys** — services are generic over `T extends string`; use an enum or union for typed keys with compile-time protection against typos in `register()` and `resolve()`.
- **Three-step fontSet cascade** — constructor argument → `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token → `MAT_ICON_DEFAULT_OPTIONS` — pick whichever matches your setup without ambiguity.
- **Bundled Material Symbols constants** — three `fontSet` constants (rounded, outlined, sharp) for the common [Material Symbols ↗](https://fonts.google.com/icons) variants that Google ships, so consumers avoid magic strings.
- **Override-friendly registration** — `register()` replaces any previous mapping, so subclasses can override parent defaults; call `initialize()` again to restore the default set.

## When to use

Use `@teqbench/tbx-mat-icons` any time you need a typed, DI-friendly icon service in an [Angular Material ↗](https://material.angular.dev) application — either for your own application's icons, or as the foundation for a distributable icon package (like `@teqbench/tbx-mat-severity-icons`).

Do not use it for:

- **Ad-hoc `<mat-icon>` usage** — if you just need a handful of icons referenced by ligature name in a template, use `<mat-icon>` directly. This package is for cases where an enum-keyed service makes sense.
- **Non-Angular projects** — this package depends on [Angular Material ↗](https://material.angular.dev) and `MatIconRegistry`.
- **Runtime icon downloads** — the services register icons upfront via subclass `initialize()`. For dynamic icon sources, build directly against `MatIconRegistry`.

## Installation

Configure [npm ↗](https://www.npmjs.com/) to use [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/tbx-mat-icons
```

## Usage

### SVG Icons

```typescript
import { Injectable } from '@angular/core';
import { TbxMatSvgIconService } from '@teqbench/tbx-mat-icons';

enum BrandIcon {
    Logo = 'logo',
    Wordmark = 'wordmark',
}

const BRAND_SVG: Record<BrandIcon, string> = {
    [BrandIcon.Logo]: '<svg>…</svg>',
    [BrandIcon.Wordmark]: '<svg>…</svg>',
};

@Injectable({ providedIn: 'root' })
export class BrandSvgIconService extends TbxMatSvgIconService<BrandIcon> {
    protected override initialize(): void {
        super.initialize();
        for (const [name, svg] of Object.entries(BRAND_SVG)) {
            this.register(name, svg);
        }
    }
}
// resolve(BrandIcon.Logo) → 'logo'
```

Consuming component uses the `svgIcon` binding:

```typescript
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrandSvgIconService, BrandIcon } from './brand-svg-icon.service';

@Component({
    selector: 'app-brand',
    imports: [MatIconModule],
    template: `<mat-icon [svgIcon]="icons.resolve(BrandIcon.Logo)!"></mat-icon>`,
})
export class BrandComponent {
    protected readonly icons = inject(BrandSvgIconService);
    protected readonly BrandIcon = BrandIcon;
}
```

### Font Icons

`TbxMatFontIconService` resolves its `fontSet` through a precedence chain:

1. **Explicit constructor argument** — `super('material-symbols-sharp')`
2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`
3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** — [Angular Material's ↗](https://material.angular.dev) global icon default
4. **Error** — if none of the above provides a fontSet

For steps 1 and 2, the consuming component must bind `[fontSet]="icons.fontSet"` on `<mat-icon>` so the icon renders with the correct font family. For step 3, `<mat-icon>` already uses the global default — no binding needed.

#### Step 1: Explicit fontSet via constructor

The service uses a specific fontSet regardless of any global configuration.

```typescript
import { Injectable } from '@angular/core';
import { TbxMatFontIconService, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP } from '@teqbench/tbx-mat-icons';

enum Severity {
    Success = 'success',
    Error = 'error',
}

const LIGATURES: Record<Severity, string> = {
    [Severity.Success]: 'check_circle',
    [Severity.Error]: 'cancel',
};

@Injectable({ providedIn: 'root' })
export class SharpIconService extends TbxMatFontIconService<Severity> {
    constructor() {
        super(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP);
    }

    protected override initialize(): void {
        super.initialize();
        for (const [name, ligature] of Object.entries(LIGATURES)) {
            this.register(name, ligature);
        }
    }
}
// resolve(Severity.Success) → 'check_circle'
```

Consuming component injects the service and binds `[fontSet]`:

```typescript
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SharpIconService } from './sharp-icon.service';
import { Severity } from './severity.enum';

@Component({
    selector: 'app-status',
    imports: [MatIconModule],
    template: `<mat-icon [fontSet]="icons.fontSet">{{ icons.resolve(severity) }}</mat-icon>`,
})
export class StatusComponent {
    protected readonly icons = inject(SharpIconService);
    protected readonly severity = Severity.Success; // or from a signal, input, etc.
}
```

#### Step 2: fontSet from `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token

All subclasses that call `super()` without an argument inherit this value.

```typescript
// app.config.ts
import {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
} from '@teqbench/tbx-mat-icons';

providers: [{ provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED }];
```

```typescript
@Injectable({ providedIn: 'root' })
export class MySeverityIconService extends TbxMatFontIconService<Severity> {
    protected override initialize(): void {
        super.initialize();
        for (const [name, ligature] of Object.entries(LIGATURES)) {
            this.register(name, ligature);
        }
    }
}
```

Consuming component injects the service and binds `[fontSet]`:

```typescript
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MySeverityIconService } from './my-severity-icon.service';
import { Severity } from './severity.enum';

@Component({
    selector: 'app-status',
    imports: [MatIconModule],
    template: `<mat-icon [fontSet]="icons.fontSet">{{ icons.resolve(severity) }}</mat-icon>`,
})
export class StatusComponent {
    protected readonly icons = inject(MySeverityIconService);
    protected readonly severity = Severity.Success; // or from a signal, input, etc.
}
```

#### Step 3: fontSet from `MAT_ICON_DEFAULT_OPTIONS`

When the global [Angular Material ↗](https://material.angular.dev) icon options already configure the fontSet, the service picks it up automatically.

```typescript
// app.config.ts
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';

providers: [{ provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } }];
```

```typescript
@Injectable({ providedIn: 'root' })
export class MySeverityIconService extends TbxMatFontIconService<Severity> {
    protected override initialize(): void {
        super.initialize();
        for (const [name, ligature] of Object.entries(LIGATURES)) {
            this.register(name, ligature);
        }
    }
}
```

Consuming component injects the service — no `[fontSet]` binding needed:

```typescript
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MySeverityIconService } from './my-severity-icon.service';
import { Severity } from './severity.enum';

@Component({
    selector: 'app-status',
    imports: [MatIconModule],
    template: `<mat-icon>{{ icons.resolve(severity) }}</mat-icon>`,
})
export class StatusComponent {
    protected readonly icons = inject(MySeverityIconService);
    protected readonly severity = Severity.Success; // or from a signal, input, etc.
}
```

## Concepts

- **Icon key** — the domain-specific name a consumer registers and resolves icons by; typically a value from an enum or string-union type.
- **Rendering strategy** — how the resolved icon value is drawn: either SVG (inline markup via `MatIconRegistry`) or font (ligature name in a specific `fontSet`).
- **`iconType` discriminant** — the readonly `Font` or `Svg` value on every icon service that tells consumers which [Angular Material ↗](https://material.angular.dev) binding to use at the call site.
- **Ligature** — a named glyph inside an icon font (e.g. `check_circle`) that renders when the font is applied and the name is placed as text content.
- **`fontSet`** — the CSS `font-family` identifier for an icon font (e.g. `material-symbols-rounded`); the font the ligature is drawn from.
- **`fontSet` cascade** — the three-step precedence for resolving a font service's `fontSet`: constructor argument, then `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token, then `MAT_ICON_DEFAULT_OPTIONS`.
- **`MatIconRegistry`** — [Angular Material's ↗](https://material.angular.dev) shared registry that maps `svgIcon` names to inline SVG markup and is accessed by `<mat-icon>` when rendering via the `[svgIcon]` binding.
- **Subclass `initialize()`** — the protected hook consumers override in concrete icon services to populate the registry via `register()` calls; invoked once from the base-class constructor.

## API Reference

### `TbxMatIconType`

Enum discriminant for the icon rendering strategy. Used by consumers to determine the correct `<mat-icon>` binding.

- **`TbxMatIconType.Font`** (`'font'`) — render as font ligature text content
- **`TbxMatIconType.Svg`** (`'svg'`) — render via `[svgIcon]` binding

### `TbxMatIconResolver<T extends string = string>`

Contract for resolving icon keys to usable icon identifiers. Implemented by `TbxMatIconService` and inherited by both service subclasses.

- **`resolve(name: T): string | undefined`** — Resolve an icon key to an icon identifier (font ligature name or registered svgIcon name). Returns `undefined` if the key is not recognized.

### `TbxMatIconService<T extends string = string>`

Abstract base class providing shared registration and resolution mechanics. Do not extend directly — use `TbxMatSvgIconService` or `TbxMatFontIconService`.

- **`abstract readonly iconType: TbxMatIconType`** — Discriminant set by each intermediate class (`Font` or `Svg`). Consumers use this to determine the correct `<mat-icon>` binding.
- **`protected initialize(): void`** — Initialize the registry with default icon mappings. Called from the constructor of each intermediate class. Subclasses override to register defaults via `register()`. Call again later to restore defaults after replacements.
- **`protected reset(): void`** — Clear all registered icons from the registry.
- **`protected register(name: T, value: string): void`** — Register an icon name and its resolved value. Re-registering the same name replaces the previous value, allowing subclasses to override parent defaults.
- **`resolve(name: T): string | undefined`** — Look up the value registered for the given name.

### `TbxMatSvgIconService<T extends string = string>`

Abstract base class for SVG-based icon services. Extends `TbxMatIconService` with `MatIconRegistry` + `DomSanitizer` integration. Sets `iconType` to `TbxMatIconType.Svg`.

- **`protected register(name: T, svg: string): void`** — Register inline SVG markup with the [Angular Material ↗](https://material.angular.dev) icon registry. The base class stores `name → name` (identity mapping); the SVG markup is stored by `MatIconRegistry`. Re-registering replaces both entries.
- Inherits `resolve()` from `TbxMatIconService` — returns the icon name for use in `[svgIcon]="name"`.

### `TbxMatFontIconService<T extends string = string>`

Abstract base class for font-based icon services. Extends `TbxMatIconService` with fontSet resolution. Sets `iconType` to `TbxMatIconType.Font`.

- **`readonly fontSet: string`** — The fontSet this service resolves against (set via constructor, `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token, or `MAT_ICON_DEFAULT_OPTIONS`).
- Inherits `register()` and `resolve()` from `TbxMatIconService` — register domain keys mapped to font ligature names.

### `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`

`InjectionToken<string>` — Provide at the application level to set a default fontSet for all `TbxMatFontIconService` subclasses that don't pass one to `super()`. Takes precedence over `MAT_ICON_DEFAULT_OPTIONS.fontSet`.

### Font Set Constants

- **`TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED`** — `'material-symbols-rounded'`
- **`TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_OUTLINED`** — `'material-symbols-outlined'`
- **`TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP`** — `'material-symbols-sharp'`

## Material Symbols Variable Font Axes

[Material Symbols ↗](https://fonts.google.com/icons) are variable fonts that expose four CSS axes via `font-variation-settings`. These axes give fine-grained control over icon appearance without switching font files or adding extra CSS classes. All four axes must be specified together — omitting an axis resets it to the font default.

```css
.material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

### Axis reference

| Axis   | Range   | Default | Description                                                                                                     |
| ------ | ------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| `FILL` | 0‑1     | 0       | Outlined (0) or filled (1). A single icon renders both states — no separate icon set needed.                    |
| `wght` | 100‑700 | 400     | Stroke weight. Higher values produce bolder icons for visual emphasis and hierarchy.                            |
| `GRAD` | ‑50‑200 | 0       | Grade. Fine-grained weight adjustment without changing icon size. Works across text and icons for visual unity. |
| `opsz` | 20‑48   | 48      | Optical size. Automatically adjusts stroke weight at different display sizes for consistent appearance.         |

### FILL — outlined vs filled

The fill axis toggles between outlined and filled rendering. Use it to convey state transitions (e.g., inactive to active, default to selected) through animation or interaction.

```css
/* Outlined (default) */
.material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}

/* Filled */
.material-symbols-rounded {
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}

/* Animate from outlined to filled */
@keyframes icon-fill {
    from {
        font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
    to {
        font-variation-settings:
            'FILL' 1,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
}

.material-symbols-rounded {
    animation: icon-fill 0.3s ease-in-out forwards;
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

### wght — weight

Controls stroke thickness. Use lower values (100–300) for secondary or decorative icons and higher values (500–700) for emphasis or primary actions.

```css
/* Thin (100) */
.material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 100,
        'GRAD' 0,
        'opsz' 24;
}

/* Bold (700) */
.material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 700,
        'GRAD' 0,
        'opsz' 24;
}
```

### GRAD — grade

Adjusts apparent weight more subtly than `wght`, without changing the icon's overall size or layout. Useful for:

- **Low emphasis (-25):** reduce glare for light icons on dark backgrounds
- **High emphasis (200):** increase prominence without affecting surrounding layout

```css
/* Reduce glare on dark backgrounds */
.dark-theme .material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' -25,
        'opsz' 24;
}

/* High emphasis */
.material-symbols-rounded.emphasized {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 200,
        'opsz' 24;
}
```

### opsz — optical size

Matches stroke weight to the icon's display size. Smaller optical sizes (20) produce thicker strokes so icons remain legible at small sizes. Larger values (48) produce thinner, more detailed strokes for display-size icons.

```css
/* Small icon (e.g., inline with body text) */
.material-symbols-rounded.sm {
    font-size: 20px;
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 20;
}

/* Large icon (e.g., hero or empty state) */
.material-symbols-rounded.lg {
    font-size: 48px;
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48;
}
```

### Loading the variable font

Include the font via Google Fonts with the full axis range to enable all customizations:

```html
<link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    rel="stylesheet"
/>
```

Replace `Rounded` with `Outlined` or `Sharp` to match the font set used in your application.

## Accessibility

Not applicable — abstract service contracts, no UI surface. Consumers that render `<mat-icon>` with the values produced by these services are responsible for pairing each icon with an accessible label (either via adjacent text, `aria-label`, or `aria-hidden="true"` when the icon is decorative).

## Compatibility

| Dependency                                                             | Version  |
| ---------------------------------------------------------------------- | -------- |
| [Angular ↗](https://angular.dev)                                       | ^21.0.0  |
| [Angular Material ↗](https://material.angular.dev)                     | ^21.0.0  |
| [Angular Platform Browser ↗](https://angular.dev/api/platform-browser) | ^21.0.0  |
| [TypeScript ↗](https://www.typescriptlang.org)                         | ~5.9.0   |
| [Node.js ↗](https://nodejs.org)                                        | >=24.0.0 |

## Related packages

- [`@teqbench/tbx-mat-severity-icons` ↗](https://github.com/teqbench/tbx-mat-severity-icons) — severity-leveled icon resolver built on this package's service contracts.
- [`@teqbench/tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) — banner component and service using severity icons from this package.
- [`@teqbench/tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — notification service using severity icons from this package.

## Versioning & releases

This package follows [Semantic Versioning ↗](https://semver.org/). Versions and changelog entries are produced automatically by [Release Please ↗](https://github.com/googleapis/release-please) from [Conventional Commits ↗](https://www.conventionalcommits.org/) on `main`. See [CHANGELOG.md](CHANGELOG.md) for the full release history.

## Contributing

Contributions are welcome. See the [contributing guide ↗](https://github.com/teqbench/.github/blob/main/CONTRIBUTING.md) for local setup, [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) authentication, branch conventions, commit format, and the PR workflow.

## Security

See the [security policy ↗](https://github.com/teqbench/.github/blob/main/SECURITY.md) for the supported-version policy and how to report a vulnerability privately.

## Feedback

- [Report a bug ↗](https://github.com/teqbench/tbx-mat-icons/issues/new?template=bug_report.md)
- [Request a feature ↗](https://github.com/teqbench/tbx-mat-icons/issues/new?template=feature_request.md)

## License

[AGPL-3.0](LICENSE) — Copyright 2026 TeqBench
