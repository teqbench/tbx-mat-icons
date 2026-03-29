import { describe, it, expect } from 'vitest';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TbxMatFontIconService } from './font-icon.service';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET } from '../tokens/font-icon-default-font-set.token';

enum TestSeverity {
    Success = 'success',
    Error = 'error',
}

const LIGATURES: Record<TestSeverity, string> = {
    [TestSeverity.Success]: 'check_circle',
    [TestSeverity.Error]: 'cancel',
};

/** Subclass that passes fontSet explicitly via super(). Uses initialize() for registration. */
@Injectable()
class ExplicitFontSetService extends TbxMatFontIconService<TestSeverity> {
    constructor() {
        super('Material Symbols Rounded');
    }

    protected override initialize(): void {
        super.initialize();
        for (const [name, ligature] of Object.entries(LIGATURES)) {
            this.register(name, ligature);
        }
    }

    /** Expose register for direct testing. */
    testRegister(name: string, value: string): void {
        this.register(name, value);
    }

    /** Expose initialize for direct testing. */
    testInitialize(): void {
        this.initialize();
    }

    /** Expose reset for direct testing. */
    testReset(): void {
        this.reset();
    }
}

/** Subclass that omits fontSet — relies on token or MAT_ICON_DEFAULT_OPTIONS fallback. */
@Injectable()
class DefaultFontSetService extends TbxMatFontIconService<TestSeverity> {
    constructor() {
        super();
    }

    protected override initialize(): void {
        super.initialize();
        for (const [name, ligature] of Object.entries(LIGATURES)) {
            this.register(name, ligature);
        }
    }
}

describe('TbxMatFontIconService', () => {
    describe('with explicit fontSet via constructor', () => {
        let service: ExplicitFontSetService;

        function setup(): ExplicitFontSetService {
            TestBed.configureTestingModule({
                providers: [ExplicitFontSetService],
            });
            return TestBed.inject(ExplicitFontSetService);
        }

        it('should set fontSet via constructor', () => {
            service = setup();
            expect(service.fontSet).toBe('Material Symbols Rounded');
        });

        it('should resolve registered keys via typed overload', () => {
            service = setup();
            expect(service.resolve(TestSeverity.Success)).toBe('check_circle');
            expect(service.resolve(TestSeverity.Error)).toBe('cancel');
        });

        it('should resolve registered keys via string overload', () => {
            service = setup();
            expect(service.resolve('success')).toBe('check_circle');
        });

        it('should return undefined for unregistered keys', () => {
            service = setup();
            expect(service.resolve('unknown')).toBeUndefined();
        });

        it('should be an instance of TbxMatFontIconService', () => {
            service = setup();
            expect(service).toBeInstanceOf(TbxMatFontIconService);
        });

        it('should prefer constructor fontSet over TBX_MAT_FONT_ICON_DEFAULT_FONT_SET', () => {
            TestBed.configureTestingModule({
                providers: [
                    ExplicitFontSetService,
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: 'material-symbols-outlined',
                    },
                ],
            });
            service = TestBed.inject(ExplicitFontSetService);
            expect(service.fontSet).toBe('Material Symbols Rounded');
        });

        it('should replace existing registration when re-registering the same name', () => {
            service = setup();
            service.testRegister('success', 'task_alt');

            expect(service.resolve(TestSeverity.Success)).toBe('task_alt');
        });

        it('should clear all registrations on reset()', () => {
            service = setup();
            service.testReset();

            expect(service.resolve(TestSeverity.Success)).toBeUndefined();
            expect(service.resolve(TestSeverity.Error)).toBeUndefined();
        });

        it('should restore defaults on initialize()', () => {
            service = setup();
            service.testRegister('success', 'task_alt');
            expect(service.resolve(TestSeverity.Success)).toBe('task_alt');

            service.testInitialize();
            expect(service.resolve(TestSeverity.Success)).toBe('check_circle');
            expect(service.resolve(TestSeverity.Error)).toBe('cancel');
        });

        it('should prefer constructor fontSet over MAT_ICON_DEFAULT_OPTIONS', () => {
            TestBed.configureTestingModule({
                providers: [
                    ExplicitFontSetService,
                    {
                        provide: MAT_ICON_DEFAULT_OPTIONS,
                        useValue: { fontSet: 'material-symbols-outlined' },
                    },
                ],
            });
            service = TestBed.inject(ExplicitFontSetService);
            expect(service.fontSet).toBe('Material Symbols Rounded');
        });
    });

    describe('with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token', () => {
        it('should use the token when no fontSet is passed to super()', () => {
            TestBed.configureTestingModule({
                providers: [
                    DefaultFontSetService,
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: 'material-symbols-rounded',
                    },
                ],
            });
            const service = TestBed.inject(DefaultFontSetService);
            expect(service.fontSet).toBe('material-symbols-rounded');
        });

        it('should prefer TBX_MAT_FONT_ICON_DEFAULT_FONT_SET over MAT_ICON_DEFAULT_OPTIONS', () => {
            TestBed.configureTestingModule({
                providers: [
                    DefaultFontSetService,
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: 'material-symbols-rounded',
                    },
                    {
                        provide: MAT_ICON_DEFAULT_OPTIONS,
                        useValue: { fontSet: 'material-symbols-sharp' },
                    },
                ],
            });
            const service = TestBed.inject(DefaultFontSetService);
            expect(service.fontSet).toBe('material-symbols-rounded');
        });
    });

    describe('with MAT_ICON_DEFAULT_OPTIONS fallback', () => {
        it('should use MAT_ICON_DEFAULT_OPTIONS.fontSet when no constructor arg or token', () => {
            TestBed.configureTestingModule({
                providers: [
                    DefaultFontSetService,
                    {
                        provide: MAT_ICON_DEFAULT_OPTIONS,
                        useValue: { fontSet: 'material-symbols-sharp' },
                    },
                ],
            });
            const service = TestBed.inject(DefaultFontSetService);
            expect(service.fontSet).toBe('material-symbols-sharp');
        });

        it('should skip MAT_ICON_DEFAULT_OPTIONS when it has no fontSet property', () => {
            TestBed.configureTestingModule({
                providers: [
                    DefaultFontSetService,
                    {
                        provide: MAT_ICON_DEFAULT_OPTIONS,
                        useValue: {},
                    },
                ],
            });
            expect(() => TestBed.inject(DefaultFontSetService)).toThrow(/no fontSet resolved/);
        });
    });

    describe('with no fontSet source', () => {
        it('should throw when no fontSet is available from any source', () => {
            TestBed.configureTestingModule({
                providers: [DefaultFontSetService],
            });
            expect(() => TestBed.inject(DefaultFontSetService)).toThrow(/no fontSet resolved/);
        });
    });
});
