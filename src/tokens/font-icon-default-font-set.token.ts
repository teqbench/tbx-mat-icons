import { InjectionToken } from '@angular/core';

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
