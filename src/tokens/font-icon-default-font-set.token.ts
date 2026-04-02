import { InjectionToken } from '@angular/core';

/**
 * Injection token for setting a default fontSet at the application level
 *
 * @remarks
 * When provided (typically in the root `ApplicationConfig`), any
 * {@link TbxMatFontIconService} subclass that does not pass a `fontSet` to
 * `super()` will use this value automatically.
 *
 * @usage
 * Provide this token once in `app.config.ts` to set a consistent font set
 * across all font icon services in the application. Individual services can
 * still override by passing a `fontSet` argument to `super()`.
 *
 * @example
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
 *
 * @category Tokens
 * @displayName Default Font Set Token
 * @order 1
 * @since 1.0.0
 * @related TbxMatFontIconService
 * @related TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED
 *
 * @public
 */
export const TBX_MAT_FONT_ICON_DEFAULT_FONT_SET = new InjectionToken<string>(
    'TBX_MAT_FONT_ICON_DEFAULT_FONT_SET'
);
