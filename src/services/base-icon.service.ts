import type { ITbxMatIconResolver } from '../contracts/icon-resolver.contract';

/**
 * Abstract base class for all icon services.
 *
 * Provides the core registration and resolution mechanics shared by both
 * font-based ({@link TbxMatFontIconService}) and SVG-based
 * ({@link TbxMatSvgIconService}) icon services. Subclasses inherit
 * `register()` and `resolve()` and only add behaviour specific to their
 * icon type (e.g. `MatIconRegistry` interaction for SVG, `fontSet`
 * resolution for fonts).
 *
 * ### How registration works
 *
 * Internally, a `Map<string, string>` stores `name → value` pairs:
 *
 * - **Font icons** — `name` is the domain key (e.g. an enum member like
 *   `'success'`) and `value` is the font ligature (e.g. `'check_circle'`).
 *   The two are typically different.
 *
 * - **SVG icons** — `name` is the domain key *and* the `svgIcon` binding
 *   name. The SVG markup itself is stored externally by `MatIconRegistry`,
 *   so the base class stores `name → name` (identity mapping). The
 *   `TbxMatSvgIconService` override handles this automatically.
 *
 * Re-registering the same `name` replaces the previous value,
 * allowing subclasses to override defaults set by a parent class.
 *
 * ### How resolution works
 *
 * `resolve(name)` returns the stored `value` for a given `name`, or
 * `undefined` if the name was never registered. The typed overload
 * encourages callers to use the constrained `TName` type while the
 * `string` overload provides a fallback for dynamic lookups.
 *
 * ### Extending
 *
 * Do not extend this class directly — extend one of the concrete
 * intermediate classes instead:
 *
 * - {@link TbxMatFontIconService} — for font ligature icons
 * - {@link TbxMatSvgIconService} — for inline SVG icons
 *
 * @example Font icon subclass:
 * ```typescript
 * enum Severity { Success = 'success', Error = 'error' }
 *
 * @Injectable({ providedIn: 'root' })
 * export class SeverityIconService extends TbxMatFontIconService<Severity> {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(Severity.Success, 'check_circle');
 *         this.register(Severity.Error, 'cancel');
 *     }
 * }
 * // resolve(Severity.Success) → 'check_circle'
 * ```
 *
 * @example SVG icon subclass:
 * ```typescript
 * enum Brand { Logo = 'logo', Wordmark = 'wordmark' }
 *
 * @Injectable({ providedIn: 'root' })
 * export class BrandIconService extends TbxMatSvgIconService<Brand> {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(Brand.Logo, '<svg>…</svg>');
 *         this.register(Brand.Wordmark, '<svg>…</svg>');
 *     }
 * }
 * // resolve(Brand.Logo) → 'logo'
 * ```
 *
 * @typeParam TName - The icon key type. Defaults to `string`. Narrow to an
 *                    enum or union for compile-time safety on `register()`
 *                    and `resolve()`.
 */
export abstract class TbxMatBaseIconService<
    TName extends string = string,
> implements ITbxMatIconResolver<TName> {
    /** Internal name → value store. See class-level docs for semantics. */
    private readonly registry = new Map<string, string>();

    /**
     * Initialize the registry with default icon mappings.
     *
     * Must be called from the constructor of each concrete intermediate
     * class ({@link TbxMatFontIconService}, {@link TbxMatSvgIconService})
     * after their own dependencies are ready. Subclasses override this
     * method to pre-populate the registry via `register()` calls. The
     * base implementation calls `reset()` to clear any existing entries.
     *
     * Can be called again later to restore the subclass defaults after
     * replacements have been made via `register()`.
     */
    protected initialize(): void {
        this.reset();
    }

    /**
     * Clear all registered icons from the registry.
     *
     * After calling `reset()`, `resolve()` returns `undefined` for all
     * names until new icons are registered. Call `initialize()` instead
     * to clear and re-register subclass defaults in one step.
     */
    protected reset(): void {
        this.registry.clear();
    }

    /**
     * Register an icon name and its resolved value.
     *
     * The `name` is the lookup key used by `resolve()`. The `value` is
     * what `resolve()` returns — a font ligature for font icons, or the
     * icon name itself for SVG icons (since `MatIconRegistry` stores the
     * actual SVG markup).
     *
     * Re-registering the same `name` replaces the previous value,
     * allowing subclasses to override defaults set by a parent class.
     *
     * @param name  - The icon key (typically an enum member)
     * @param value - The resolved identifier returned by `resolve()`
     */
    protected register(name: TName, value: string): void;
    protected register(name: string, value: string): void;
    protected register(name: string, value: string): void {
        this.registry.set(name, value);
    }

    /**
     * Resolve an icon key to its registered value.
     *
     * Returns the `value` that was passed to `register()` for the given
     * `name`, or `undefined` if the name was never registered.
     *
     * - For font icons, this is the ligature name
     *   (e.g. `'check_circle'`).
     * - For SVG icons, this is the `svgIcon` binding name
     *   (e.g. `'logo'`).
     *
     * @param name - The icon key to look up
     * @returns The registered value, or `undefined`
     */
    resolve(name: TName): string | undefined;
    resolve(name: string): string | undefined;
    resolve(name: string): string | undefined {
        return this.registry.get(name);
    }
}
