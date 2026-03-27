# @teqbench/tbx-mat-icons

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-number.json)

> Abstract icon service contracts for Angular Material. Provides `TbxMatSvgIconService` for inline SVG registration via `MatIconRegistry` and `TbxMatFontIconService` for font ligature resolution. Both are generic abstract classes — concrete implementations map domain keys to icon names.

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

```typescript
import {
    TbxMatSvgIconService,
    TbxMatFontIconService,
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
} from '@teqbench/tbx-mat-icons';

// Extend TbxMatSvgIconService to register inline SVG icons with MatIconRegistry:
@Injectable({ providedIn: 'root' })
export class BrandSvgIconService extends TbxMatSvgIconService<BrandIcon> {
    constructor() {
        super();
        this.register(BrandIcon.Logo, '<svg>…</svg>');
    }

    resolve(name: BrandIcon): string | undefined;
    resolve(name: string): string | undefined;
    resolve(name: string): string | undefined {
        return this.icons.get(name);
    }
}

// Extend TbxMatFontIconService to resolve font ligature names.
// Option 1: Set the font set application-wide via the injection token:
// (in app.config.ts)
// { provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED }

enum Severity {
    Success = 'success',
    Error = 'error',
}

const SEVERITY_LIGATURES = new Map<string, string>([
    [Severity.Success, 'check_circle'],
    [Severity.Error, 'cancel'],
]);

@Injectable({ providedIn: 'root' })
export class SeverityFontIconService extends TbxMatFontIconService<Severity> {
    // Option 2: Pass the font set explicitly per subclass in the constructor; if use Option 1, this is not necessary.
    constructor() {
        super(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED);
    }

    resolve(name: Severity): string | undefined;
    resolve(name: string): string | undefined;
    resolve(name: string): string | undefined {
        return SEVERITY_LIGATURES.get(name);
    }
}
```

## API Reference

### `TbxMatSvgIconService<T extends string = string>`

Abstract base class for SVG-based icon services. Encapsulates `MatIconRegistry` + `DomSanitizer` plumbing.

- **`protected register(name: T, svg: string): void`** — Register inline SVG markup with the Material icon registry.
- **`abstract resolve(name: T): string | undefined`** — Resolve a key to a registered `svgIcon` name.

### `TbxMatFontIconService<T extends string = string>`

Abstract base class for font-based icon services. Carries the font set identifier and the resolve contract.

- **`readonly fontSet: string`** — The icon font set this service resolves against (set via constructor or `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token).
- **`abstract resolve(name: T): string | undefined`** — Resolve a key to a font ligature name.

### `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`

`InjectionToken<string>` — Provide at the application level to set a default font set for all `TbxMatFontIconService` subclasses that don't pass one to `super()`.

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
