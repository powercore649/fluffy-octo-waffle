/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Les modèles mongoose sont importés depuis ../src/models (hors du dossier dashboard).
  // outputFileTracingRoot permet à Vercel/Next de bien inclure ces fichiers dans le bundle serverless.
  outputFileTracingRoot: require('path').join(__dirname, '..'),
};

module.exports = nextConfig;
