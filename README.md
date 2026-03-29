# @teqbench/tbx-mat-icons

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-number.json)

> Abstract icon service contracts for Angular Material projects. Provides `TbxMatBaseIconService` as the shared registration/resolution base, `TbxMatSvgIconService` for inline SVG registration via `MatIconRegistry`, and `TbxMatFontIconService` for font ligature resolution. All are generic abstract classes — concrete implementations override `initialize()` to register domain keys and their resolved values.

## Installation

Configure npm to use GitHub Packages for the `@teqbench` scope:

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
3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** — Angular Material's global icon default
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

When the global Material icon options already configure the fontSet, the service picks it up automatically.

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

## API Reference

### `ITbxMatIconResolver<T extends string = string>`

Contract for resolving icon keys to usable icon identifiers. Implemented by `TbxMatBaseIconService` and inherited by both service subclasses.

- **`resolve(name: T): string | undefined`** — Resolve an icon key to an icon identifier (font ligature name or registered svgIcon name). Returns `undefined` if the key is not recognized.

### `TbxMatBaseIconService<T extends string = string>`

Abstract base class providing shared registration and resolution mechanics. Do not extend directly — use `TbxMatSvgIconService` or `TbxMatFontIconService`.

- **`protected initialize(): void`** — Initialize the registry with default icon mappings. Called from the constructor of each intermediate class. Subclasses override to register defaults via `register()`. Call again later to restore defaults after replacements.
- **`protected reset(): void`** — Clear all registered icons from the registry.
- **`protected register(name: T, value: string): void`** — Register an icon name and its resolved value. Re-registering the same name replaces the previous value, allowing subclasses to override parent defaults.
- **`resolve(name: T): string | undefined`** — Look up the value registered for the given name.

### `TbxMatSvgIconService<T extends string = string>`

Abstract base class for SVG-based icon services. Extends `TbxMatBaseIconService` with `MatIconRegistry` + `DomSanitizer` integration.

- **`protected register(name: T, svg: string): void`** — Register inline SVG markup with the Material icon registry. The base class stores `name → name` (identity mapping); the SVG markup is stored by `MatIconRegistry`. Re-registering replaces both entries.
- Inherits `resolve()` from `TbxMatBaseIconService` — returns the icon name for use in `[svgIcon]="name"`.

### `TbxMatFontIconService<T extends string = string>`

Abstract base class for font-based icon services. Extends `TbxMatBaseIconService` with fontSet resolution.

- **`readonly fontSet: string`** — The fontSet this service resolves against (set via constructor, `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token, or `MAT_ICON_DEFAULT_OPTIONS`).
- Inherits `register()` and `resolve()` from `TbxMatBaseIconService` — register domain keys mapped to font ligature names.

### `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`

`InjectionToken<string>` — Provide at the application level to set a default fontSet for all `TbxMatFontIconService` subclasses that don't pass one to `super()`. Takes precedence over `MAT_ICON_DEFAULT_OPTIONS.fontSet`.

### Font Set Constants

- **`TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED`** — `'material-symbols-rounded'`
- **`TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_OUTLINED`** — `'material-symbols-outlined'`
- **`TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP`** — `'material-symbols-sharp'`

## Compatibility

| Dependency       | Version  |
| ---------------- | -------- |
| Angular          | ^21.0.0  |
| Angular Material | ^21.0.0  |
| TypeScript       | ~5.9.0   |
| Node.js          | >=24.0.0 |

## License

[Apache-2.0](LICENSE) — Copyright 2025 TeqBench
