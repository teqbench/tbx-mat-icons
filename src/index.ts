/**
 * Abstract icon service contracts for Angular Material
 *
 * @remarks
 * This package provides the abstract service layer for icon registration and
 * resolution in Angular Material applications. All service classes are generic —
 * narrow the type parameter to an enum or union for typed icon keys. Subclasses
 * override `initialize()` to register icons and inherit `resolve()` from the
 * base class.
 *
 * Primary exports:
 *
 * - {@link ITbxMatIconResolver} — generic resolve contract implemented by {@link TbxMatBaseIconService}
 *
 * - {@link TbxMatIconType} — enum discriminant for font vs SVG rendering strategy
 *
 * - {@link TbxMatBaseIconService} — shared registration/resolution base (do not extend directly)
 *
 * - {@link TbxMatSvgIconService} — abstract base for SVG icon registration via `MatIconRegistry`
 *
 * - {@link TbxMatFontIconService} — abstract base for font-based icon ligature resolution
 *
 * - {@link TBX_MAT_FONT_ICON_DEFAULT_FONT_SET} — injection token for application-level fontSet default
 *
 * - {@link TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED},
 *   {@link TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_OUTLINED},
 *   {@link TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_SHARP} — fontSet string constants for Material Symbols variants
 *
 * @packageDocumentation
 */

// Contracts
export type { ITbxMatIconResolver } from './contracts/icon-resolver.contract';

// Types
export { TbxMatIconType } from './types/icon-type.type';

// Constants
export * from './constants/font-set.constants';

// Tokens
export { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET } from './tokens/font-icon-default-font-set.token';

// Abstract services
export { TbxMatBaseIconService } from './services/base-icon.service';
export { TbxMatSvgIconService } from './services/svg-icon.service';
export { TbxMatFontIconService } from './services/font-icon.service';
