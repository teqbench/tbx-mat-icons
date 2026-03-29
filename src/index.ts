/**
 * tbx-mat-icons — abstract icon service contracts for Angular Material.
 *
 * Public API:
 *   - ITbxMatIconResolver             — generic resolve contract implemented by TbxMatBaseIconService
 *   - TbxMatBaseIconService           — shared registration/resolution base (do not extend directly)
 *   - TbxMatSvgIconService            — abstract base for SVG icon registration via MatIconRegistry
 *   - TbxMatFontIconService           — abstract base for font-based icon ligature resolution
 *   - TBX_MAT_FONT_ICON_DEFAULT_FONT_SET — injection token for application-level fontSet default
 *   - TBX_MAT_ICON_FONT_SET_*         — fontSet string constants for Material Symbols variants
 *
 * All service classes are generic — narrow the type parameter to an enum or
 * union for typed icon keys. Subclasses register icons in their constructor
 * and inherit resolve() from the base class.
 */

// Contracts
export type { ITbxMatIconResolver } from './contracts/icon-resolver.contract';

// Constants
export * from './constants/font-set.constants';

// Tokens
export { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET } from './tokens/font-icon-default-font-set.token';

// Abstract services
export { TbxMatBaseIconService } from './services/base-icon.service';
export { TbxMatSvgIconService } from './services/svg-icon.service';
export { TbxMatFontIconService } from './services/font-icon.service';
