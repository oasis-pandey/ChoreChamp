# 🎨 ChoreChamp Frontend

The React frontend for ChoreChamp - a collaborative chore management application.

## ✨ Features Implemented

### 🔐 Authentication System
- **Login/Register Pages**: Clean, responsive forms with validation
- **JWT Token Management**: Automatic token handling with localStorage
- **Protected Routes**: Redirects unauthenticated users to login
- **Session Persistence**: Users stay logged in across browser sessions
- **Auto-logout**: Handles token expiry gracefully

### 👥 Group Management Interface
- **Create Groups**: Simple form to start new groups with auto-generated invite codes
- **Join Groups**: Easy-to-use interface for joining existing groups
- **Invite Code Display**: Clear presentation of shareable group codes
- **Success Feedback**: Visual confirmation of group operations

### 📋 Chore Management Dashboard
- **Multi-Section Layout**: 
  - Your assigned chores
  - All group chores with assignment info
  - Recently completed chores
- **Smart Chore Cards**: Show assignment status, group membership, and actions
- **Interactive Buttons**: Context-aware completion buttons
- **Real-time Updates**: Dashboard refreshes after actions

### 🎮 User Experience Features
- **Point Display**: Visual point tracking on dashboard
- **Progress Statistics**: Completed vs pending chore counts
- **Quick Actions**: Easy access to create groups/chores
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Loading States**: Smooth user feedback during API calls
- **Error Handling**: Clear error messages with recovery options

## 🛠 Technical Implementation

### Core Technologies
- **React 19.1.0**: Latest React with modern hooks and features
- **React Router 7.7.1**: Client-side routing with protected routes
- **TailwindCSS 3.4.0**: Utility-first CSS framework for styling
- **Axios 1.11.0**: HTTP client with request/response interceptors

### Architecture Patterns
- **Context API**: Global authentication state management
- **Component Composition**: Reusable UI components
- **API Layer**: Centralized API calls with error handling
- **Route Protection**: Higher-order component for auth checks

### State Management
- **AuthContext**: Global user authentication state
- **Local State**: Component-specific state with hooks
- **API State**: Loading, error, and success states for all operations

## 📱 User Interface Design

### Design Principles
- **Clean & Minimal**: Clutter-free interface focusing on core functions
- **Consistent Theming**: Blue, green, and purple color scheme throughout
- **Visual Hierarchy**: Clear information architecture with proper spacing
- **Accessibility**: Semantic HTML and keyboard navigation support

### Responsive Layout
- **Mobile-First**: Optimized for mobile devices
- **Grid System**: Responsive grid layouts using TailwindCSS
- **Card Design**: Consistent card-based layouts for chores and groups
- **Flexible Navigation**: Header that works across all screen sizes

### Visual Feedback
- **Success Notifications**: Green alerts for successful operations
- **Error Messages**: Red alerts with clear error descriptions
- **Loading Indicators**: Spinner states during API calls
- **Interactive Elements**: Hover effects and transitions

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Running ChoreChamp Backend on port 3000

### Installation Steps

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Access application:**
   - Opens automatically at `http://localhost:3001`
   - Backend API should be running on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Creates optimized production build in the `build/` directory.

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── index.js           # Axios configuration with interceptors
│   └── api.js             # API function definitions
├── components/            # Reusable UI components
│   ├── Header.js          # Navigation header with user info
│   └── ProtectedRoute.js  # Route protection wrapper
├── context/              # Global state management
│   └── AuthContext.js    # Authentication context provider
├── pages/                # Page components
│   ├── Login.js          # User login page
│   ├── Register.js       # User registration page
│   ├── Dashboard.js      # Main dashboard with chore management
│   ├── CreateGroup.js    # Group creation form
│   ├── JoinGroup.js      # Group joining interface
│   └── CreateChore.js    # Chore creation form
├── App.js                # Main app with routing setup
└── index.js              # React app entry point
```

## 🔗 API Integration

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication

### Group Management Endpoints  
- `POST /api/groups/create` - Create new group
- `POST /api/groups/join` - Join existing group

### Chore Management Endpoints
- `GET /api/chores/dashboard` - Fetch dashboard data
- `POST /api/chores/create` - Create new chore
- `POST /api/chores/:id/complete` - Mark chore complete

### API Features
- **Automatic Token Handling**: Interceptors add JWT tokens to requests
- **Error Handling**: Response interceptors handle auth errors
- **Request/Response Logging**: Debug-friendly API interaction
- **CORS Support**: Proper cross-origin communication

## 🎯 Component Features

### Dashboard Component
- **Multi-section Layout**: Organized view of different chore types
- **Interactive Chore Cards**: Context-aware actions and information
- **Real-time Statistics**: Live updates of user progress
- **Quick Action Buttons**: Easy access to common functions

### Authentication Components
- **Form Validation**: Client-side validation with error display
- **Success/Error States**: Clear feedback for all operations
- **Responsive Forms**: Mobile-optimized input layouts
- **Secure Token Handling**: Proper JWT storage and management

### Group Management Components
- **Invite Code Display**: Clear presentation of shareable codes
- **Join Interface**: User-friendly group joining experience
- **Success Confirmations**: Visual feedback for group operations

## � Development Features

### Code Quality
- **ES6+ Syntax**: Modern JavaScript features
- **Component Hooks**: Functional components with hooks
- **Error Boundaries**: Graceful error handling
- **PropTypes**: Type checking for component props

### Developer Experience
- **Hot Reload**: Instant updates during development
- **Source Maps**: Debug-friendly error traces
- **Linting**: Code quality enforcement
- **Component Structure**: Clear separation of concerns

## 🚀 Future Frontend Enhancements

### Planned UI Improvements
- **Dark Mode**: Theme switching capability
- **Advanced Animations**: Smooth transitions and micro-interactions
- **Drag & Drop**: Intuitive chore management interfaces
- **Progressive Web App**: Offline functionality and app-like experience

### Enhanced User Experience
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Filtering**: Filter chores by status, assignee, frequency
- **Search Functionality**: Quick chore and group search
- **Bulk Operations**: Multi-select and batch actions

### Mobile Enhancements
- **Touch Gestures**: Swipe actions for mobile users
- **Native App Features**: Push notifications and camera integration
- **Offline Mode**: Work without internet connectivity
- **Performance Optimization**: Lazy loading and code splitting

### Accessibility Improvements
- **Screen Reader Support**: Full ARIA implementation
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast Mode**: Better visibility options
- **Font Scaling**: Adjustable text sizes

## 🤝 Contributing to Frontend

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TailwindCSS for all styling (no custom CSS)
- Implement proper error handling for all API calls
- Ensure responsive design for all new components
- Add loading states for all async operations

### Code Standards
- Use functional components with hooks
- Implement proper PropTypes for type safety
- Follow consistent naming conventions
- Add comments for complex logic
- Test components with different data states

---

**Frontend Version**: 1.0.0 | **React Version**: 19.1.0 | **Last Updated**: January 2025
