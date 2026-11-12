module.exports = {
  input: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  output: './public/locales/',
  options: {
    debug: true,
    defaultNs: 'common',
    ns: ['common', 'translation'],
    func: {
      list: ['t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      extensions: ['.js', '.jsx'],
      fallbackKey: (ns, value) => value,
    },
    lngs: ['en', 'ar'],
    defaultValue: (lng, ns, key) => key,
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: '{{lng}}/{{ns}}.json'
    }
  }
};