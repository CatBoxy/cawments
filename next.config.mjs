/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "your-cloudinary-domain.cloudinary.com"
    ]
  }
};

export default nextConfig;
