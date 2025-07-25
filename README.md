# 🏆 ChoreChamp

A full-stack web application for managing household chores and tasks within groups. ChoreChamp makes it easy to organize, assign, and track chores among family members, roommates, or any group of people.

## 🌟 Current Features

### 🔐 Authentication & User Management
- **User Registration**: Create accounts with username, email, and password
- **Secure Login**: JWT-based authentication with automatic token refresh
- **Password Encryption**: bcrypt for secure password hashing
- **Protected Routes**: Automatic redirect for unauthorized access
- **Persistent Sessions**: Login state preserved across browser sessions

### 👥 Group Management
- **Create Groups**: Start new groups with auto-generated invite codes
- **Join Groups**: Join existing groups using 6-character invite codes
- **Group Administration**: Users can belong to multiple groups
- **Invite System**: Share codes to easily add new members

### 📝 Chore Management
- **Create Chores**: Add tasks with name, description, and frequency
- **Frequency Options**: Daily, weekly, or monthly schedules
- **Auto-Assignment**: Chores automatically assigned to user's first group
- **Smart Completion**: Users can complete assigned chores or take unassigned ones
- **Status Tracking**: Pending and completed status management

### 📊 Dashboard & Visualization
- **Personal Stats**: Points, completed chores, and pending tasks
- **Your Assigned Chores**: Tasks specifically assigned to you
- **All Group Chores**: Complete view of all group tasks with assignment info
- **Recently Completed**: History of completed chores with user attribution
- **Real-time Updates**: Dashboard refreshes after chore completion

### 🎮 Gamification
- **Point System**: Earn 10 points for each completed chore
- **Progress Tracking**: Visual statistics on dashboard
- **Achievement Recognition**: Points accumulate over time

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly interface using TailwindCSS
- **Clean Layout**: Card-based design for easy readability
- **Visual Feedback**: Success/error notifications for all actions
- **Color-coded Sections**: Intuitive organization with consistent theming
- **Emoji Icons**: Visual indicators for different sections and actions

## 🛠 Technology Stack

### Backend
- **Node.js & Express**: RESTful API server
- **MongoDB & Mongoose**: Database and ODM
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