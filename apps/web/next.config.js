import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/sonde", destination: "/docs/foundations/sonde", permanent: true },
      {
        source: "/sondage-manifest",
        destination: "/docs/foundations/sondage-manifest",
        permanent: true,
      },
      {
        source: "/examples",
        destination: "/docs/integration/examples",
        permanent: true,
      },
      {
        source: "/cli-reference",
        destination: "/docs/reference-implementation/cli-reference",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
