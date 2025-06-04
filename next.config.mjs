/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Configurações específicas para o lado do cliente
    if (!isServer) {
      // Polyfills completos para módulos Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Core modules
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: false,
        https: false,
        os: false,
        url: require.resolve('url'),
        zlib: false,
        fs: false,
        path: require.resolve('path-browserify'),
        util: require.resolve('util'),
        process: require.resolve('process/browser'),
        events: require.resolve('events'),
        
        // Specific modules needed by onnxruntime-web
        long: require.resolve('long'),
        
        // Additional fallbacks
        querystring: false,
        punycode: false,
        domain: false,
        constants: false,
        vm: false,
        child_process: false,
        cluster: false,
        dgram: false,
        dns: false,
        module: false,
        net: false,
        readline: false,
        repl: false,
        tls: false,
        tty: false,
        worker_threads: false,
      }

      // Adicionar plugins para polyfills - CRÍTICO para onnxruntime-web
      config.plugins.push(
        new config.webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      )

      // Adicionar plugin para definir Buffer globalmente
      config.plugins.push(
        new config.webpack.DefinePlugin({
          'global.Buffer': 'Buffer',
          'global.process': 'process',
        })
      )

      // Aliases para evitar problemas com módulos específicos
      config.resolve.alias = {
        ...config.resolve.alias,
        'sharp$': false,
        'onnxruntime-node$': false,
        'onnxruntime-react-native$': false,
        // Força uso de versões browser-friendly
        'crypto': 'crypto-browserify',
        'stream': 'stream-browserify',
        'path': 'path-browserify',
        'buffer': require.resolve('buffer'),
      }

      // Configurações específicas para onnxruntime-web
      config.resolve.mainFields = ['browser', 'module', 'main']
    }

    // Configurar para lidar com arquivos WASM e binários
    config.module.rules.push(
      {
        test: /\.wasm$/,
        type: 'asset/resource',
      },
      {
        test: /\.(wasm|onnx)$/,
        type: 'asset/resource',
      }
    )

    // Configurações para resolver módulos ES
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })

    // Ignorar warnings específicos
    config.ignoreWarnings = [
      { module: /node_modules\/@xenova\/transformers/ },
      { module: /node_modules\/onnxruntime-web/ },
      { module: /node_modules\/long/ },
      { message: /Critical dependency/ },
      { message: /Can't resolve/ },
      { message: /Module not found/ },
      { message: /require function/ },
      { message: /module "buffer" not found/ },
    ]

    // Configurações de otimização
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          transformers: {
            test: /[\\/]node_modules[\\/]@xenova[\\/]transformers/,
            name: 'transformers',
            chunks: 'all',
            priority: 10,
          },
          onnx: {
            test: /[\\/]node_modules[\\/]onnxruntime-web/,
            name: 'onnxruntime',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    }

    return config
  },
  
  // Configurações experimentais
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers', 'onnxruntime-web'],
    esmExternals: 'loose',
  },

  // Headers para SharedArrayBuffer (necessário para alguns modelos)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
