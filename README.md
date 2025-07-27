# 🏆 ChoreChamp

A full-stack web application for managing household chores and tasks within groups. ChoreChamp combines practical task organization with engaging gamification elements, making household management fun and collaborative.

## 🌟 Features

### 🔐 Authentication & Security
- **Secure Registration & Login**: JWT-based authentication with persistent sessions
- **Simple Password Requirements**: Any non-empty password accepted for ease of use
- **Interactive Password Indicator**: Clean, simple password entry with visual feedback
- **Secure Backend**: Server-side authentication and session management
- **Protected Routes**: Automatic redirect for unauthorized access
- **Session Management**: Secure token handling with automatic logout

### 👥 Advanced Group Management
- **Create Groups**: Start new groups with auto-generated 6-character invite codes
- **Join Groups**: Simple invite code system for joining existing groups
- **Multi-Group Support**: Users can be members of multiple groups simultaneously
- **Group Dashboard**: View all group members, statistics, and detailed activity
- **Member Management**: See individual member statistics and performance
- **Leave Groups**: Safe group departure with confirmation dialogs
- **Group Details**: Dedicated group pages with comprehensive management tools

### � Comprehensive Chore Management
- **Smart Chore Creation**: Add chores with name, description, and frequency (daily/weekly/monthly)
- **Flexible Assignment**: Assign chores to specific members or leave unassigned for anyone
- **Chore Completion**: Mark chores complete with optional notes and comments
- **Status Tracking**: Pending, completed, and removal states with visual indicators
- **Chore Categories**: Organized by assigned, group, and completed chores
- **Delete & Remove**: Creators can delete pending chores, completed chores can be removed
- **Assignment Visibility**: Clear indicators showing who is assigned to what

### 🎮 Gamification & Points System
- **Point Rewards**: Earn 10 points for each completed chore
- **User Statistics**: Track total points, completed chores, and group participation
- **Group Leaderboards**: Member rankings with detailed completion statistics
- **Progress Tracking**: Visual progress indicators and achievement tracking
- **Streak System**: Built-in foundation for consecutive completion rewards

### 🎨 Modern User Interface
- **Clean Design**: White header with black text and blue accent colors
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Interactive Elements**: Clickable logo navigation, hover effects, and smooth transitions
- **Visual Feedback**: Comprehensive loading states, success notifications, and error handling
- **Intuitive Navigation**: Clear routing between dashboard, groups, and chore management
- **Card-Based Layout**: Easy-to-scan information with consistent visual hierarchy

### 📊 Comprehensive Dashboard
- **Multi-Section Layout**: 
  - Personal statistics (points, groups, completed/pending chores)
  - Your assigned chores with completion actions
  - All group chores with assignment visibility
  - Recently completed chores with user attribution
- **Quick Actions**: Easy access to create groups, join groups, and create chores
- **Group Cards**: Visual group representation with member counts, invite codes, and quick actions
- **Real-time Updates**: Dashboard refreshes automatically after completing actions
- **Smart Filtering**: Different views for assigned vs. group chores

### 🏠 Group Detail Pages
- **Tabbed Interface**: Organized sections for chore creation, members, active chores, completed chores, and leaderboards
- **In-Page Chore Creation**: Create chores directly within group context
- **Member Statistics**: Individual member performance with completion counts
- **Group Activity**: Complete history of group chore activity
- **Leaderboard**: Points-based ranking system for group members

## 🛠 Technology Stack

### Backend
- **Node.js & Express.js**: RESTful API server with middleware support
- **MongoDB & Mongoose**: NoSQL database with object modeling
- **JWT Authentication**: Secure token-based authentication
- **bcrypt**: Advanced password hashing and validation
- **CORS**: Cross-origin resource sharing configuration
- **dotenv**: Environment variable management
- **Custom Middleware**: Authentication protection and request handling

