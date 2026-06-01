require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');

const projectRoutes  = require('./routes/projects');
const contactRoutes  = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: '*' }));

app.use('/api/projects',  projectRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
  });