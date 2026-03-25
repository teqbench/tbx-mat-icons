# @teqbench/tbx-mat-icons

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-icons-main-build-number.json)

> Abstract icon service contracts for Angular Material. Provides `SvgIconService` for inline SVG registration via `MatIconRegistry` and `FontIconService` for font ligature resolution. Both are generic abstract classes — concrete implementations map domain keys to icon names.

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
import { SvgIconService, FontIconService } from '@teqbench/tbx-mat-icons';

// Extend SvgIconService to register inline SVG icons with MatIconRegistry:
@Injectable({ providedIn: 'root' })
export class BrandSvgIconService extends SvgIconService<BrandIcon> {
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

// Extend FontIconService to resolve font ligature names:
@Injectable({ providedIn: 'root' })
export class SeverityFontIconService extends FontIconService<Severity> {
    constructor() {
        super('Material Symbols Rounded');
    }

    resolve(name: Severity): string | undefined;
    resolve(name: string): string | undefined;
    resolve(name: string): string | undefined {
        return SEVERITY_LIGATURES.get(name);
    }
}
```

## API Reference

### `SvgIconService<T extends string = string>`

Abstract base class for SVG-based icon services. Encapsulates `MatIconRegistry` + `DomSanitizer` plumbing.

- **`protected register(name: T, svg: string): void`** — Register inline SVG markup with the Material icon registry.
- **`abstract resolve(name: T): string | undefined`** — Resolve a key to a registered `svgIcon` name.

### `FontIconService<T extends string = string>`

Abstract base class for font-based icon services. Carries the font set identifier and the resolve contract.

- **`readonly fontSet: string`** — The icon font set this service resolves against.
- **`abstract resolve(name: T): string | undefined`** — Resolve a key to a font ligature name.

## Compatibility

| Dependency       | Version  |
| ---------------- | -------- |
| Angular          | ^21.0.0  |
| Angular Material | ^21.0.0  |
| TypeScript       | ~5.9.0   |
| Node.js          | >=24.0.0 |

## License

[Apache-2.0](LICENSE) — Copyright 2025 TeqBench
