/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        long: false,
        protobufjs: false,
        'onnxruntime-web': false,
        '@xenova/transformers': false,
      }
      
      // Ignore specific modules that cause issues
      config.externals = config.externals || []
      config.externals.push({
        'onnxruntime-web': 'onnxruntime-web',
        'long': 'long',
        'protobufjs': 'protobufjs'
      })
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers', 'onnxruntime-web'],
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
