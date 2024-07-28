# Crow-sourced Conversations

## Overview

Crow-sourced Conversations is a simple post site where users can log in, create posts with text or images, and comment on other users' posts. The application is built using Next.js with TypeScript for the frontend and Supabase for the backend and authentication.

## Architecture

The application follows a client-server architecture:

- Frontend: Next.js with TypeScript
- Backend: Supabase (PostgreSQL database)
- Authentication: GitHub OAuth via Supabase
- Image Storage: Supabase Storage

Key components:

1. `PostContainer`: Manages the state and rendering of posts
2. `CommentContainer`: Handles comments for individual posts
3. `actions.ts`: Server-side actions for interacting with Supabase
4. `Post` and `PostList` components: Render individual posts and lists of posts

## Approach and Methodology

1. User Authentication: Implemented using Supabase's GitHub OAuth integration
2. Server-Side Rendering: Utilized Next.js's SSR capabilities for initial data fetching
3. Client-Side Updates: Implemented real-time updates for new posts and comments triggered by scrolling
4. Responsive Design: Used Tailwind CSS for a mobile-first, responsive layout
5. Image Handling: Implemented image upload and storage using Supabase Storage

## Running the Application Locally

1. Clone the repository:

```
git clone https://github.com/your-username/crow-sourced-conversations.git
```

```
cd crow-sourced-conversations
```

2. Install dependencies:

```
npm install
```

3. Set up Supabase environment variables:
   Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

To run the tests:

```
npm test
```

## Deployment

The application is deployed on Vercel. You can view the live version at: [https://cawments.vercel.app/](https://cawments.vercel.app/)

## Features

- User authentication with GitHub
- Create posts with text and images
- View all posts
- Comment on posts with text and images
- Responsive design for various screen sizes
- Real-time updates for new posts and comments