### Frontend
- **React 19.1.0**: Modern component-based UI framework with hooks
- **React Router 7.7.1**: Advanced client-side routing with protected routes
- **TailwindCSS 3.4.0**: Utility-first CSS framework for responsive design
- **Axios 1.11.0**: HTTP client with interceptors and error handling
- **Context API**: Global state management for authentication
- **Custom Components**: Reusable UI components and form validation

### Development Tools
- **ESLint**: Code quality and consistency
- **Nodemon**: Development server with hot reload
- **Git**: Version control with organized commit history

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or cloud instance like MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oasis-pandey/ChoreChamp.git
   cd ChoreChamp
   ```

2. **Set up the Backend:**
   ```bash
   cd Backend
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the Backend directory:
   ```properties
   PORT=5001
   MONGO_URL=mongodb://localhost:27017/chorechamp
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   ```

4. **Set up the Frontend:**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB:**
   - Local: `mongod` or start MongoDB service
   - Cloud: Ensure MongoDB Atlas connection string is in `.env`

2. **Start the Backend (Terminal 1):**
   ```bash
   cd Backend
   npm start
   ```

3. **Start the Frontend (Terminal 2):**
   ```bash
   cd Frontend
   npm start
   ```

4. **Access the Application:**
   - **Frontend**: `http://localhost:3001` (or next available port)
   - **Backend API**: `http://localhost:5001`

### Production Deployment

#### Backend Deployment
1. Set production environment variables
2. Use process manager like PM2
3. Configure reverse proxy (nginx)
4. Enable HTTPS with SSL certificates
5. Set up MongoDB Atlas for cloud database

#### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure API proxy settings
4. Set up custom domain and HTTPS

## 📱 User Guide

### Getting Started
1. **Registration**: Create account with strong password requirements
2. **Login**: Secure authentication with session persistence
3. **Dashboard**: View personal stats and comprehensive chore overview
4. **Group Setup**: Create your first group or join existing ones

### Managing Groups
- **Create Groups**: Start new groups with automatic invite code generation
- **Join Groups**: Use 6-character invite codes shared by group admins
- **Group Navigation**: Access detailed group pages from dashboard
- **Member Management**: View all group members and their statistics

### Chore Workflow
- **Create Chores**: Add tasks with descriptions and frequency settings
- **Assignment**: Assign to specific members or leave open for anyone
- **Completion**: Mark chores complete with optional completion notes
- **Tracking**: Monitor progress through dashboard and group pages

