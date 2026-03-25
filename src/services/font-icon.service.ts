/**
 * Abstract base class for font-based icon services.
 *
 * Provides the `fontSet` identifier and the `resolve()` contract for
 * mapping domain-specific keys to font ligature names. The `fontSet`
 * value is locked down at construction via `super()` and exposed as
 * a readonly property — it identifies which icon font this service
 * resolves against (e.g., 'Material Symbols Rounded').
 *
 * When the consuming component uses the global font set (configured via
 * MAT_ICON_DEFAULT_OPTIONS), `fontSet` does not need to be passed to
 * `<mat-icon>`. It becomes relevant when a service uses a different font
 * than the global default — the component reads `service.fontSet` and
 * passes it via `<mat-icon [fontSet]="icons.fontSet">` to override the
 * global for that context.
 *
 * The generic type parameter `T` defaults to `string` but can be narrowed
 * to an enum or union type for strongly typed icon keys. The typed overload
 * of `resolve()` encourages callers to use the constrained type while the
 * `string` overload provides a fallback for dynamic lookups.
 *
 * @example Extending for Material Symbols severity icons:
 * ```typescript
 * const SEVERITY_LIGATURE = new Map<string, string>([
 *     [Severity.Success, 'check_circle'],
 *     [Severity.Error, 'cancel'],
 * ]);
 *
 * @Injectable({ providedIn: 'root' })
 * export class MySeverityFontIconService extends FontIconService<Severity> {
 *     constructor() {
 *         super('material-symbols-rounded');
 *     }
 *
 *     resolve(name: Severity): string | undefined;
 *     resolve(name: string): string | undefined;
 *     resolve(name: string): string | undefined {
 *         return SEVERITY_LIGATURE.get(name);
 *     }
 * }
 * ```
 *
 * @typeParam T - The icon key type. Defaults to `string`. Narrow to an enum
 *               or union for compile-time safety on `resolve()`.
 */
export abstract class FontIconService<T extends string = string> {
    /** The icon font set this service resolves against. */
    readonly fontSet: string;

    /**
     * @param fontSet - The font set identifier (e.g., 'Material Symbols Rounded').
     *                  Set once via `super()` in subclasses. Readonly from that point.
     */
    constructor(fontSet: string) {
        this.fontSet = fontSet;
    }

    /**
     * Resolve an icon key to a font ligature name.
     *
     * Returns the ligature string usable in `<mat-icon>ligature</mat-icon>`,
     * or `undefined` if the key is not recognized.
     *
     * @param name - The icon key to resolve
     * @returns The ligature name, or undefined
     */
    abstract resolve(name: T): string | undefined;
    abstract resolve(name: string): string | undefined;
}
