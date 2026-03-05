import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/sonde", destination: "/docs/sonde", permanent: true },
      {
        source: "/sondage-manifest",
        destination: "/docs/sondage-manifest",
        permanent: true,
      },
      { source: "/examples", destination: "/docs/examples", permanent: true },
      {
        source: "/cli-reference",
        destination: "/docs/cli-reference",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
