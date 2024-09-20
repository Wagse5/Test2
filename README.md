# Sentiment Todo App

## Description

The Sentiment Todo App is a powerful task management tool that incorporates sentiment analysis to help users track their emotional state alongside their tasks. This application allows users to create notes, analyze their sentiment, and visualize their emotional trends over time.

## Features

- User authentication (sign up, login, logout)
- Create, read, update, and delete notes
- Automatic sentiment analysis of notes
- Mark notes as done and archive them
- Visualize sentiment trends over time (hourly, daily, weekly, monthly, yearly)
- Streak tracking for consistent app usage
- Responsive design for both desktop and mobile use

## Technology Stack

- Frontend: Next.js, React
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: NextAuth.js
- Sentiment Analysis: [Your chosen sentiment analysis library]
- Charting: Chart.js
- Styling: CSS-in-JS (styled-components or similar)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sentiment-todo-app.git
   ```

2. Navigate to the project directory:
   ```
   cd sentiment-todo-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Sign up for a new account or log in if you already have one.
2. On the main dashboard, you can add new notes using the "Add Note" button.
3. Your notes will be automatically analyzed for sentiment.
4. Use the tabs to switch between different views:
   - Present Sentiment: Shows your current emotional state based on recent notes.
   - Active Notes: Displays all your active (non-archived) notes.
   - How You've Been: Visualizes your sentiment trends over time.
   - Archived Notes: Shows notes you've marked as done.
5. Mark notes as done to archive them.
6. Use the sentiment chart to track your emotional trends over different time periods.

## API Routes

- `/api/auth/[...nextauth]`: Handles authentication (NextAuth.js)
- `/api/auth/signup`: Handles user registration
- `/api/notes`: CRUD operations for notes
- `/api/streak`: Fetches and updates user streaks

## Components

- `Layout`: Main layout component
- `SentimentChart`: Renders the sentiment visualization chart
- `Tabs`: Manages the tab navigation
- `NoteItem`: Individual note component

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
