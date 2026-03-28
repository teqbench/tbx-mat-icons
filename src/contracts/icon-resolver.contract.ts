/**
 * Contract for resolving icon keys to usable icon identifiers.
 *
 * Implemented by both `TbxMatFontIconService` (font ligature resolution)
 * and `TbxMatSvgIconService` (SVG icon registration and resolution).
 *
 * @typeParam T - The icon key type. Defaults to `string`. Narrow to an enum
 *               or union for compile-time safety.
 */
export interface ITbxIconResolver<T extends string = string> {
    /**
     * Resolve an icon key to an icon identifier.
     *
     * For font icons, returns the ligature name usable in
     * `<mat-icon>ligature</mat-icon>`.
     * For SVG icons, returns the registered name usable in
     * `<mat-icon svgIcon="name">`.
     *
     * Returns `undefined` if the key is not recognized.
     *
     * @param name - The icon key to resolve
     * @returns The icon identifier, or undefined
     */
    resolve(name: T): string | undefined;
    resolve(name: string): string | undefined;
}
