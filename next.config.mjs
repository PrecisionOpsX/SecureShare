/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Marketing imagery - sourced from Unsplash's CDN.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        // Recipient view page MUST NOT be cached anywhere along the way.
        // Sender revokes a link, recipient refreshes - they have to see the
        // new state, not BFCache's last render of the "Download" page.
        source: "/d/:token*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
      {
        // Download endpoint re-validates token every call. Don't let a CDN
        // cache the 302 redirect either.
        source: "/api/d/:token*/download",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
