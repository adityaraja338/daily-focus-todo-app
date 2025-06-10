# Daily Focus Todo App

A modern task management application built with React and TypeScript.

## Features

- User authentication with secure cookie-based sessions
- Task management with pagination and search
- Real-time data updates with React Query
- Optimistic UI updates for better user experience
- Automatic background refetching
- Error handling and retry logic
- Type-safe API calls
- Debounced search functionality
- Protected routes
- Responsive and modern UI with shadcn-ui

## Technologies Used

- Vite
- TypeScript
- React
- React Router for navigation
- shadcn-ui for UI components
- Tailwind CSS for styling
- React Query (TanStack Query) for data fetching and state management
- Axios for HTTP requests
- js-cookie for secure cookie management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/adityaraja338/daily-focus-todo-app.git

# Navigate to the project directory
cd daily-focus-todo-app

# Install dependencies
npm install

# Create a .env file in the root directory and add:
VITE_API_URL=http://localhost:3000/api

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
  ├── components/     # React components
  │   ├── auth/      # Authentication components
  │   ├── dashboard/ # Dashboard components
  │   └── ui/        # UI components
  ├── contexts/      # React contexts
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions and API calls
  ├── types/         # TypeScript type definitions
  └── App.tsx        # Root component
```

## Features in Detail

### Authentication
- Secure cookie-based authentication
- Protected routes
- Automatic session handling
- Login and registration forms
- Session expiration handling

### Task Management
- Create, read, update, and delete tasks
- Pagination support
- Search functionality with debouncing
- Optimistic updates for better UX
- Error handling and retry logic
- Real-time data synchronization

### UI/UX
- Modern and responsive design
- Loading states and error messages
- Toast notifications for user feedback
- Smooth transitions and animations
- Mobile-friendly interface

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


