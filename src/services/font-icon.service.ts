import { inject, InjectionToken } from '@angular/core';

/**
 * Injection token for setting a default font set at the application level.
 *
 * When provided (typically in the root `ApplicationConfig`), any
 * `TbxMatFontIconService` subclass that does not pass a `fontSet` to `super()`
 * will use this value automatically.
 *
 * @example Providing a default font set for the entire application:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED }
 *     from '@teqbench/tbx-mat-icons';
 *
 * export const appConfig: ApplicationConfig = {
 *     providers: [
 *         { provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED },
 *     ],
 * };
 * ```
 */
export const TBX_MAT_FONT_ICON_DEFAULT_FONT_SET = new InjectionToken<string>(
    'TBX_MAT_FONT_ICON_DEFAULT_FONT_SET'
);

/**
 * Abstract base class for font-based icon services.
 *
 * Provides the `fontSet` identifier and the `resolve()` contract for
 * mapping domain-specific keys to font ligature names. The `fontSet`
 * value is determined in this order:
 *
 * 1. If `fontSet` is passed to the constructor via `super(fontSet)`, that
 *    value is used for this instance.
 * 2. Otherwise, the value provided via the `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`
 *    injection token is used (typically set once in the application config).
 * 3. If neither is available, an error is thrown at construction time.
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
 * @example Extending with an explicit font set (constructor override):
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class SharpIconService extends TbxMatFontIconService<Severity> {
 *     constructor() {
 *         super(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP);
 *     }
 *     // ...
 * }
 * ```
 *
 * @example Extending with the application-level default:
 * ```typescript
 * // Requires TBX_MAT_FONT_ICON_DEFAULT_FONT_SET to be provided in the app config.
 * @Injectable({ providedIn: 'root' })
 * export class MySeverityFontIconService extends TbxMatFontIconService<Severity> {
 *     constructor() {
 *         super(); // uses TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token value
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
export abstract class TbxMatFontIconService<T extends string = string> {
    /** The icon font set this service resolves against. */
    readonly fontSet: string;

    /**
     * @param fontSet - Optional font set identifier (e.g., 'Material Symbols Rounded').
     *                  When provided, takes precedence over the application-level default.
     *                  When omitted, falls back to the `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token.
     */
    constructor(fontSet?: string) {
        this.fontSet =
            fontSet ??
            inject(TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, { optional: true }) ??
            (() => {
                throw new Error(
                    'TbxMatFontIconService: no fontSet provided and TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token is not configured. ' +
                        'Either pass fontSet to super() or provide the TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token in your application config.'
                );
            })();
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
