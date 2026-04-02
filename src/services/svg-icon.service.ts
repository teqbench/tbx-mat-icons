import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TbxMatIconService } from './base-icon.service';
import { TbxMatIconType } from '../types/icon-type.type';

/**
 * Abstract base class for SVG-based icon services
 *
 * @remarks
 * Extends {@link TbxMatIconService} with Angular Material's
 * `MatIconRegistry` and `DomSanitizer` integration. Subclasses call the
 * protected `register()` method with a name and SVG markup string —
 * they never interact with `MatIconRegistry` or `DomSanitizer` directly.
 *
 * Once registered, icons are available in templates via
 * `<mat-icon [svgIcon]="name">`.
 *
 * How registration works:
 *
 * `register(name, svg)` does two things:
 *
 * 1. Passes `name, name` to the base class — the resolved value for an
 *    SVG icon is the icon name itself (used in the `[svgIcon]` binding),
 *    not the SVG markup.
 *
 * 2. Registers the SVG markup with `MatIconRegistry` via
 *    `addSvgIconLiteral()`, sanitized through `DomSanitizer`.
 *
 * Re-registering the same name replaces the previous entry in both the
 * base class registry and `MatIconRegistry`.
 *
 * This is the SVG counterpart to {@link TbxMatFontIconService}. Font
 * services map domain keys to ligature names; SVG services register
 * inline SVG markup with the Material icon registry.
 *
 * @typeParam TName - The icon key type. Defaults to `string`. Narrow to an
 *   enum or union for compile-time safety on `register()` and `resolve()`.
 *
 * @usage
 * Extend this class to create a service that registers inline SVG icons
 * with Angular Material's `MatIconRegistry`. Override `initialize()` to
 * call `register(name, svgMarkup)` for each icon. Consumers bind
 * `[svgIcon]="icons.resolve(key)"` on `<mat-icon>`.
 *
 * @example
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
 *     protected override initialize(): void {
 *         super.initialize();
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
 * @category Services
 * @displayName SVG Icon Service
 * @order 3
 * @since 1.0.0
 * @related TbxMatIconService
 * @related TbxMatFontIconService
 * @related TbxMatIconResolver
 *
 * @public
 */
export abstract class TbxMatSvgIconService<
    TName extends string = string,
> extends TbxMatIconService<TName> {
    readonly iconType = TbxMatIconType.Svg;

    private readonly iconRegistry: MatIconRegistry;
    private readonly sanitizer: DomSanitizer;

    constructor() {
        super();
        this.iconRegistry = inject(MatIconRegistry);
        this.sanitizer = inject(DomSanitizer);
        this.initialize();
    }

    /**
     * Register an inline SVG icon with the Material icon registry
     *
     * @remarks
     * After registration the icon is available in templates via
     * `<mat-icon [svgIcon]="name">`. The SVG string is sanitized via
     * `DomSanitizer.bypassSecurityTrustHtml()` — callers are responsible
     * for ensuring the SVG content is trusted.
     *
     * The base class stores `name -> name` (identity mapping) so that
     * `resolve(name)` returns the `svgIcon` binding name. The SVG markup
     * itself is stored externally by `MatIconRegistry`, not in the base
     * class registry.
     *
     * Re-registering the same name replaces the previous entry in both
     * the base class registry and `MatIconRegistry`.
     *
     * @param name - The icon name used in `[svgIcon]="name"`
     * @param svg - The inline SVG markup string
     *
     * @public
     */
    protected override register(name: TName, svg: string): void;
    protected override register(name: string, svg: string): void;
    protected override register(name: string, svg: string): void {
        super.register(name, name);
        this.iconRegistry.addSvgIconLiteral(name, this.sanitizer.bypassSecurityTrustHtml(svg));
    }
}
