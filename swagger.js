// // swagger.js
// const swaggerJSDoc = require('swagger-jsdoc');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Social Media API',
//       version: '1.0.0',
//       description: 'Backend API for a social media platform',
//     },
//     servers: [
//       {
//         url: 'http://localhost:5000/api',
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//     security: [{ bearerAuth: [] }],
//   },
//   apis: ['./routes/*.js'], // path to your route files
// };

// const swaggerSpec = swaggerJSDoc(options);
// module.exports = swaggerSpec;

// swagger.js
// const swaggerJSDoc = require('swagger-jsdoc');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Social Media API',
//       version: '1.0.0',
//       description: 'Backend API for a social media platform',
//     },
//     servers: [
//       {
//         url: 'http://localhost:5000/api',
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//     security: [{ bearerAuth: [] }],
//   },
//   apis: ['./routes/*.js'], // path to your route files
// };

// const swaggerSpec = swaggerJSDoc(options);
// module.exports = swaggerSpec;



const swaggerJsDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Social Media API',
    version: '1.0.0',
    description: 'Comprehensive REST API for a social media app',
    contact: {
      name: 'Your Name',
      email: 'your@email.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'User', description: 'User profile and management' },
    { name: 'Posts', description: 'Create, like, comment on posts' },
    { name: 'Messaging', description: 'Direct messaging' },
    { name: 'Notifications', description: 'Notification system' },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Swagger will look for JSDoc comments here
};

module.exports = swaggerJsDoc(options);
