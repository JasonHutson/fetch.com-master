exports.config =
  plugins:
    react:
      transformOptions:
        # options passed through to `react-tools.main.transformWithDetails()`
        harmony: yes    # include some es6 transforms
        sourceMap: no   # generate inline source maps
        stripTypes: no  # strip type annotations
      # if you use babel to transform jsx, transformOptions would be passed though to `babel.transform()`
      # See: http://babeljs.io/docs/usage/options/
      babel: false
    babel:
      # format:
      #   semicolons: false
      ignore: [
        /^(bower_components|vendor)/
        'app/legacyES5Code/**/*'
      ]
      pattern: /\.(es6|jsx|js)$/
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(bower_components|vendor)/
      order:
        before: [
          'vendor/react-with-addons.js',
        ]
    stylesheets:
      joinTo: 'styles/app.css'
    templates:
      joinTo: 'app.js'

