# Mini User Management System

A full-stack user management system built with Node.js/Express backend and React frontend, featuring authentication, role-based access control (RBAC), and user administration capabilities.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Features](#security-features)

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Logging**: Morgan

### Frontend
- **Framework**: React 18 (with Hooks)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Build Tool**: Vite

## Features

### Authentication
- User signup with email validation
- User login with JWT token generation
- Secure logout functionality
- Get current authenticated user information
- Protected routes with authentication middleware

### Admin Features
- View all users with pagination (10 users per page)
- Activate/deactivate user accounts
- Role-based access control (admin-only endpoints)
- Prevent self-deactivation

### User Features
- View own profile information
- Update profile (name and email)
- Change password with current password verification
- View account status and role

### Security
- Password hashing using bcryptjs
- JWT token-based authentication
- Protected API routes
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Environment variable management

## Project Structure

```
Mini-User-Management_System/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # Authentication & authorization middleware
│   ├── models/
│   │   └── User.js          # User schema/model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── users.js         # User management routes
│   ├── tests/
│   │   ├── auth.test.js     # Authentication tests
│   │   └── users.test.js    # User management tests
│   ├── utils/
│   │   └── generateToken.js # JWT token generation
│   ├── server.js            # Express app entry point
│   ├── package.json
│   ├── jest.config.js
│   └── env.example.txt      # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   ├── ProtectedRoute.jsx   # Route protection
│   │   │   └── ConfirmModal.jsx     # Confirmation modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Signup.jsx           # Signup page
│   │   │   ├── AdminDashboard.jsx   # Admin dashboard
│   │   │   └── UserProfile.jsx      # User profile page
│   │   ├── utils/
│   │   │   └── api.js               # Axios configuration
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `env.example.txt`):
```bash
cp env.example.txt .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` (or the next available port)

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `JWT_EXPIRE` | JWT token expiration time | No | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |

### Frontend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | No | http://localhost:5000/api |

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active"
    }
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active"
    }
  }
}
```

#### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/auth/logout
Logout (client-side token removal).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### User Management Endpoints (Admin Only)

#### GET /api/users
Get all users with pagination.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "John Doe",
        "role": "user",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "lastLogin": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "usersPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### PATCH /api/users/:id/activate
Activate a user account.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active"
    }
  }
}
```

#### PATCH /api/users/:id/deactivate
Deactivate a user account.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "inactive"
    }
  }
}
```

### User Profile Endpoints

#### GET /api/users/profile
Get current user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PATCH /api/users/profile
Update current user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "updated@example.com",
      "fullName": "Updated Name",
      "role": "user",
      "status": "active"
    }
  }
}
```

#### PATCH /api/users/profile/password
Change password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Testing

### Backend Tests

Run tests from the backend directory:

```bash
cd backend
npm test
```

The test suite includes:
- Authentication tests (signup, login validation)
- User management tests (admin endpoints, profile updates, password changes)
- Authorization tests (RBAC verification)

**Test Coverage:**
- Signup with valid/invalid data
- Login with valid/invalid credentials
- Admin-only endpoint access control
- User profile updates
- Password change functionality
- User activation/deactivation

### Frontend Testing

Frontend components can be tested manually or with testing libraries like React Testing Library (not included in current setup).

## Deployment

### Backend Deployment (Render/Railway)

1. **Prepare for deployment:**
   - Ensure all environment variables are set in your hosting platform
   - Update `FRONTEND_URL` to your frontend deployment URL
   - Set `NODE_ENV=production`

2. **Render Deployment:**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables in Render dashboard

3. **Railway Deployment:**
   - Connect your GitHub repository
   - Railway will auto-detect Node.js
   - Add environment variables in Railway dashboard

### Frontend Deployment (Vercel/Netlify)

1. **Vercel Deployment:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable `VITE_API_URL` with your backend URL

2. **Netlify Deployment:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable `VITE_API_URL` with your backend URL

### Database Deployment

Use MongoDB Atlas (cloud-hosted MongoDB):
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in your backend environment variables
4. Whitelist your deployment IP addresses

## Security Features

1. **Password Security:**
   - Passwords are hashed using bcryptjs (salt rounds: 10)
   - Password requirements: minimum 6 characters, must contain uppercase, lowercase, and number

2. **Authentication:**
   - JWT tokens with expiration
   - Token stored in localStorage (frontend)
   - Automatic token validation on protected routes

3. **Authorization:**
   - Role-based access control (RBAC)
   - Admin-only endpoints protected by middleware
   - Users cannot deactivate their own accounts

4. **Input Validation:**
   - Email format validation
   - Password strength requirements
   - Input sanitization using express-validator

5. **CORS:**
   - Configured to allow requests from frontend URL only
   - Credentials enabled for cookie-based auth (if needed)

6. **Error Handling:**
   - Proper HTTP status codes
   - Generic error messages to prevent information leakage
   - Detailed errors in development mode only

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required, lowercase),
  password: String (hashed, required),
  fullName: String (required, minlength: 2),
  role: String (enum: ['admin', 'user'], default: 'user'),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  createdAt: Date (auto),
  updatedAt: Date (auto),
  lastLogin: Date (nullable)
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.

