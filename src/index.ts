/**
 * Abstract icon service contracts for {@link https://material.angular.io | Angular Material}
 *
 * @remarks
 * This package provides the abstract service layer for icon registration and
 * resolution in {@link https://material.angular.io | Angular Material} applications. All service classes are generic —
 * narrow the type parameter to an enum or union for typed icon keys. Subclasses
 * override `initialize()` to register icons and inherit `resolve()` from the
 * base class.
 *
 * Primary exports:
 *
 * - {@link TbxMatIconResolver} — generic resolve contract implemented by {@link TbxMatIconService}
 *
 * - {@link TbxMatIconType} — enum discriminant for font vs SVG rendering strategy
 *
 * - {@link TbxMatIconService} — shared registration/resolution base (do not extend directly)
 *
 * - {@link TbxMatSvgIconService} — abstract base for SVG icon registration via `MatIconRegistry`
 *
 * - {@link TbxMatFontIconService} — abstract base for font-based icon ligature resolution
 *
 * - {@link TBX_MAT_FONT_ICON_DEFAULT_FONT_SET} — injection token for application-level fontSet default
 *
 * - {@link TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED},
 *   {@link TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_OUTLINED},
 *   {@link TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP} — fontSet string constants for {@link https://fonts.google.com/icons | Material Symbols} variants
 *
 * @see {@link https://material.angular.io | Angular Material}
 * @see {@link https://fonts.google.com/icons | Google Material Symbols}
 *
 * @packageDocumentation
 */

// Contracts
export type { TbxMatIconResolver } from './contracts/icon-resolver.contract';

// Enums
export { TbxMatIconType } from './enums/icon-type.enum';

// Constants
export * from './constants/font-set.constants';

// Tokens
export { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET } from './tokens/font-icon-default-font-set.token';

// Abstract services
export { TbxMatIconService } from './services/icon.service';
export { TbxMatSvgIconService } from './services/svg-icon.service';
export { TbxMatFontIconService } from './services/font-icon.service';
