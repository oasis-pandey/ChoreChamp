# 🏠 ChoreChamp Backend

A Node.js/Express.js REST API backend for the ChoreChamp household chore management application.

## 🚀 Overview

The ChoreChamp backend provides a secure, scalable API for managing household chores, user authentication, and group collaboration. Built with modern Node.js technologies and designed for easy deployment.

## 🛠️ Technology Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt hashing
- **Environment**: dotenv for configuration
- **CORS**: Configurable cross-origin resource sharing

## 📁 Project Structure

```
Backend/
├── models/
│   ├── User.js          # User schema and model
│   ├── Group.js         # Group schema and model
│   ├── Chore.js         # Chore schema and model
│   └── choreLog.js      # Chore completion log schema
├── routes/
│   ├── userRoutes.js    # Authentication and user management
│   ├── groupRoutes.js   # Group creation and management
│   └── choreRoutes.js   # Chore CRUD operations
├── middleware/
│   └── authMiddleware.js # JWT authentication middleware
├── utils/
│   ├── generateToken.js  # JWT token generation
│   ├── generateCode.js   # Group invite code generation
│   └── passwordValidator.js # Password validation (simplified)
├── server.js            # Main application entry point
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables (not committed)
```

## 🔧 Environment Variables

Create a `.env` file in the Backend directory:

```properties
PORT=5001
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/chorechamp
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=development
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📦 Installation & Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

The server will start on `http://localhost:5001` (or your specified PORT).

## 🔐 Authentication

The API uses JWT-based authentication:

- **Registration/Login**: Returns JWT token
- **Protected Routes**: Require `Authorization: Bearer <token>` header
- **Token Validation**: Automatic validation via middleware
- **Session Management**: Tokens don't expire (consider adding expiration for production)

## 📡 API Endpoints

### Authentication Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |

### Group Routes (`/api/groups`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | Create new group | Yes |
| POST | `/join` | Join group with invite code | Yes |
| GET | `/my-groups` | Get user's groups | Yes |
| POST | `/leave` | Leave a group | Yes |
| GET | `/:groupId` | Get group details | Yes |

### Chore Routes (`/api/chores`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Get user's chore dashboard | Yes |
| POST | `/create` | Create new chore | Yes |
| POST | `/complete` | Mark chore as complete | Yes |
| GET | `/group/:groupId` | Get group's chores | Yes |
| POST | `/remove` | Remove completed chore | Yes |
| DELETE | `/:choreId` | Delete chore (admin only) | Yes |

### Health Check Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Basic health check | No |
| GET | `/api/health` | Detailed health status | No |

## 📋 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  groupIds: [ObjectId] (references to Groups),
  points: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Group Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  adminId: ObjectId (reference to User),
  memberIds: [ObjectId] (references to Users),
  inviteCode: String (unique, 6 characters),
  createdAt: Date,
  updatedAt: Date
}
```

### Chore Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  assignedTo: ObjectId (reference to User),
  groupId: ObjectId (reference to Group),
  dueDate: Date,
  isCompleted: Boolean (default: false),
  completedBy: ObjectId (reference to User),
  completedAt: Date,
  points: Number (default: 10),
  priority: String (Low/Medium/High),
  createdAt: Date,
  updatedAt: Date
}
```

### ChoreLog Model
```javascript
{
  _id: ObjectId,
  choreId: ObjectId (reference to Chore),
  userId: ObjectId (reference to User),
  groupId: ObjectId (reference to Group),
  completedAt: Date,
  note: String,
  pointsEarned: Number
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Mongoose schema validation
- **Protected Routes**: Middleware-based route protection
- **Error Handling**: Comprehensive error responses

## 🚀 Deployment

### Render.com (Recommended)

1. **Connect Repository**: Link your GitHub repo
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**: Add all required env vars
5. **Auto Deploy**: Enable auto-deploy from main branch

### Environment Variables for Production
```properties
NODE_ENV=production
PORT=5001
MONGO_URL=mongodb+srv://...
JWT_SECRET=secure_production_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## 📊 API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {...},
  "_id": "document_id",
  "status": "success"
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error message",
  "status": "error"
}
```

## 🧪 Testing

The API can be tested using:

- **Postman**: Import collection with all endpoints
- **cURL**: Command-line testing
- **Frontend Integration**: Direct integration testing

### Example cURL Commands

```bash
# Health Check
curl https://chorechamp-backend.onrender.com/

# Register User
curl -X POST https://chorechamp-backend.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password"}'

# Login
curl -X POST https://chorechamp-backend.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📈 Performance & Scalability

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: MongoDB connection optimization
- **Error Handling**: Graceful error responses
- **CORS Configuration**: Production-ready CORS settings
- **Environment-based Config**: Different settings for dev/prod

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGO_URL format
   - Verify database credentials
   - Ensure IP whitelist includes your server

2. **CORS Errors**
   - Update CORS_ORIGIN environment variable
   - Check frontend domain configuration

3. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token format in requests

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on the port

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the ChoreChamp application suite.

---

**ChoreChamp Backend** - Powering household chore management with modern Node.js technology! 🏠✨
