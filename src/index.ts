/**
 * tbx-mat-icons — abstract icon service contracts for Angular Material.
 *
 * Public API:
 *   - TbxMatSvgIconService  — abstract base for SVG icon registration via MatIconRegistry
 *   - TbxMatFontIconService — abstract base for font-based icon ligature resolution
 *
 * TbxMatSvgIconService encapsulates MatIconRegistry + DomSanitizer plumbing.
 * TbxMatFontIconService carries the font set identifier and the resolve contract.
 * Both are generic — narrow the type parameter to an enum for typed keys.
 */

// Constants
export * from './contants/font-set.constants';

// Abstract contracts
export { TbxMatSvgIconService } from './services/svg-icon.service';
export {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TbxMatFontIconService,
} from './services/font-icon.service';
