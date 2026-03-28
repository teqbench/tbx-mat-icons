import { inject, InjectionToken } from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import type { ITbxIconResolver } from '../contracts/icon-resolver.contract';

/**
 * Injection token for setting a default fontSet at the application level.
 *
 * When provided (typically in the root `ApplicationConfig`), any
 * `TbxMatFontIconService` subclass that does not pass a `fontSet` to `super()`
 * will use this value automatically.
 *
 * @example Providing a default fontSet for the entire application:
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
 * mapping domain-specific keys to font ligature names.
 *
 * ### fontSet resolution
 *
 * The `fontSet` value is determined by the first match in this order:
 *
 * 1. **Explicit constructor argument** — `super('material-symbols-sharp')`.
 *    The service uses a specific fontSet regardless of any global configuration.
 *    The consuming component must bind `[fontSet]="icons.fontSet"` on `<mat-icon>`
 *    so the icon renders with the correct font family.
 *
 * 2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`.
 *    All subclasses that call `super()` without an argument inherit this value.
 *    The consuming component must bind `[fontSet]="icons.fontSet"` on `<mat-icon>`.
 *
 * 3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** — Angular Material's global icon default.
 *    When this is the source, `<mat-icon>` already uses the correct fontSet
 *    globally, so the component does **not** need a `[fontSet]` binding.
 *
 * 4. **Error** — if none of the above provides a fontSet, the constructor throws.
 *
 * ### When to bind `[fontSet]` in the component
 *
 * - **Steps 1 and 2:** The service uses a fontSet that differs from (or is
 *   independent of) the global `MAT_ICON_DEFAULT_OPTIONS`. The component must
 *   bind `[fontSet]="icons.fontSet"` to override the global for that icon.
 *
 *   ```html
 *   <mat-icon [fontSet]="icons.fontSet">{{ icons.resolve(key) }}</mat-icon>
 *   ```
 *
 * - **Step 3:** The fontSet comes from `MAT_ICON_DEFAULT_OPTIONS`, which
 *   `<mat-icon>` already uses by default. No `[fontSet]` binding is needed.
 *
 *   ```html
 *   <mat-icon>{{ icons.resolve(key) }}</mat-icon>
 *   ```
 *
 * ### Examples
 *
 * @example Step 1 — Explicit fontSet via constructor (overrides all globals):
 * ```typescript
 * enum Severity {
 *     Success = 'success',
 *     Error = 'error',
 * }
 *
 * const LIGATURES: Record<Severity, string> = {
 *     [Severity.Success]: 'check_circle',
 *     [Severity.Error]: 'cancel',
 * };
 *
 * @Injectable({ providedIn: 'root' })
 * export class SharpIconService extends TbxMatFontIconService<Severity> {
 *     constructor() {
 *         super(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP);
 *     }
 *
 *     resolve(name: Severity): string | undefined;
 *     resolve(name: string): string | undefined;
 *     resolve(name: string): string | undefined {
 *         return LIGATURES[name as Severity];
 *     }
 * }
 *
 * // Component injects the service and binds [fontSet]:
 * // readonly icons = inject(SharpIconService);
 * // readonly severity = Severity.Success; // or from a signal, input, etc.
 * // <mat-icon [fontSet]="icons.fontSet">{{ icons.resolve(severity) }}</mat-icon>
 * ```
 *
 * @example Step 2 — fontSet from TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token:
 * ```typescript
 * // app.config.ts
 * providers: [
 *     { provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED },
 * ]
 *
 * @Injectable({ providedIn: 'root' })
 * export class MySeverityIconService extends TbxMatFontIconService<Severity> {
 *     constructor() {
 *         super(); // inherits TBX_MAT_FONT_ICON_DEFAULT_FONT_SET
 *     }
 *     // ...resolve() same as step 1
 * }
 *
 * // Component injects the service and binds [fontSet]:
 * // readonly icons = inject(MySeverityIconService);
 * // readonly severity = Severity.Success;
 * // <mat-icon [fontSet]="icons.fontSet">{{ icons.resolve(severity) }}</mat-icon>
 * ```
 *
 * @example Step 3 — fontSet from MAT_ICON_DEFAULT_OPTIONS (global default):
 * ```typescript
 * // app.config.ts
 * providers: [
 *     { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
 * ]
 *
 * @Injectable({ providedIn: 'root' })
 * export class MySeverityIconService extends TbxMatFontIconService<Severity> {
 *     constructor() {
 *         super(); // inherits MAT_ICON_DEFAULT_OPTIONS.fontSet
 *     }
 *     // ...resolve() same as step 1
 * }
 *
 * // Component injects the service — no [fontSet] binding needed:
 * // readonly icons = inject(MySeverityIconService);
 * // readonly severity = Severity.Success;
 * // <mat-icon>{{ icons.resolve(severity) }}</mat-icon>
 * ```
 *
 * @typeParam T - The icon key type. Defaults to `string`. Narrow to an enum
 *               or union for compile-time safety on `resolve()`.
 */
export abstract class TbxMatFontIconService<
    T extends string = string,
> implements ITbxIconResolver<T> {
    /** The fontSet this service resolves against. */
    readonly fontSet: string;

    /**
     * @param fontSet - Optional fontSet identifier (e.g., `'material-symbols-rounded'`).
     *                  When provided, takes precedence over all global defaults.
     *                  When omitted, falls back to `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`,
     *                  then `MAT_ICON_DEFAULT_OPTIONS.fontSet`.
     */
    constructor(fontSet?: string) {
        this.fontSet =
            fontSet ??
            inject(TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, { optional: true }) ??
            inject(MAT_ICON_DEFAULT_OPTIONS, { optional: true })?.fontSet ??
            (() => {
                throw new Error(
                    'TbxMatFontIconService: no fontSet resolved. ' +
                        'Provide one of: ' +
                        '(1) fontSet argument to super(), ' +
                        '(2) TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token, or ' +
                        '(3) MAT_ICON_DEFAULT_OPTIONS with a fontSet property.'
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
