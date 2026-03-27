import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { TbxMatSvgIconService } from './svg-icon.service';

// Concrete test subclass to exercise protected register() and abstract resolve().
enum TestIcon {
    Logo = 'logo',
    Badge = 'badge',
}

@Injectable()
class TestTbxMatSvgIconService extends TbxMatSvgIconService<TestIcon> {
    private readonly icons = new Map<string, string>();

    constructor() {
        super();
        this.icons.set(TestIcon.Logo, TestIcon.Logo);
        this.icons.set(TestIcon.Badge, TestIcon.Badge);
        this.register(TestIcon.Logo, '<svg>logo</svg>');
        this.register(TestIcon.Badge, '<svg>badge</svg>');
    }

    override resolve(name: TestIcon): string | undefined;
    override resolve(name: string): string | undefined;
    override resolve(name: string): string | undefined {
        return this.icons.get(name);
    }

    // Expose register for direct testing.
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

    it('should ignore duplicate registrations for the same name', () => {
        service = setup();
        const addSpy = vi.spyOn(MatIconRegistry.prototype, 'addSvgIconLiteral');

        service.testRegister('logo', '<svg>logo-v2</svg>');

        expect(addSpy).not.toHaveBeenCalled();
        addSpy.mockRestore();
    });
});
