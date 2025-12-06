import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 💡 This is where all your configuration options should go
  // (e.g., image optimization settings, redirects, etc.)
  
  // The 'eslint' configuration is now correctly inside the main object
  eslint: {
    // This tells Next.js NOT to run linting checks during the 'npm run build' step.
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;