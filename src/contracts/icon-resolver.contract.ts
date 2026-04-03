/**
 * Contract for resolving icon keys to usable icon identifiers
 *
 * @remarks
 * Implemented by both {@link TbxMatFontIconService} (font ligature resolution)
 * and {@link TbxMatSvgIconService} (SVG icon registration and resolution).
 *
 * @typeParam T - The icon key type. Defaults to `string`. Narrow to an enum
 *   or union for compile-time safety.
 *
 * @usage
 * Use this interface to type service references when the consumer does not
 * need to know whether icons are font-based or SVG-based. Inject the concrete
 * service and type the reference as `TbxMatIconResolver<MyEnum>`.
 *
 * @category Contracts
 * @displayName Icon Resolver Contract
 * @order 1
 * @since 2.0.0
 * @related TbxMatIconService
 * @related TbxMatFontIconService
 * @related TbxMatSvgIconService
 *
 * @public
 */
export interface TbxMatIconResolver<T extends string = string> {
    /**
     * Resolve an icon key to an icon identifier
     *
     * @remarks
     * For font icons, returns the ligature name usable in
     * `<mat-icon>ligature</mat-icon>`.
     * For SVG icons, returns the registered name usable in
     * `<mat-icon svgIcon="name">`.
     *
     * Returns `undefined` if the key is not recognized.
     *
     * @param name - The icon key to resolve
     * @returns The icon identifier, or `undefined`
     *
     * @public
     */
    resolve(name: T): string | undefined;
    resolve(name: string): string | undefined;
}
