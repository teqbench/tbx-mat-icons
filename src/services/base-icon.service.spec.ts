import { describe, it, expect } from 'vitest';
import { TbxMatIconService } from './base-icon.service';
import { TbxMatIconType } from '../types/icon-type.type';

enum TestIcon {
    Success = 'success',
    Error = 'error',
}

/** Minimal concrete subclass — no initialize() override, empty registry. */
class EmptyService extends TbxMatIconService<TestIcon> {
    readonly iconType = TbxMatIconType.Font;
    testRegister(name: string, value: string): void {
        this.register(name, value);
    }

    testReset(): void {
        this.reset();
    }

    testInitialize(): void {
        this.initialize();
    }
}

/**
 * Subclass that registers defaults via initialize().
 * Calls initialize() from the constructor to simulate the pattern used
 * by intermediate classes (TbxMatFontIconService, TbxMatSvgIconService).
 */
class DefaultsService extends TbxMatIconService<TestIcon> {
    readonly iconType = TbxMatIconType.Font;

    constructor() {
        super();
        this.initialize();
    }

    protected override initialize(): void {
        super.initialize();
        this.register(TestIcon.Success, 'check_circle');
        this.register(TestIcon.Error, 'cancel');
    }

    testRegister(name: string, value: string): void {
        this.register(name, value);
    }

    testInitialize(): void {
        this.initialize();
    }
}

describe('TbxMatIconService', () => {
    describe('register and resolve', () => {
        it('should resolve a registered key', () => {
            const service = new EmptyService();
            service.testRegister('success', 'check_circle');

            expect(service.resolve(TestIcon.Success)).toBe('check_circle');
        });

        it('should resolve via string overload', () => {
            const service = new EmptyService();
            service.testRegister('success', 'check_circle');

            expect(service.resolve('success')).toBe('check_circle');
        });

        it('should return undefined for unregistered keys', () => {
            const service = new EmptyService();

            expect(service.resolve(TestIcon.Success)).toBeUndefined();
            expect(service.resolve('unknown')).toBeUndefined();
        });

        it('should replace value when re-registering the same key', () => {
            const service = new EmptyService();
            service.testRegister('success', 'check_circle');
            service.testRegister('success', 'task_alt');

            expect(service.resolve(TestIcon.Success)).toBe('task_alt');
        });

        it('should register multiple keys independently', () => {
            const service = new EmptyService();
            service.testRegister('success', 'check_circle');
            service.testRegister('error', 'cancel');

            expect(service.resolve(TestIcon.Success)).toBe('check_circle');
            expect(service.resolve(TestIcon.Error)).toBe('cancel');
        });
    });

    describe('reset', () => {
        it('should clear all registered icons', () => {
            const service = new EmptyService();
            service.testRegister('success', 'check_circle');
            service.testRegister('error', 'cancel');

            service.testReset();

            expect(service.resolve(TestIcon.Success)).toBeUndefined();
            expect(service.resolve(TestIcon.Error)).toBeUndefined();
        });
    });

    describe('initialize', () => {
        it('should populate defaults from subclass override', () => {
            const service = new DefaultsService();

            expect(service.resolve(TestIcon.Success)).toBe('check_circle');
            expect(service.resolve(TestIcon.Error)).toBe('cancel');
        });

        it('should restore defaults after replacement', () => {
            const service = new DefaultsService();
            service.testRegister('success', 'task_alt');
            expect(service.resolve(TestIcon.Success)).toBe('task_alt');

            service.testInitialize();

            expect(service.resolve(TestIcon.Success)).toBe('check_circle');
            expect(service.resolve(TestIcon.Error)).toBe('cancel');
        });

        it('should clear non-default keys when re-initialized', () => {
            const service = new DefaultsService();
            service.testRegister('extra', 'star');
            expect(service.resolve('extra')).toBe('star');

            service.testInitialize();

            expect(service.resolve('extra')).toBeUndefined();
        });

        it('should clear all keys on base initialize when no override', () => {
            const service = new EmptyService();
            service.testRegister('success', 'check_circle');

            service.testInitialize();

            expect(service.resolve(TestIcon.Success)).toBeUndefined();
        });
    });
});
