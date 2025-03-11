module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0,
    'prefer-const': 'off',
    'dot-notation': 'off',
    'quote-props': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
