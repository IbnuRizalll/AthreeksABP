const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('copy').tap(args => {
      const patterns = args[0].patterns
      if (Array.isArray(patterns)) {
        patterns.forEach(pattern => {
          pattern.globOptions = pattern.globOptions || {}
          const ignore = pattern.globOptions.ignore || []
          pattern.globOptions.ignore = Array.isArray(ignore)
            ? [...ignore, '**/index.html']
            : [ignore, '**/index.html']
        })
      }
      return args
    })
  }
})
