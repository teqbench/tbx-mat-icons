# Changelog

## [4.0.0](https://github.com/teqbench/tbx-mat-icons/compare/v3.0.0...v4.0.0) (2026-03-29)


### ⚠ BREAKING CHANGES

* TbxMatBaseIconService now requires subclasses to implement abstract readonly iconType: TbxMatIconType.
* add initialize/reset lifecycle, replace-on-register, rename token
* TbxMatSvgIconService and TbxMatFontIconService now extend TbxMatBaseIconService. resolve() is no longer abstract — it is inherited from the base class. Subclasses that override resolve() must be updated to use register() in the constructor instead.

### Features

* add TbxMatIconType enum and dedicated base service tests ([574badd](https://github.com/teqbench/tbx-mat-icons/commit/574badd06d5999b60f17ef09a1e3d50863fdcae7))


### Bug Fixes

* rename contants directory to constants ([17292b8](https://github.com/teqbench/tbx-mat-icons/commit/17292b82a734f04860197b7869677cc56348ed18))


### Code Refactoring

* add initialize/reset lifecycle, replace-on-register, rename token ([01e4c6b](https://github.com/teqbench/tbx-mat-icons/commit/01e4c6b6bb4babe07b9bd1e7539b351fa855dd8a))
* extract TbxMatBaseIconService with shared register/resolve ([3d21511](https://github.com/teqbench/tbx-mat-icons/commit/3d215112df9feefebce0e14ce9c77ea42fac98c0))

## [3.0.0](https://github.com/teqbench/tbx-mat-icons/compare/v2.0.0...v3.0.0) (2026-03-28)


### ⚠ BREAKING CHANGES

* ITbxIconResolver renamed to ITbxMatIconResolver.

### Code Refactoring

* rename ITbxIconResolver to ITbxMatIconResolver ([0b17963](https://github.com/teqbench/tbx-mat-icons/commit/0b179632f5e5e0b6792479ec753386619519ed0e))

## [2.0.0](https://github.com/teqbench/tbx-mat-icons/compare/v1.0.0...v2.0.0) (2026-03-28)


### ⚠ BREAKING CHANGES

* ITbxIconResolver is a new export. Existing code is unaffected but downstream packages may now implement or reference it.

### Code Refactoring

* add ITbxIconResolver contract and MAT_ICON_DEFAULT_OPTIONS fallback ([b27c94a](https://github.com/teqbench/tbx-mat-icons/commit/b27c94ab40a0653ffc3f426b6b3fbc315e70147c))

## [1.0.0](https://github.com/teqbench/tbx-mat-icons/compare/v0.1.0...v1.0.0) (2026-03-27)


### ⚠ BREAKING CHANGES

* **api:** All public exports have been renamed with TbxMat/TBX_MAT_ prefix.

### Features

* **api:** prefix all exports with TbxMat/TBX_MAT_ naming convention ([0111634](https://github.com/teqbench/tbx-mat-icons/commit/01116345287a94af3d496573e24f9c7f50514355))

## 0.1.0 (2026-03-25)


### Features

* **setup:** configure package as @teqbench/tbx-mat-icons ([c3b0750](https://github.com/teqbench/tbx-mat-icons/commit/c3b075083126fa65faf60ef1a07bfc3e84eb7cb9))
* **setup:** configure package as @teqbench/tbx-mat-icons ([9ecb7e1](https://github.com/teqbench/tbx-mat-icons/commit/9ecb7e1ca60edf35b67e34576aea82d1255931e0))

## Changelog
