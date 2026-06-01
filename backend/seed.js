/* ═══════════════════════════════════════════════════
   CONFIG/SEED.JS — Seed the database with sample data
   Run: npm run seed
   ═══════════════════════════════════════════════════ */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Project  = require('../models/Project');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const PROJECTS = [
  {
    title: 'NovaPay Dashboard',
    description: 'Real-time financial analytics dashboard with live transaction feeds, fraud detection, and multi-currency support built for 50k+ daily users.',
    tags: ['React', 'Node.js', 'MongoDB', 'WebSockets', 'Chart.js'],
    category: 'fullstack',
    emoji: '💳',
    featured: true,
    order: 1,
    liveUrl: 'https://demo.example.com/novapay',
    githubUrl: 'https://github.com/example/novapay',
    stats: { stars: 312, forks: 48, views: 2400 }
  },
  {
    title: 'AtmosAI',
    description: 'AI-powered weather forecasting app using ML models for hyper-local predictions. PWA with offline support and push notifications.',
    tags: ['Next.js', 'Python', 'TensorFlow', 'PostgreSQL', 'PWA'],
    category: 'fullstack',
    emoji: '🌤',
    featured: true,
    order: 2,
    liveUrl: 'https://demo.example.com/atmosai',
    githubUrl: 'https://github.com/example/atmosai',
    stats: { stars: 189, forks: 31, views: 1850 }
  },
  {
    title: 'Luminary CMS',
    description: 'Headless content management system with visual page builder, multi-tenant support, and a GraphQL API consumed by 200+ websites.',
    tags: ['Vue.js', 'GraphQL', 'Express', 'Redis', 'PostgreSQL'],
    category: 'fullstack',
    emoji: '✏️',
    featured: true,
    order: 3,
    liveUrl: 'https://demo.example.com/luminary',
    githubUrl: 'https://github.com/example/luminary',
    stats: { stars: 445, forks: 87, views: 3100 }
  },
  {
    title: 'Helios Design System',
    description: 'Comprehensive React component library with 80+ accessible components, dark/light theming, and Figma integration.',
    tags: ['React', 'TypeScript', 'Storybook', 'CSS'],
    category: 'frontend',
    emoji: '🎨',
    order: 4,
    liveUrl: 'https://demo.example.com/helios',
    githubUrl: 'https://github.com/example/helios',
    stats: { stars: 892, forks: 156, views: 5400 }
  },
  {
    title: 'FlowAPI Gateway',
    description: 'High-performance API gateway with rate limiting, auth middleware, request caching, and a developer portal handling 2M+ requests/day.',
    tags: ['Node.js', 'Redis', 'Docker', 'Nginx', 'Express'],
    category: 'backend',
    emoji: '⚡',
    order: 5,
    liveUrl: '#',
    githubUrl: 'https://github.com/example/flowapi',
    stats: { stars: 234, forks: 42, views: 1600 }
  },
  {
    title: 'Orbit Social',
    description: 'Community platform for developers with real-time chat, code sharing with syntax highlighting, and reputation-based Q&A.',
    tags: ['React', 'Socket.io', 'MongoDB', 'AWS', 'Node.js'],
    category: 'fullstack',
    emoji: '🚀',
    order: 6,
    liveUrl: 'https://demo.example.com/orbit',
    githubUrl: 'https://github.com/example/orbit',
    stats: { stars: 127, forks: 19, views: 980 }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Project.deleteMany({});
    console.log('🗑  Cleared existing projects');

    // Insert seed data
    const inserted = await Project.insertMany(PROJECTS);
    console.log(`🌱 Seeded ${inserted.length} projects`);

    console.log('\nProjects seeded:');
    inserted.forEach(p => console.log(`  • ${p.title} (${p.category})`));

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Done. Database disconnected.');
  }
}

seed();