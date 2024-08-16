import path from 'node:path'

export const alias = {
  '@assets': path.resolve(__dirname, '../src/assets'),
  '@common': path.resolve(__dirname, '../src/common'),
  '@components': path.resolve(__dirname, '../src/components'),
  '@composables': path.resolve(__dirname, '../src/composables'),
  '@constants': path.resolve(__dirname, '../src/constants'),
  '@directives': path.resolve(__dirname, '../src/directives'),
  '@helpers': path.resolve(__dirname, '../src/helpers'),
  '@layouts': path.resolve(__dirname, '../src/layouts'),
  '@plugins': path.resolve(__dirname, '../src/plugins'),
  '@views': path.resolve(__dirname, '../src/views'),
  '@router': path.resolve(__dirname, '../src/router'),
  '@service': path.resolve(__dirname, '../src/service'),
  '@store': path.resolve(__dirname, '../src/store'),
  '@styles': path.resolve(__dirname, '../src/styles'),
  '@utils': path.resolve(__dirname, '../src/utils'),
  '@config': path.resolve(__dirname, '../src/config'),
  '@mocks': path.resolve(__dirname, '../src/mocks')
}
