/**
 * tbx-mat-icons — abstract icon service contracts for Angular Material.
 *
 * Public API:
 *   - SvgIconService      — abstract base for SVG icon registration via MatIconRegistry
 *   - FontIconService     — abstract base for font-based icon ligature resolution
 *
 * SvgIconService encapsulates MatIconRegistry + DomSanitizer plumbing.
 * FontIconService carries the font set identifier and the resolve contract.
 * Both are generic — narrow the type parameter to an enum for typed keys.
 */

// Abstract contracts
export { SvgIconService } from './services/svg-icon.service';
export { FontIconService } from './services/font-icon.service';
