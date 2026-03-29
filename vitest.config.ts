import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    plugins: [angular({ jit: true, tsconfig: 'tsconfig.spec.json' })],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        passWithNoTests: false,
        coverage: {
            exclude: [
                // Constants
                'src/constants/font-set.constants.ts',
                // Tokens (InjectionToken declarations — no testable logic)
                'src/tokens/font-icon-default-font-set.token.ts',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                statements: 80,
                branches: 75,
                perFile: true,
            },
        },
    },
});
