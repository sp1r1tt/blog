# Blog Application

A simple and modern blog platform built with **Next.js** and **Firebase Firestore**, allowing users to create, view, comment on, and delete posts. The application features a responsive design, theme switching (light/dark mode), and client-side filtering for posts and comments.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview
This is a full-stack blog application where users can:
- Create posts with a title, content, and author name.
- View a list of posts with client-side filtering by title.
- View individual posts with their comments and filter comments by text or author.
- Add and delete comments for specific posts.
- Delete posts.
- Toggle between light and dark themes for better user experience.

The application leverages **Next.js** for server-side rendering and client-side interactivity, **Firestore** for persistent data storage, and **Redux Toolkit** for state management. It uses **Tailwind CSS** for styling and includes animations for a polished UI.

## Features
- **Post Management**:
  - Create posts with validation using Zod schema.
  - View a list of posts with a filter by title.
  - Delete posts with confirmation.
- **Comment Management**:
  - Add comments to posts with validation.
  - View and filter comments by text or author.
  - Delete comments.
- **Theme Switching**:
  - Toggle between light and dark themes using `next-themes`.
- **Responsive Design**:
  - Mobile-friendly layout with Tailwind CSS.
- **Animations**:
  - Smooth transitions for post cards using `framer-motion` and `tw-animate-css`.
- **Error Handling**:
  - Client-side validation and error messages for forms.
  - Graceful handling of Firestore errors.

## Technologies Used
- **Frontend**:
  - **Next.js**: React framework for server-side rendering and routing.
  - **React**: For building interactive UI components.
  - **TypeScript**: For type-safe JavaScript development.
  - **Tailwind CSS**: Utility-first CSS framework for styling.
  - **Framer Motion**: For animations on post cards.
  - **next-themes**: For light/dark theme switching.
  - **React Hook Form**: For form handling and validation.
  - **Zod**: For schema validation of forms.
  - **Lucide React**: For icons (e.g., Sun, Moon, Plus).
- **State Management**:
  - **Redux Toolkit**: For managing filter states.
  - **RTK Query**: For data fetching and caching from Firestore.
- **Backend**:
  - **Firebase Firestore**: NoSQL database for storing posts and comments.
- **Utilities**:
  - **class-variance-authority (CVA)**: For variant-based component styling.
  - **clsx** and **tailwind-merge**: For conditional class name handling.
- **Environment**:
  - **Firebase Configuration**: Environment variables for Firestore integration.

## Project Structure
```
blog-app/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── create/               # Page for creating posts
│   │   │   └── page.tsx
│   │   ├── posts/                # Posts listing and detail pages
│   │   │   ├── [id]/             # Dynamic route for post details
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Root layout for the app
│   │   ├── page.tsx              # Home page
│   │   ├── providers.tsx         # Redux provider setup
│   │   └── globals.css           # Global styles with Tailwind
│   ├── components/               # Reusable React components
│   │   ├── ui/                   # UI components (Button, Card)
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── FilterBar.tsx         # Component for filtering posts/comments
│   │   ├── PostForm.tsx          # Form for creating posts
│   │   ├── PostList.tsx          # Component for listing posts
│   │   └── ThemeToggle.tsx       # Theme switcher component
│   ├── lib/                      # Utility functions
│   │   └── utils.ts              # Classname merging utilities
│   ├── schemas/                  # Zod schemas for validation
│   │   └── postSchema.ts
│   ├── services/                 # Firebase/Firestore service functions
│   │   └── firestore.ts
│   ├── store/                    # Redux store setup
│   │   ├── commentsSlice.ts      # Redux slice for comment filters
│   │   ├── postsSlice.ts         # Redux slice for post filters and RTK Query
│   │   └── index.ts              # Store configuration
├── .env                    # Environment variables for Firebase
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## How It Works
### Data Storage
- **Firestore**:
  - **Posts**: Stored in the `posts` collection with fields `id`, `title`, `content`, `author`, and `createdAt`.
  - **Comments**: Stored in the `comments` collection with fields `id`, `text`, `author`, `createdAt`, and `postId` (links to a post).
  - Firestore functions in `services/firestore.ts` handle CRUD operations for posts and comments.

### Frontend
- **Next.js**:
  - Uses the App Router for page navigation (`/`, `/posts`, `/posts/[id]`, `/create`).
  - Server-side rendering for SEO and fast initial loads.
- **React Components**:
  - `PostList.tsx`: Displays a grid of posts with filtering and animations.
  - `PostForm.tsx`: Form for creating posts with validation.
  - `PostDetail.tsx`: Shows post details, comments, and a comment form.
  - `FilterBar.tsx`: Input for filtering posts or comments.
  - `ThemeToggle.tsx`: Button to switch between light and dark themes.
  - `Button.tsx` and `Card.tsx`: Reusable UI components with variant-based styling.
- **State Management**:
  - **Redux Toolkit**: Manages filter states for posts (`postsSlice`) and comments (`commentsSlice`).
  - **RTK Query**: Handles data fetching, caching, and mutations for posts and comments (`postsApi`).
- **Form Handling**:
  - `react-hook-form` and `zod` are used for form validation in `PostForm.tsx` and `PostDetail.tsx`.
  - Schemas in `postSchema.ts` ensure valid input for posts and comments.
- **Styling**:
  - Tailwind CSS for responsive and utility-first styling.
  - Custom theme variables in `globals.css` for light/dark modes.
  - Animations with `framer-motion` for post cards and `tw-animate-css` for fade-in effects.

### Backend Integration
- **Firestore**:
  - CRUD operations are abstracted in `firestore.ts`.
  - RTK Query (`postsApi`) integrates Firestore operations with the frontend, providing caching and optimistic updates.
- **Environment Variables**:
  - Firebase configuration is stored in `.env.local` for secure API key management.

### User Flow
1. **Home Page (`/`)**: Displays a welcome message, a filter bar, and a list of posts.
2. **Posts Page (`/posts`)**: Shows all posts with filtering by title.
3. **Post Detail Page (`/posts/[id]`)**: Displays a single post, its comments, and a form to add comments. Comments can be filtered or deleted.
4. **Create Post Page (`/create`)**: Form to create a new post with validation.
5. **Theme Toggle**: Available in the header to switch themes.

## Setup and Installation
### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Account**: Create a Firestore database and obtain configuration details.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd blog-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add your Firebase configuration (replace with your own values):
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
     ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   # or
   yarn build
   yarn start
   ```

## Usage
- **Create a Post**:
  - Navigate to `/create`.
  - Fill out the form with a title, content, and author name.
  - Submit to save the post to Firestore.
- **View Posts**:
  - Go to `/posts` to see all posts.
  - Use the filter input to search posts by title.
- **View Post Details**:
  - Click "Читать далее" on a post to view its details and comments.
  - Add comments using the form or filter existing comments.
- **Delete Posts/Comments**:
  - On the post detail page, click "Удалить пост" or "Удалить" next to a comment.
- **Switch Themes**:
  - Use the theme toggle button in the header to switch between light and dark modes.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the existing style and includes tests if applicable.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.