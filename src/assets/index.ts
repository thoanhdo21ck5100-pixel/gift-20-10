// Use base-aware URLs so paths work seamlessly on GitHub Pages and local development
const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const assets = {
  girlfriendVideo: `${baseUrl}assets/aistudio/18d20bcd-db76-4a46-a882-de1a0e78d3fb_55fa5978.mp4`,
  girlfriendPhoto: `${baseUrl}assets/aistudio/27b83c9f-a0ef-4618-8b4e-fdaa92506814_f0f7e4fc.jpg`,
};
