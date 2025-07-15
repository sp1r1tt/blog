# Blog Application

![Скриншот]([./screenshot.png](https://github.com/sp1r1tt/blog/blob/d2f535f13c70dbf34e922fd62c6cfebed2329312/screenshot.png))

A simple and modern blog platform built with **Next.js** and **Firebase Firestore**, allowing users to create, view, comment on, and delete posts. The application features a responsive design, theme switching (light/dark mode), client-side filtering for posts and comments, and server-side rendering (SSR) for improved SEO and fast initial page loads.

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

The application leverages **Next.js** for server-side rendering (SSR) and client-side interactivity, **Firestore** for persistent data storage, and **Redux Toolkit** for state management. It uses **Tailwind CSS** for styling and includes animations for a polished UI. SSR ensures fast initial page loads and SEO optimization, while client-side RTK Query handles dynamic updates for real-time interactivity.

## Features
- **Post Management**:
  - Create posts with validation using Zod schema.
  - View a list of posts with a filter by title.
  - Delete posts with confirmation.
- **Comment Management**:
  - Add comments to posts with validation.
  - View and filter comments by text or author.
  - Delete comments with instant UI updates.
- **Theme Switching**:
  - Toggle between light and dark themes using `next-themes`.
- **Responsive Design**:
  - Mobile-friendly layout with Tailwind CSS.
- **Animations**:
  - Smooth transitions for post cards using `framer-motion` and `tw-animate-css`.
- **Server-Side Rendering (SSR)**:
  - Pages (`/`, `/posts`, `/posts/[id]`) are rendered server-side for SEO and fast initial loads.
  - Initial post and comment data fetched from Firestore during SSR.
  - Client-side RTK Query ensures instant updates for comments and posts without page reloads.
- **Error Handling**:
  - Client-side validation and error messages for forms.
  - Graceful handling of Firestore errors.

## Technologies Used
- **Frontend**:
  - **Next.js** (with App Router and SSR)
  - **React**
  - **SSR**
  - **TypeScript**
  - **Tailwind CSS**
  - **Framer Motion**
  - **next-themes**
  - **React Hook Form**
  - **Zod**
  - **Lucide React**
- **State Management**:
  - **Redux Toolkit**
  - **RTK Query** (for data fetching and caching)
- **Backend**:
  - **Firebase Firestore**
- **Utilities**:
  - **class-variance-authority**
  - **clsx**
  - **tailwind-merge**
- **Environment**:
  - **Firebase Configuration**

## Project Structure
```
blog-app/
├── src/
│   ├── app/
│   │   ├── create/
│   │   ├── posts/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── FilterBar.tsx
│   │   ├── PostForm.tsx
│   │   ├── PostList.tsx
│   │   └── ThemeToggle.tsx
│   ├── lib/
│   ├── schemas/
│   ├── services/
│   ├── store/
├── .env
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
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
  - **Server-Side Rendering (SSR)**:
    - Pages `/posts` and `/posts/[id]` fetch post and comment data from Firestore during server-side rendering, ensuring SEO-friendly content and fast initial page loads.
    - Dynamic routes (`/posts/[id]`) handle `params` and `searchParams` with `await` for safe access.
  - Client-side interactivity for filtering and form submissions.
- **React Components**:
  - `PostList.tsx`: Displays a grid of posts with filtering and animations.
  - `PostForm.tsx`: Form for creating posts with validation.
  - `PostDetail.tsx`: Shows post details, comments, and a comment form with instant updates via RTK Query.
  - `FilterBar.tsx`: Input for filtering posts or comments, updating the URL with `next/navigation`.
  - `ThemeToggle.tsx`: Button to switch between light and dark themes.
  - `Button.tsx` and `Card.tsx`: Reusable UI components with variant-based styling.
- **State Management**:
  - **Redux Toolkit**: Manages filter states for posts (`postsSlice`) and comments (`commentsSlice`).
  - **RTK Query**: Handles data fetching, caching, and mutations for posts and comments (`postsApi`). Uses `invalidatesTags` for instant UI updates after creating or deleting comments/posts.
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
  - RTK Query (`postsApi`) integrates Firestore operations with the frontend, providing caching and instant updates after mutations.
- **Environment Variables**:
  - Firebase configuration is stored in `.env` for secure API key management.

### User Flow
1. **Home Page (`/`)**: Displays a welcome message, a filter bar, and a list of posts, rendered server-side.
2. **Posts Page (`/posts`)**: Shows all posts with filtering by title, fetched server-side for SEO.
3. **Post Detail Page (`/posts/[id]`)**: Displays a single post, its comments, and a form to add comments, with initial data from SSR. Comments can be filtered or deleted with instant UI updates.
4. **Create Post Page (`/create`)**: Form to create a new post with validation.
5. **Theme Toggle**: Available in the header to switch themes.

## Setup and Installation
### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Account**: Create a Firestore database and obtain configuration details.

### Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd blog-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**
   - Create `.env.local` in the root directory:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
     ```

4. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Create Firebase Firestore Database**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Select or create a project.
   - Go to **Firestore Database** > **Create database**:
     - Select **Test Mode** (for development).
     - Select a region (e.g., europe-west).
   - Click **Start collection**:
     - Name the collection: `posts`.
     - Create the first document:
       - `title`: "First post"
       - `content`: "This is the content of the post"
       - `author`: "Alex"
       - `createdAt`: current date (can be done manually or via code)
     - Similarly, create the `comments` collection, if needed.
   - **Rules** tab → configure security rules:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /posts/{postId} {
           allow read: if true;
           allow write: if true; // Allow unauthenticated creates, updates, and deletes
         }
         match /comments/{commentId} {
           allow read: if true;
           allow write: if true; // Allow unauthenticated creates and deletes
         }
       }
     }
     ```
     Click **Publish**.

6. **Build for Production**
   ```bash
   npm run build && npm run start
   # or
   yarn build && yarn start
   ```

## Usage
- **Create a Post**:
  - Navigate to `/create`.
  - Fill out the form with a title, content, and author name.
  - Submit to save the post to Firestore.
- **View Posts**:
  - Go to `/posts` to see all posts, rendered server-side for fast loading and SEO.
  - Use the filter input to search posts by title.
- **View Post Details**:
  - Click "Читать далее" on a post to view its details and comments, pre-fetched via SSR.
  - Add comments using the form or filter existing comments.
  - Delete comments with instant UI updates via RTK Query.
- **Delete Posts**:
  - On the post detail page, click "Удалить пост" to delete the post and redirect to `/posts` with an updated list.
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
