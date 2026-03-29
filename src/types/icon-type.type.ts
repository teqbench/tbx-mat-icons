/**
 * Discriminant for the icon rendering strategy.
 *
 * Set by each intermediate service class and used by consumers to
 * determine the correct `<mat-icon>` binding:
 *
 * - **`Font`** — render as font ligature text content: `<mat-icon>{{ ligature }}</mat-icon>`
 * - **`Svg`** — render via svgIcon binding: `<mat-icon [svgIcon]="name"></mat-icon>`
 */
export enum TbxMatIconType {
    Font = 'font',
    Svg = 'svg',
}
