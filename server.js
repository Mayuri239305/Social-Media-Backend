const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


//client.connect().catch(console.error);


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Import routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test'); // ✅ New route added
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const notificationRoutes = require('./routes/notification');
const messageRoutes = require('./routes/message');
const errorHandler = require('./middlewares/errorMiddleware');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes); // ✅ Mount new test route
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use(errorHandler);
app.use(morgan('dev'));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

