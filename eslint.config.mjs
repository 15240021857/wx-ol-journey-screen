import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

const isProd = process.env.NODE_ENV === 'production'

const resolveVueConfigs = () => {
  const keys = Object.keys(pluginVue.configs || {})
  const flatKeys = keys.filter(k => k.startsWith('flat/'))
  const target = flatKeys.length
    ? flatKeys.includes('flat/vue3-essential')
      ? pluginVue.configs['flat/vue3-essential']
      : pluginVue.configs[flatKeys[0]]
    : pluginVue.configs['vue3-essential']
  if (!target) return []
  return Array.isArray(target) ? target : [target]
}

const vueConfigs = resolveVueConfigs()

const flatConfigPrettier =
  configPrettier && typeof configPrettier === 'object' && !Array.isArray(configPrettier)
    ? configPrettier
    : { rules: (configPrettier && configPrettier.rules) || {} }

const baseConfig = [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '*.log', '.DS_Store', '.vscode/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vueConfigs,
  flatConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: { prettier, vue: pluginVue },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: pluginVue.parser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },
  {
    rules: {
      'prettier/prettier': 'error',
      'no-console': isProd ? 'warn' : 'off',
      'no-debugger': isProd ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'vue/no-unused-vars': 'warn'
    }
  }
]

export default baseConfig.filter(cfg => cfg !== undefined && cfg !== null)
