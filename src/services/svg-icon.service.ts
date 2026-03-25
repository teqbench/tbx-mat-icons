import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Abstract base class for SVG-based icon services.
 *
 * Encapsulates the MatIconRegistry + DomSanitizer registration mechanics
 * that any SVG icon service needs. Subclasses call the protected
 * `register()` method to register SVG markup strings — they never interact
 * with MatIconRegistry or DomSanitizer directly.
 *
 * Once registered, icons are available in templates via
 * `<mat-icon svgIcon="name">`.
 *
 * The generic type parameter `T` defaults to `string` but can be narrowed
 * to an enum or union type for strongly typed icon keys. The typed overload
 * of `resolve()` encourages callers to use the constrained type while the
 * `string` overload provides a fallback for dynamic lookups.
 *
 * This is the SVG counterpart to FontIconService. Font services resolve
 * ligature name strings; SVG services register inline SVG markup with the
 * Material icon registry.
 *
 * @example Extending for a custom SVG icon set:
 * ```typescript
 * const BRAND_SVG = new Map<string, string>([
 *     [MyBrand.Logo, '<svg>…</svg>'],
 * ]);
 *
 * @Injectable({ providedIn: 'root' })
 * export class MyBrandedSvgIconService extends SvgIconService<MyBrand> {
 *     constructor() {
 *         super();
 *         for (const [name, svg] of BRAND_SVG) {
 *             this.register(name, svg);
 *         }
 *     }
 *
 *     resolve(name: MyBrand): string | undefined;
 *     resolve(name: string): string | undefined;
 *     resolve(name: string): string | undefined {
 *         return BRAND_SVG.has(name) ? name : undefined;
 *     }
 * }
 * ```
 *
 * @typeParam T - The icon key type. Defaults to `string`. Narrow to an enum
 *               or union for compile-time safety on `register()` and `resolve()`.
 */
export abstract class SvgIconService<T extends string = string> {
    private readonly iconRegistry = inject(MatIconRegistry);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly registered = new Set<string>();

    /**
     * Register an inline SVG icon with the Material icon registry.
     *
     * After registration, the icon is available in templates via
     * `<mat-icon svgIcon="name">`. The SVG string is sanitized via
     * DomSanitizer.bypassSecurityTrustHtml() — callers are responsible
     * for ensuring the SVG content is trusted.
     *
     * Duplicate registrations for the same name are silently ignored —
     * only the first registration takes effect.
     *
     * @param name - The icon name used in `svgIcon="name"`
     * @param svg - The inline SVG markup string
     */
    protected register(name: T, svg: string): void;
    protected register(name: string, svg: string): void;
    protected register(name: string, svg: string): void {
        if (this.registered.has(name)) {
            return;
        }
        this.registered.add(name);
        this.iconRegistry.addSvgIconLiteral(name, this.sanitizer.bypassSecurityTrustHtml(svg));
    }

    /**
     * Resolve an icon key to a registered svgIcon name.
     *
     * Returns the icon name usable in `<mat-icon [svgIcon]="name">`,
     * or `undefined` if the key is not registered.
     *
     * @param name - The icon key to resolve
     * @returns The registered svgIcon name, or undefined
     */
    abstract resolve(name: T): string | undefined;
    abstract resolve(name: string): string | undefined;
}
