# **Social Media Backend**
This is a production-ready backend API built for a social media application using **Node.js**, **Express.js**, **MongoDB**, and **JWT authentication**.  
It supports core social media features like:

 * User registration & authentication
 * Following system
 * Posts with media and hashtags
 * Messaging & notifications
 * Profile privacy controls

# 🔗Open-Source Library

* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
* [express-validator](https://express-validator.github.io/docs/)
* [mongoose](https://mongoosejs.com/)
* [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)


# Tools and technologies used

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcrypt.js
* express-validator
* morgan (HTTP logging)
* dotenv (Environment config)

# Tech Stack ✨

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [JWT](https://www.npmjs.com/package/jsonwebtoken)
* [bcrypt.js](https://www.npmjs.com/package/bcryptjs)


# Clone this Repo To Your System Using Android Studio✨

* Step 1: Open your terminal and clone the repository: git clone <repository-url>
* Step 2: Navigate to the project directory: cd social-media-backend
* Step 3: Install dependencies: npm install
* Step 4: Create a .env file using .env.example and configure your environment variables.
* Step 5: Run the project: npm run dev

# Features

*  JWT-Based Authentication (Login/Signup)
*  User Profile Management & Privacy Settings
*  Follow / Unfollow Users
*  Create Posts with Media, Likes, Comments & Hashtags
*  Search Users & Filter Posts by Hashtags
*  Real-time Messaging System
*  Notification System
*  Protected Routes using Middleware
*  Input Validation with express-validator
*  Pagination, Indexing & Redis Caching for Performance
*  Swagger API Documentation (/api-docs)
*  Ready for Unit & Integration Testing

# Folder Structure
* social-media-backend/
* controllers/        # Route logic (auth, users, posts, etc.)
* routes/             # Route definitions
* models/             # Mongoose schemas (User, Post, Message, etc.)
* middlewares/        # JWT Auth, Error Handling, Validation
* utils/              # Privacy checks and helper functions
* config/             # Database and Redis configuration
* swagger/            # Swagger config and setup
* .env.example        # Sample environment variables
* server.js           # Entry point
* README.md           # Project documentation

# Authentication
* All protected routes require a Bearer token in the Authorization header:

* Authorization: Bearer <your_token>

# API Endpoints

*  Base URL
*  http://localhost:5000/api
  
*  Version
*  API Version: 1.0.0

# Auth Routes  
* Base URL  

* | Method | Endpoint     | Description          |
* |--------|--------------|----------------------|
* | POST   | /auth/signup | Register a new user  |
* | POST   | /auth/login  | Login existing user  |

# User Routes  
* Base URL  

* | Method  | Endpoint                        | Description                          |
* |---------|----------------------------------|--------------------------------------|
* | GET     | /users/profile                   | Get current user's profile           |
* | GET     | /users/profile/:id               | Get another user’s profile           |
* | PUT     | /users/update                    | Update profile or privacy settings   |
* | GET     | /users/search?q=keyword          | Search users                         |
* | PUT     | /users/follow/:id                | Follow or unfollow a user            |
* | GET     | /users/follow-data               | Get followers and following          |
* | DELETE  | /users/admin/deleteUser/:id      | Delete a user (Admin only)           |

# Post Routes  
* Base URL  

* | Method | Endpoint              | Description                          |
* |--------|------------------------|--------------------------------------|
* | POST   | /posts/create          | Create a new post                    |
* | PUT    | /posts/like/:id        | Like or Unlike a post                |
* | PUT    | /posts/bookmark/:id    | Bookmark or Unbookmark a post        |
* | POST   | /posts/comment/:id     | Comment on a post                    |
* | GET    | /posts/hashtag/:tag    | Get posts by hashtag                 |
* | GET    | /posts/public?page=1   | Get public posts with pagination     |

# Messaging Routes  
* Base URL  

* | Method | Endpoint                | Description                         |
* |--------|-------------------------|-------------------------------------|
* | POST   | /messages               | Send a message to another user      |
* | GET    | /messages/:userId       | Get conversation with a user        |
* | PUT    | /messages/read/:userId  | Mark messages as read               |

# Notification Routes  
* Base URL  

* | Method | Endpoint              | Description               |
* |--------|-----------------------|---------------------------|
* | GET    | /notifications        | Get all notifications     |
* | PUT    | /notifications/read   | Mark all as read          |


# Privacy Settings

*  Use the /users/update endpoint with a body like:
*  {
*   "privacy": {
*     "profile": "followers",
*     "posts": "public"
*   }
* }

# Error Handling

* Test error route:

* | Method | Endpoint           | Response               |
* |--------|--------------------|------------------------|
* | GET    | /invalid-endpoint  | 404 Not Found (JSON)   |

# Response Codes

* | Code | Meaning                  |
* |------|--------------------------|
* | 200  | OK / Success             |
* | 201  | Created                  |
* | 400  | Bad Request              |
* | 401  | Unauthorized             |
* | 403  | Forbidden                |
* | 404  | Not Found                |
* | 500  | Internal Server Error    |

# Testing & API Exploration

* You can test all routes using:
* Postman
* Swagger UI: http://localhost:5000/api-docs
* cURL or any REST client

* Make sure your server is running locally on http://localhost:5000.

# Example .env File
* PORT=5000
* MONGO_URI=mongodb+srv://<your-mongo-uri>
* JWT_SECRET=your_jwt_secret

# Deployment

* This backend can be deployed on:
* Render
* Vercel (serverless functions)
* Heroku
* AWS EC2 / Lightsail

# Developer
*  Mayuri Mahendra Ambelkar.
