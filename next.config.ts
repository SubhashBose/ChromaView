import type {NextConfig} from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS || false;
var isGithubActions = false;

let assetPrefix = '';
let basePath = '';

if (isGithubActions) {
  // trim off `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '') || '';
  assetPrefix = `/${repo}`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
