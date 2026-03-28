/**
 * tbx-mat-icons — abstract icon service contracts for Angular Material.
 *
 * Public API:
 *   - ITbxMatIconResolver         — generic resolve contract implemented by both service bases
 *   - TbxMatFontIconService    — abstract base for font-based icon ligature resolution
 *   - TbxMatSvgIconService     — abstract base for SVG icon registration via MatIconRegistry
 *   - TBX_MAT_FONT_ICON_DEFAULT_FONT_SET — injection token for application-level fontSet default
 *   - TBX_MAT_ICON_FONT_SET_* — fontSet string constants for Material Symbols variants
 *
 * Both service bases implement ITbxMatIconResolver and are generic — narrow the
 * type parameter to an enum or union for typed icon keys.
 */

// Contracts
export type { ITbxMatIconResolver } from './contracts/icon-resolver.contract';

// Constants
export * from './contants/font-set.constants';

// Abstract services
export { TbxMatSvgIconService } from './services/svg-icon.service';
export {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TbxMatFontIconService,
} from './services/font-icon.service';
