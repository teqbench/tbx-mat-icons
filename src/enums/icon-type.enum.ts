/**
 * Discriminant for the icon rendering strategy
 *
 * @remarks
 * Set by each intermediate service class and used by consumers to
 * determine the correct `<mat-icon>` binding:
 *
 * - `Font` — render as font ligature text content: `<mat-icon>ligature</mat-icon>`
 *
 * - `Svg` — render via svgIcon binding: `<mat-icon [svgIcon]="name"></mat-icon>`
 *
 * @usage
 * Read this value from a service's `iconType` property to conditionally
 * bind either text content or `[svgIcon]` on `<mat-icon>` in a template
 * that must support both icon types.
 *
 * @category Enums
 * @displayName Icon Type
 * @order 2
 * @since 4.0.0
 * @related TbxMatIconService
 *
 * @public
 */
export enum TbxMatIconType {
    /** @public */
    Font = 'font',
    /** @public */
    Svg = 'svg',
}
