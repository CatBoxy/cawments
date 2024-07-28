# Cawments

## Overview

Cawments is a simple post site where users can log in, create posts with text or images, and comment on other users' posts. The application is built using Next.js with TypeScript for the frontend and Supabase for the backend and authentication.

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

## Development Process

The following process was followed while developing the application:

- **Project Setup**
  - Initialize a Next.js project with TypeScript.
  - Set up TailwindCSS and shadcd/ui for styling.
  - Configure Supabase for the backend.
  - Initialize a Git repository and set up continuous deployment with Vercel.
- **User Authentication**
  - Implement GitHub OAuth with Supabase for user authentication.
  - Create sign-up and sign-out functionality.
- **Post Creation**
  - Create a form for authenticated users to post text or images.
  - Handle image uploads using Supabase Storage.
  - Save posts to the database.
- **Post Viewing**
  - Display posts to all users, authenticated or not.
- **Commenting**
  - Create a form for authenticated users to comment on posts with text or images.
  - Save comments to the database.
- **Comment Viewing**
  - Display comments for each post to all users.
- **Responsive Design**
  - Ensure the site is responsive and works on different screen sizes.
- **Testing**
  - Write tests for various parts of the application.
- **Documentation**
  - Write a README.md file with all necessary instructions and explanations.

## Running the Application Locally

1. Clone the repository:

```
git clone git@github.com:CatBoxy/cawments.git
```

```
cd cawments
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
