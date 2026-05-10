# Changelog

## [4.2.3](https://github.com/teqbench/tbx-mat-icons/compare/v4.2.2...v4.2.3) (2026-05-10)


### Bug Fixes

* **changelog:** strip broken at-mention autolinks from history ([7393c6a](https://github.com/teqbench/tbx-mat-icons/commit/7393c6a11b6e16bb1c1091c2063cd210d0aee705))
* **changelog:** strip broken at-mention autolinks from history ([1d7f919](https://github.com/teqbench/tbx-mat-icons/commit/1d7f919cc0d12ea6b6438681946ee39dbcb6176b))

## [4.2.2](https://github.com/teqbench/tbx-mat-icons/compare/v4.2.1...v4.2.2) (2026-05-10)


### Bug Fixes

* **ci:** pin reusable workflows to v2.9.3 ([b923c81](https://github.com/teqbench/tbx-mat-icons/commit/b923c814252c9bde27f79bb078a0e63dd3c4abf0)), closes [#28](https://github.com/teqbench/tbx-mat-icons/issues/28)

## [4.2.1](https://github.com/teqbench/tbx-mat-icons/compare/v4.2.0...v4.2.1) (2026-05-09)


### Bug Fixes

* **ci:** pin reusable workflows to v2.6.0 ([6da0755](https://github.com/teqbench/tbx-mat-icons/commit/6da07556bc98f0dcbca9f59ca30d9cc57e9d609a))

## [4.2.0](https://github.com/teqbench/tbx-mat-icons/compare/v4.1.0...v4.2.0) (2026-05-04)


### Features

* **community:** adopt org-default community health files ([afe8645](https://github.com/teqbench/tbx-mat-icons/commit/afe8645ef1b5cc34dbfc09b31b40954fcc0c8453))


### Bug Fixes

* align package with org docs, conventions, and post-Renovate state ([278c628](https://github.com/teqbench/tbx-mat-icons/commit/278c628a9b68ef88d02945a631fe460d4f8afe66))
* **claude:** add Markdown Tables Convention section ([2cb60db](https://github.com/teqbench/tbx-mat-icons/commit/2cb60db150c628803767d76539eb0cc7960abb90))
* **claude:** append secrets and privacy bullets to NOT Do list ([4d5edd2](https://github.com/teqbench/tbx-mat-icons/commit/4d5edd29f31fc4e7806d75012bd3a1966c08d4d9))
* **claude:** link the org-level renovate doc ([c6c4940](https://github.com/teqbench/tbx-mat-icons/commit/c6c49406d10d8351e53c346a9b1b5967509590a6))
* **claude:** list emitted APF entry-point keys in Publishing ([a83cb24](https://github.com/teqbench/tbx-mat-icons/commit/a83cb24a0ebd822a348be0cc2aaa74e3b712c5be))
* **claude:** list related.yml in the docs/ bullet ([49b36ce](https://github.com/teqbench/tbx-mat-icons/commit/49b36ce4a1463dec1782bb0a13ff831a6bdfb875))
* **claude:** update Project Structure to match tbx-models ([0e61d60](https://github.com/teqbench/tbx-mat-icons/commit/0e61d60f9b06adf9dfc897141e456fe6c4749ff7))
* **docs:** link Angular Material on overview.md line 39 ([2afd174](https://github.com/teqbench/tbx-mat-icons/commit/2afd17458e42bece6784d083058e2599850ca319))
* **docs:** replace markdown tables with definition lists ([2c32fa0](https://github.com/teqbench/tbx-mat-icons/commit/2c32fa03d7cb7e34009d7517611a9ab69cdc8c82))
* remove dependabot artifacts after migration to renovate ([09a7bb7](https://github.com/teqbench/tbx-mat-icons/commit/09a7bb7d44eebf9ab4e134eff6a47dec3288c8a2))

## [4.1.0](https://github.com/teqbench/tbx-mat-icons/compare/v4.0.2...v4.1.0) (2026-04-13)


### Features

* **docs:** overhaul README and adopt the per-package docs pipeline ([888aef6](https://github.com/teqbench/tbx-mat-icons/commit/888aef6a8e184f5984777a16326a4d0eb0c58c82))
* **docs:** overhaul README and adopt the per-package docs pipeline ([4241267](https://github.com/teqbench/tbx-mat-icons/commit/4241267c60a929119d54268fc76cc2a08ecd421f))

## [4.0.2](https://github.com/teqbench/tbx-mat-icons/compare/v4.0.1...v4.0.2) (2026-04-06)


### Bug Fixes

* **deps:** update vite to 7.3.2/8.0.5 to resolve CVEs ([b6110e1](https://github.com/teqbench/tbx-mat-icons/commit/b6110e1ce5ea3043826d9678290e98c4bc0ceeec))
* **deps:** update vite to 7.3.2/8.0.5 to resolve CVEs ([f1a250d](https://github.com/teqbench/tbx-mat-icons/commit/f1a250d5d76703f8f31409553b509c09d7bffe46))

## [4.0.1](https://github.com/teqbench/tbx-mat-icons/compare/v4.0.0...v4.0.1) (2026-04-03)


### Bug Fixes

* **docs:** use email reporting channel in SECURITY.md for private repo ([4e40407](https://github.com/teqbench/tbx-mat-icons/commit/4e404076c2515ad93a0e991bbbeee8731dc6f27b))

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