### Points & Gamification
- **Earn Points**: Complete chores to accumulate points
- **Track Progress**: Monitor completion statistics and streaks
- **Group Competition**: Compare performance with group members
- **Achievement System**: Foundation for future badge and achievement features

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/users/register  - Register new user with password validation
POST /api/users/login     - User authentication with detailed error handling
```

### Group Management Endpoints
```
POST /api/groups/create      - Create new group with auto-generated invite code
POST /api/groups/join        - Join existing group using invite code
GET  /api/groups/my-groups   - Get all groups for authenticated user
GET  /api/groups/:groupId    - Get detailed group information
POST /api/groups/:groupId/leave - Leave a specific group
```

### Chore Management Endpoints
```
GET  /api/chores/dashboard        - Get comprehensive dashboard data
POST /api/chores/create          - Create new chore with assignment options
POST /api/chores/:choreId/complete - Mark chore as complete with optional note
GET  /api/chores/group/:groupId  - Get all chores for specific group
DELETE /api/chores/:choreId/remove - Remove completed chore from history
DELETE /api/chores/:choreId/delete - Delete pending chore (creator only)
```

## 📁 Project Structure

```
ChoreChamp/
├── Backend/                    # Node.js API server
│   ├── middleware/            # Authentication and request middleware
│   │   └── authMiddleware.js  # JWT token verification
│   ├── models/               # MongoDB Mongoose schemas
│   │   ├── User.js           # User model with password validation
│   │   ├── Group.js          # Group model with invite codes
│   │   ├── Chore.js          # Chore model with assignments
│   │   └── choreLog.js       # Chore completion history
│   ├── routes/               # API route handlers
│   │   ├── userRoutes.js     # Authentication and user management
│   │   ├── groupRoutes.js    # Group operations and management
│   │   └── choreRoutes.js    # Chore CRUD and completion
│   ├── utils/                # Helper functions and utilities
│   │   ├── generateToken.js  # JWT token generation
│   │   ├── generateCode.js   # Invite code generation
│   │   └── passwordValidator.js # Password strength validation
│   ├── server.js             # Main Express server configuration
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables (not in repo)
├── Frontend/                 # React application
│   ├── src/
│   │   ├── api/             # API client configuration
│   │   │   ├── index.js     # Axios setup with interceptors
│   │   │   └── api.js       # API function definitions
│   │   ├── components/      # Reusable React components
│   │   │   ├── Header.js    # Navigation header with user info
│   │   │   ├── ProtectedRoute.js # Route protection wrapper
│   │   │   └── PasswordStrengthIndicator.js # Password validation UI
│   │   ├── context/         # Global state management
│   │   │   └── AuthContext.js # Authentication context provider
│   │   ├── pages/           # Page components
│   │   │   ├── Login.js     # User login with security notice
│   │   │   ├── Register.js  # Registration with password strength
│   │   │   ├── Dashboard.js # Main dashboard with multi-section layout
│   │   │   ├── CreateGroup.js # Group creation form
│   │   │   ├── JoinGroup.js # Group joining interface
│   │   │   ├── CreateChore.js # Chore creation form
│   │   │   └── GroupDetail.js # Detailed group management page
│   │   └── App.js           # Main app with routing setup
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # TailwindCSS configuration
├── .gitignore               # Git ignore rules
└── README.md                # This comprehensive documentation
```

## 🔒 Security Features

- **Password Requirements**: Enforced strong passwords with real-time validation
- **JWT Authentication**: Secure token-based authentication system
- **Protected Routes**: Server-side and client-side route protection
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Error Handling**: Secure error messages without information leakage
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🧪 Testing & Quality Assurance

- **Manual Testing**: Comprehensive user flow testing
- **Error Handling**: Robust error handling throughout the application
- **Input Validation**: Both client-side and server-side validation
- **Security Testing**: Password requirements and authentication flow testing

## 📈 Performance Considerations

- **Optimized API Calls**: Efficient database queries with proper indexing
- **React Optimization**: Component-level state management and efficient re-renders
- **Asset Optimization**: Optimized images and minimal bundle size
- **Database Design**: Normalized schema design for scalability

## 🎯 Roadmap

### Phase 1: Calendar Integration (In Progress)
- Google Calendar-like interface for chore scheduling
- Drag and drop chore rescheduling
- Due date tracking and overdue notifications
- Recurring chore patterns with custom schedules

### Phase 2: Enhanced User Experience
- Toast notifications system
- Loading skeleton components
- Mobile responsiveness improvements
- Dark mode theme support

### Phase 3: Advanced Features
- Real-time notifications and updates
- Email/SMS reminder system
- Photo verification for completed chores
- Advanced analytics and insights dashboard

### Phase 4: Mobile & Integration
- Progressive Web App (PWA) capabilities
- Native mobile app development
- Third-party calendar sync (Google, Outlook)
- Smart home integration possibilities

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add appropriate comments and documentation
- Test your changes thoroughly
- Update README if adding new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer & Designer**: [Oasis Pandey](https://github.com/oasis-pandey)

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/oasis-pandey/ChoreChamp/issues)
- **Email**: [Contact for support](mailto:oasis.pandey@example.com)
- **Documentation**: This README provides comprehensive setup and usage instructions

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for better household task management
- Designed with user experience and collaboration in mind

---

**ChoreChamp** - Making household management fun, organized, and collaborative! 🏠✨

*Transform your household chores from a burden into a gamified, collaborative experience that brings people together.*
- **JWT**: Authentication and authorization
- **bcrypt**: Password encryption
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment configuration

### Frontend
- **React**: Component-based UI framework
- **React Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client with interceptors
- **Context API**: Global state management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oasis-pandey/ChoreChamp.git
   cd ChoreChamp
   ```

