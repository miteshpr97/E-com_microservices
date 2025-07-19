import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // 👈 Add this line to allow Cloudinary images
  },
};

export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true, // Enables React's strict mode for development
//   swcMinify: true, // Use SWC for minification (faster builds)
//   images: {
//     domains: ["example.com"], // Allow external images from specified domains
//   },
//   redirects: async () => [
//     {
//       source: "/", // Redirect from root URL
//       destination: "/auth/login", // Redirect to login page
//       permanent: true, // Permanent redirect (308)
//     },
//   ],
// };

// export default nextConfig;
