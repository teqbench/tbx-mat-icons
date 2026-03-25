import { describe, it, expect } from 'vitest';
import { Injectable } from '@angular/core';
import { FontIconService } from './font-icon.service';

enum TestSeverity {
    Success = 'success',
    Error = 'error',
}

@Injectable()
class TestFontIconService extends FontIconService<TestSeverity> {
    private readonly ligatures = new Map<string, string>([
        [TestSeverity.Success, 'check_circle'],
        [TestSeverity.Error, 'cancel'],
    ]);

    constructor() {
        super('Material Symbols Rounded');
    }

    override resolve(name: TestSeverity): string | undefined;
    override resolve(name: string): string | undefined;
    override resolve(name: string): string | undefined {
        return this.ligatures.get(name);
    }
}

describe('FontIconService', () => {
    let service: TestFontIconService;

    function setup(): TestFontIconService {
        return new TestFontIconService();
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

    it('should be an instance of FontIconService', () => {
        service = setup();
        expect(service).toBeInstanceOf(FontIconService);
    });
});
