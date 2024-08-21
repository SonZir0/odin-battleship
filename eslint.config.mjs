import globals from 'globals';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: pluginJs.configs.recommended,
});

export default [
    eslintConfigPrettier,
    {
        ignores: ['eslint.config.?js'],
    },
    {
        overrides: [
            {
                files: ['tests/**/*'],
                env: {
                    jest: true,
                },
            },
        ],
    },
    ...compat.extends('airbnb-base', 'prettier'),
];
