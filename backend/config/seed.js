require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
const mongoose = require('mongoose');
const Project  = require('../models/Project');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const PROJECTS = [
  {
    title: 'NovaPay Dashboard',
    description: 'Real-time financial analytics dashboard with live transaction feeds, fraud detection, and multi-currency support.',
    tags: ['React', 'Node.js', 'MongoDB', 'WebSockets'],
    category: 'fullstack', emoji: '💳', featured: true, order: 1,
    liveUrl: '#', githubUrl: '#'
  },
  {
    title: 'AtmosAI',
    description: 'AI-powered weather forecasting app using ML models for hyper-local predictions with offline support.',
    tags: ['Next.js', 'Python', 'TensorFlow', 'PostgreSQL'],
    category: 'fullstack', emoji: '🌤', featured: true, order: 2,
    liveUrl: '#', githubUrl: '#'
  },
  {
    title: 'Luminary CMS',
    description: 'Headless CMS with visual page builder, multi-tenant support, and a GraphQL API.',
    tags: ['Vue.js', 'GraphQL', 'Express', 'Redis'],
    category: 'fullstack', emoji: '✏️', featured: true, order: 3,
    liveUrl: '#', githubUrl: '#'
  },
  {
    title: 'Helios Design System',
    description: 'React component library with 80+ accessible components, dark/light theming, and Figma integration.',
    tags: ['React', 'TypeScript', 'Storybook', 'CSS'],
    category: 'frontend', emoji: '🎨', order: 4,
    liveUrl: '#', githubUrl: '#'
  },
  {
    title: 'FlowAPI Gateway',
    description: 'High-performance API gateway with rate limiting, auth middleware, and request caching.',
    tags: ['Node.js', 'Redis', 'Docker', 'Nginx'],
    category: 'backend', emoji: '⚡', order: 5,
    liveUrl: '#', githubUrl: '#'
  },
  {
    title: 'Orbit Social',
    description: 'Community platform for developers with real-time chat and reputation-based Q&A.',
    tags: ['React', 'Socket.io', 'MongoDB', 'AWS'],
    category: 'fullstack', emoji: '🚀', order: 6,
    liveUrl: '#', githubUrl: '#'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Project.deleteMany({});
    console.log('🗑  Cleared existing projects');
    const inserted = await Project.insertMany(PROJECTS);
    console.log(`🌱 Seeded ${inserted.length} projects`);
    inserted.forEach(p => console.log(`  • ${p.title}`));
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.log('\n💡 Is MongoDB running? Start it first, then try again.');
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Done. Database disconnected.');
  }
}

seed();