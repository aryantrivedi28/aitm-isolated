/** @type {import('postcss-load-config').Config} */
const config = {
  functions: {
    "app/api/**": {
      maxDuration: 60,
    },
  },
  plugins: {
    tailwindcss: {},
  },
};

export default config;
