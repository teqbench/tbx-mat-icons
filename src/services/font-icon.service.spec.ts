import { describe, it, expect } from 'vitest';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TbxMatFontIconService } from './font-icon.service';

enum TestSeverity {
    Success = 'success',
    Error = 'error',
}

const LIGATURES = new Map<string, string>([
    [TestSeverity.Success, 'check_circle'],
    [TestSeverity.Error, 'cancel'],
]);

/** Subclass that passes fontSet explicitly via super(). */
@Injectable()
class ExplicitFontSetService extends TbxMatFontIconService<TestSeverity> {
    constructor() {
        super('Material Symbols Rounded');
    }

    override resolve(name: TestSeverity): string | undefined;
    override resolve(name: string): string | undefined;
    override resolve(name: string): string | undefined {
        return LIGATURES.get(name);
    }
}

/** Subclass that omits fontSet — relies on the injection token default. */
@Injectable()
class DefaultFontSetService extends TbxMatFontIconService<TestSeverity> {
    constructor() {
        super();
    }

    override resolve(name: TestSeverity): string | undefined;
    override resolve(name: string): string | undefined;
    override resolve(name: string): string | undefined {
        return LIGATURES.get(name);
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

        it('should prefer constructor fontSet over injected default', () => {
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
    });

    describe('with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token', () => {
        it('should use the injected default when no fontSet is passed to super()', () => {
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
    });

    describe('with neither constructor arg nor token', () => {
        it('should throw when no fontSet is available', () => {
            TestBed.configureTestingModule({
                providers: [DefaultFontSetService],
            });
            expect(() => TestBed.inject(DefaultFontSetService)).toThrow(
                /no fontSet provided and TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token is not configured/
            );
        });
    });
});
