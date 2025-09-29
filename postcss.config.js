module.exports = {
  plugins: [
    require('postcss-import')({
      // Process @import statements
      path: ['assets/css']
    }),
    require('cssnano')({
      preset: ['default', {
        // Optimize CSS but preserve custom properties and modern features
        normalizeWhitespace: true,
        discardComments: { removeAll: true },
        minifySelectors: true,
        minifyParams: true,
        // Keep CSS custom properties intact
        reduceIdents: false,
        zindex: false,
        // Don't merge rules that might break CSS custom property inheritance
        mergeRules: false
      }]
    })
  ]
};