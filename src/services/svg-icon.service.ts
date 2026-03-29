import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TbxMatBaseIconService } from './base-icon.service';

/**
 * Abstract base class for SVG-based icon services.
 *
 * Extends {@link TbxMatBaseIconService} with Angular Material's
 * `MatIconRegistry` and `DomSanitizer` integration. Subclasses call the
 * protected `register()` method with a name and SVG markup string —
 * they never interact with `MatIconRegistry` or `DomSanitizer` directly.
 *
 * Once registered, icons are available in templates via
 * `<mat-icon [svgIcon]="name">`.
 *
 * ### How registration works
 *
 * `register(name, svg)` does two things:
 *
 * 1. Passes `name, name` to the base class — the resolved value for an
 *    SVG icon is the icon name itself (used in the `[svgIcon]` binding),
 *    not the SVG markup.
 * 2. Registers the SVG markup with `MatIconRegistry` via
 *    `addSvgIconLiteral()`, sanitized through `DomSanitizer`.
 *
 * Duplicate registrations for the same name are silently ignored by the
 * base class, so `MatIconRegistry` is only called once per name.
 *
 * This is the SVG counterpart to {@link TbxMatFontIconService}. Font
 * services map domain keys to ligature names; SVG services register
 * inline SVG markup with the Material icon registry.
 *
 * @example Extending for a custom SVG icon set:
 * ```typescript
 * enum BrandIcon {
 *     Logo = 'logo',
 *     Wordmark = 'wordmark',
 * }
 *
 * const BRAND_SVG: Record<BrandIcon, string> = {
 *     [BrandIcon.Logo]: '<svg>…</svg>',
 *     [BrandIcon.Wordmark]: '<svg>…</svg>',
 * };
 *
 * @Injectable({ providedIn: 'root' })
 * export class BrandSvgIconService extends TbxMatSvgIconService<BrandIcon> {
 *     constructor() {
 *         super();
 *         for (const [name, svg] of Object.entries(BRAND_SVG)) {
 *             this.register(name, svg);
 *         }
 *     }
 * }
 *
 * // Component uses svgIcon binding:
 * // readonly icons = inject(BrandSvgIconService);
 * // <mat-icon [svgIcon]="icons.resolve(BrandIcon.Logo)!"></mat-icon>
 * // resolve(BrandIcon.Logo) → 'logo'
 * ```
 *
 * @typeParam TName - The icon key type. Defaults to `string`. Narrow to an
 *                    enum or union for compile-time safety on `register()`
 *                    and `resolve()`.
 */
export abstract class TbxMatSvgIconService<
    TName extends string = string,
> extends TbxMatBaseIconService<TName> {
    private readonly iconRegistry = inject(MatIconRegistry);
    private readonly sanitizer = inject(DomSanitizer);

    /**
     * Register an inline SVG icon with the Material icon registry.
     *
     * After registration the icon is available in templates via
     * `<mat-icon [svgIcon]="name">`. The SVG string is sanitized via
     * `DomSanitizer.bypassSecurityTrustHtml()` — callers are responsible
     * for ensuring the SVG content is trusted.
     *
     * The base class stores `name → name` (identity mapping) so that
     * `resolve(name)` returns the `svgIcon` binding name. The SVG markup
     * itself is stored externally by `MatIconRegistry`, not in the base
     * class registry.
     *
     * Duplicate registrations for the same name are silently ignored —
     * only the first registration takes effect.
     *
     * @param name - The icon name used in `[svgIcon]="name"`
     * @param svg  - The inline SVG markup string
     * @returns `true` if the name was newly registered, `false` if it
     *          was already present
     */
    protected override register(name: TName, svg: string): boolean;
    protected override register(name: string, svg: string): boolean;
    protected override register(name: string, svg: string): boolean {
        // The base class stores name → value for resolve(). For SVG icons,
        // the resolved value is the icon name itself (used in [svgIcon]="name"),
        // not the SVG markup — MatIconRegistry stores the markup separately.
        if (!super.register(name, name)) {
            return false;
        }

        this.iconRegistry.addSvgIconLiteral(name, this.sanitizer.bypassSecurityTrustHtml(svg));
        return true;
    }
}