2. **Set up the Backend:**
   ```bash
   cd Backend
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the Backend directory:
   ```properties
   PORT=3000
   MONGO_URL=mongodb://localhost:27017/chorechamp
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Set up the Frontend:**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running the Application

1. **Start the Backend (Terminal 1):**
   ```bash
   cd Backend
   npm start
   ```

2. **Start the Frontend (Terminal 2):**
   ```bash
   cd Frontend
   npm start
   ```

3. **Access the Application:**
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:3000`

## 📱 How to Use

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Create a group** or **join an existing group** using an invite code
3. **Create chores** for your group with appropriate frequency settings
4. **Complete chores** to earn points and keep your group organized

### Managing Chores
- **View Dashboard**: See all your assigned chores and group activity
- **Create Chores**: Add new tasks that automatically go to your group
- **Complete Tasks**: Mark chores as done to earn points
- **Track Progress**: Monitor completion history and point accumulation

### Group Collaboration
- **Share Invite Codes**: Add new members to your groups
- **Assign Tasks**: Create chores that can be assigned to specific members
- **Monitor Activity**: See who completed what and when

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Groups
- `POST /api/groups/create` - Create new group
- `POST /api/groups/join` - Join group with invite code

### Chores
- `GET /api/chores/dashboard` - Get user dashboard data
- `POST /api/chores/create` - Create new chore
- `POST /api/chores/:choreId/complete` - Mark chore as complete
- `GET /api/chores/group/:groupId` - Get all chores for a group

## 📁 Project Structure

```
ChoreChamp/
├── Backend/                 # Node.js API server
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route handlers
│   ├── utils/             # Helper functions
│   ├── server.js          # Main server file
│   └── .env              # Environment variables
├── Frontend/              # React application
│   ├── src/
│   │   ├── api/          # API client configuration
│   │   ├── components/   # Reusable React components
│   │   ├── context/      # Global state management
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main app component
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
└── README.md             # This file
```

## 🎯 Future Improvements

We're continuously working to enhance ChoreChamp. Planned improvements include:

### Enhanced User Experience
- **Advanced Group Management**: Role-based permissions (admin, member)
- **Smart Assignment**: Automatic chore rotation and fair distribution
- **Chore Templates**: Pre-defined chore sets for different household types
- **Recurring Schedules**: More sophisticated scheduling options

### Gamification & Motivation
- **Achievement System**: Badges and milestones for various accomplishments
- **Leaderboards**: Group and global competition features
- **Streak Tracking**: Consecutive completion rewards
- **Custom Point Values**: Different points for different chore types

### Advanced Features
- **Notifications**: Email/SMS reminders for overdue chores
- **Calendar Integration**: Sync with Google Calendar or other services
- **Photo Verification**: Before/after photos for completed chores
- **Chore Dependencies**: Link related tasks together

### Mobile & Accessibility
- **Mobile App**: Native iOS and Android applications
- **Offline Support**: Work without internet connection
- **Dark Mode**: Theme customization options
- **Accessibility**: Screen reader support and keyboard navigation

### Analytics & Insights
- **Performance Analytics**: Track completion rates and trends
- **Group Insights**: Identify most/least active members
- **Reporting**: Generate PDF reports for chore completion
- **Data Export**: Export data for external analysis

## 🤝 Contributing

We welcome contributions! Future development areas include:
- Bug fixes and performance improvements
- New feature implementations
- UI/UX enhancements
- Documentation improvements
- Testing coverage expansion

## 📝 License

This project is currently under development. License details will be added upon completion.

## 👥 Team

- **Lead Developer**: [Oasis Pandey](https://github.com/oasis-pandey)

## 📞 Support

For questions, bug reports, or feature requests, please open an issue on the GitHub repository.

---

**ChoreChamp** - Making household management fun and collaborative! 🏠✨