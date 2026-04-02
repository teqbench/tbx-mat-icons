import { inject } from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TbxMatBaseIconService } from './base-icon.service';
import { TbxMatIconType } from '../types/icon-type.type';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET } from '../tokens/font-icon-default-font-set.token';

/**
 * Abstract base class for font-based icon services
 *
 * @remarks
 * Extends {@link TbxMatBaseIconService} with `fontSet` resolution for
 * Angular Material font icon rendering. Subclasses register domain keys
 * mapped to font ligature names via `register()` — `resolve()` is
 * inherited from the base class and returns the ligature for a given key.
 *
 * How registration works:
 *
 * `register(name, value)` is inherited from the base class. For font
 * icons, `name` is the domain key (e.g. an enum member like `'success'`)
 * and `value` is the font ligature (e.g. `'check_circle'`). The two are
 * typically different, unlike SVG icons where they are identical.
 *
 * After registration, `resolve(name)` returns the ligature, which the
 * component renders as text content inside `<mat-icon>`.
 *
 * fontSet resolution:
 *
 * The `fontSet` value is determined by the first match in this order:
 *
 * 1. Explicit constructor argument — `super('material-symbols-sharp')`.
 *    The service uses a specific fontSet regardless of any global
 *    configuration. The consuming component must bind
 *    `[fontSet]="icons.fontSet"` on `<mat-icon>` so the icon renders
 *    with the correct font family.
 *
 * 2. {@link TBX_MAT_FONT_ICON_DEFAULT_FONT_SET} token — set once in
 *    `app.config.ts`. All subclasses that call `super()` without an
 *    argument inherit this value. The consuming component must bind
 *    `[fontSet]="icons.fontSet"` on `<mat-icon>`.
 *
 * 3. `MAT_ICON_DEFAULT_OPTIONS.fontSet` — Angular Material's global
 *    icon default. When this is the source, `<mat-icon>` already uses
 *    the correct fontSet globally, so the component does not need
 *    a `[fontSet]` binding.
 *
 * 4. Error — if none of the above provides a fontSet, the
 *    constructor throws.
 *
 * When to bind `[fontSet]` in the component:
 *
 * - Steps 1 and 2: The service uses a fontSet that differs from (or
 *   is independent of) the global `MAT_ICON_DEFAULT_OPTIONS`. The
 *   component must bind `[fontSet]="icons.fontSet"` to override the
 *   global for that icon.
 *
 * - Step 3: The fontSet comes from `MAT_ICON_DEFAULT_OPTIONS`, which
 *   `<mat-icon>` already uses by default. No `[fontSet]` binding is
 *   needed.
 *
 * This is the font counterpart to {@link TbxMatSvgIconService}. SVG
 * services register inline SVG markup with `MatIconRegistry`; font
 * services map domain keys to ligature names.
 *
 * @typeParam TName - The icon key type. Defaults to `string`. Narrow to an
 *   enum or union for compile-time safety on `register()` and `resolve()`.
 *
 * @usage
 * Extend this class to create a service that maps domain-specific icon
 * keys to Material Symbols font ligature names. Override `initialize()`
 * to call `register(key, ligature)` for each icon. Optionally pass a
 * fontSet to `super()` or provide {@link TBX_MAT_FONT_ICON_DEFAULT_FONT_SET}.
 *
 * @example Explicit fontSet via constructor (overrides all globals):
 * ```typescript
 * enum Severity {
 *     Success = 'success',
 *     Error = 'error',
 * }
 *
 * @Injectable({ providedIn: 'root' })
 * export class SharpIconService extends TbxMatFontIconService<Severity> {
 *     constructor() {
 *         super(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP);
 *     }
 *
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(Severity.Success, 'check_circle');
 *         this.register(Severity.Error, 'cancel');
 *     }
 * }
 *
 * // Component injects the service and binds [fontSet]:
 * // readonly icons = inject(SharpIconService);
 * // readonly severity = Severity.Success;
 * // <mat-icon [fontSet]="icons.fontSet">{{ icons.resolve(severity) }}</mat-icon>
 * // resolve(Severity.Success) → 'check_circle'
 * ```
 *
 * @example fontSet from TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token:
 * ```typescript
 * // app.config.ts
 * providers: [
 *     { provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED },
 * ]
 *
 * @Injectable({ providedIn: 'root' })
 * export class MySeverityIconService extends TbxMatFontIconService<Severity> {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(Severity.Success, 'check_circle');
 *         this.register(Severity.Error, 'cancel');
 *     }
 * }
 *
 * // Component injects the service and binds [fontSet]:
 * // readonly icons = inject(MySeverityIconService);
 * // <mat-icon [fontSet]="icons.fontSet">{{ icons.resolve(severity) }}</mat-icon>
 * ```
 *
 * @example fontSet from MAT_ICON_DEFAULT_OPTIONS (global default):
 * ```typescript
 * // app.config.ts
 * providers: [
 *     { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
 * ]
 *
 * @Injectable({ providedIn: 'root' })
 * export class MySeverityIconService extends TbxMatFontIconService<Severity> {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(Severity.Success, 'check_circle');
 *         this.register(Severity.Error, 'cancel');
 *     }
 * }
 *
 * // Component injects the service — no [fontSet] binding needed:
 * // readonly icons = inject(MySeverityIconService);
 * // <mat-icon>{{ icons.resolve(severity) }}</mat-icon>
 * ```
 *
 * @category Services
 * @displayName Font Icon Service
 * @order 2
 * @since 1.0.0
 * @related TbxMatBaseIconService
 * @related TbxMatSvgIconService
 * @related TBX_MAT_FONT_ICON_DEFAULT_FONT_SET
 * @related ITbxMatIconResolver
 *
 * @public
 */
export abstract class TbxMatFontIconService<
    TName extends string = string,
> extends TbxMatBaseIconService<TName> {
    readonly iconType = TbxMatIconType.Font;

    /**
     * The fontSet this service resolves against
     *
     * @public
     */
    readonly fontSet: string;

    /**
     * @param fontSet - Optional fontSet identifier (e.g., `'material-symbols-rounded'`).
     *   When provided, takes precedence over all global defaults.
     *   When omitted, falls back to {@link TBX_MAT_FONT_ICON_DEFAULT_FONT_SET},
     *   then `MAT_ICON_DEFAULT_OPTIONS.fontSet`.
     *
     * @public
     */
    constructor(fontSet?: string) {
        super();

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

        this.initialize();
    }
}
