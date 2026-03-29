import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { TbxMatSvgIconService } from './svg-icon.service';

// Concrete test subclass to exercise protected register() and inherited resolve().
enum TestIcon {
    Logo = 'logo',
    Badge = 'badge',
}

const ICON_SVG: Record<TestIcon, string> = {
    [TestIcon.Logo]: '<svg>logo</svg>',
    [TestIcon.Badge]: '<svg>badge</svg>',
};

@Injectable()
class TestTbxMatSvgIconService extends TbxMatSvgIconService<TestIcon> {
    protected override initialize(): void {
        super.initialize();
        for (const [name, svg] of Object.entries(ICON_SVG)) {
            this.register(name, svg);
        }
    }

    /** Expose register for direct testing. */
    testRegister(name: string, svg: string): void {
        this.register(name, svg);
    }
}

describe('TbxMatSvgIconService', () => {
    let service: TestTbxMatSvgIconService;

    function setup(): TestTbxMatSvgIconService {
        TestBed.configureTestingModule({
            providers: [TestTbxMatSvgIconService],
        });

        return TestBed.inject(TestTbxMatSvgIconService);
    }

    it('should be injectable', () => {
        service = setup();
        expect(service).toBeInstanceOf(TestTbxMatSvgIconService);
        expect(service).toBeInstanceOf(TbxMatSvgIconService);
    });

    it('should register SVG icons with MatIconRegistry via register()', () => {
        const addSpy = vi.spyOn(MatIconRegistry.prototype, 'addSvgIconLiteral');
        service = setup();

        expect(addSpy).toHaveBeenCalledWith('logo', expect.anything());
        expect(addSpy).toHaveBeenCalledWith('badge', expect.anything());
        expect(addSpy).toHaveBeenCalledTimes(2);
        addSpy.mockRestore();
    });

    it('should register additional icons via register() after construction', () => {
        service = setup();
        const addSpy = vi.spyOn(MatIconRegistry.prototype, 'addSvgIconLiteral');

        service.testRegister('extra', '<svg>extra</svg>');

        expect(addSpy).toHaveBeenCalledWith('extra', expect.anything());
        expect(addSpy).toHaveBeenCalledTimes(1);
        addSpy.mockRestore();
    });

    it('should resolve registered icon keys via resolve()', () => {
        service = setup();
        expect(service.resolve(TestIcon.Logo)).toBe('logo');
        expect(service.resolve(TestIcon.Badge)).toBe('badge');
    });

    it('should resolve string keys via the string overload', () => {
        service = setup();
        expect(service.resolve('logo')).toBe('logo');
    });

    it('should return undefined for unregistered keys', () => {
        service = setup();
        expect(service.resolve('unknown')).toBeUndefined();
    });

    it('should replace existing registration when re-registering the same name', () => {
        service = setup();
        const addSpy = vi.spyOn(MatIconRegistry.prototype, 'addSvgIconLiteral');

        service.testRegister('logo', '<svg>logo-v2</svg>');

        expect(addSpy).toHaveBeenCalledWith('logo', expect.anything());
        expect(addSpy).toHaveBeenCalledTimes(1);
        addSpy.mockRestore();
    });

    it('should still resolve the name after re-registration', () => {
        service = setup();
        service.testRegister('logo', '<svg>logo-v2</svg>');

        expect(service.resolve(TestIcon.Logo)).toBe('logo');
    });
});
