module.exports = ({ file, options, env }) => ({
  plugins: {
    'postcss-preset-env': options['postcss-preset-env'] ? options['postcss-preset-env'] : false,
    'cssnano': env === 'production' ? options['cssnano'] ? options['cssnano'] : false : false
  }
});