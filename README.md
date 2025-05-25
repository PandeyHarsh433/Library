Library Management System
A modern web application for managing a library's book inventory, built with React, TypeScript, Vite, and Supabase. This project allows users to add, edit, view, and delete book records, with user authentication powered by Supabase's Google OAuth integration. The application features a clean, responsive UI styled with Tailwind CSS and supports a seamless development experience with Vite's fast build system.
Table of Contents

Features
Tech Stack
Screenshots
Getting Started
Prerequisites
Installation
Supabase Setup


Usage
Project Structure
Future Enhancements
Contributing
License

Features

User Authentication: Sign in with Google OAuth using Supabase Auth.
Book Management:
View a list of books with details (title, author, publication year).
Add new books via a form.
Edit existing book records.
Delete books from the inventory.


Responsive Design: Built with Tailwind CSS for a mobile-friendly UI.
Fast Development: Powered by Vite for rapid development and hot module replacement.
Type-Safe Code: Written in TypeScript for improved reliability and developer experience.

Tech Stack

Frontend: React, TypeScript, Vite
Backend: Supabase (Database, Authentication)
Styling: Tailwind CSS
Routing: React Router
Build Tool: Vite
Linting & Formatting: ESLint, Prettier

Screenshots
Below are screenshots of the Library Management System in action:
Screenshot 1: Home Page
![Home Page](https://raw.githubusercontent.com/PandeyHarsh433/Library/refs/heads/main/public/admin.png)
Screenshot 2: Book Details
![Book Details Page](https://raw.githubusercontent.com/PandeyHarsh433/Library/refs/heads/main/public/book.png)
Screenshot 2: Admin Panel
![Admin Page](https://raw.githubusercontent.com/PandeyHarsh433/Library/refs/heads/main/public/admin.png)
Getting Started
Prerequisites
Ensure you have the following installed:

Node.js (v16 or higher)
npm (v7 or higher) or yarn
A Supabase account for database and authentication services
Git for cloning the repository

Installation

Clone the repository:
git clone https://github.com/PandeyHarsh433/Library.git
cd Library


Install dependencies:
npm install


Set up environment variables:

Copy the .env.example file to .env:cp .env.example .env


Update .env with your Supabase credentials:VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


You can find these values in your Supabase project dashboard under Settings > API.


Run the development server:
npm run dev

The app will be available at http://localhost:3000.


Supabase Setup

Create a Supabase Project:

Sign up at Supabase and create a new project.
Note the project URL and anon key for the .env file.


Set up the books table:

In the Supabase dashboard, go to Table Editor and create a table named books with the following schema:id: uuid (Primary Key, auto-generated)
title: text (not null)
author: text (not null)
publication_year: integer (not null)


Enable Row-Level Security (RLS) if you want to restrict access to authenticated users.


Enable Google OAuth:

In the Supabase dashboard, go to Authentication > Providers.
Enable Google OAuth and provide your Google Client ID and Secret (obtained from the Google Cloud Console).
Update the redirect URI in Google Cloud to match your app (e.g., http://localhost:3000 for development).



Usage

Sign In: Click the "Sign In" button in the header to authenticate via Google OAuth.
View Books: The homepage (/) displays a list of all books in the library.
Add a Book: Navigate to /add to access the form for adding a new book.
Edit a Book: Click the "Edit" button next to a book to modify its details.
Delete a Book: Click the "Delete" button to remove a book from the inventory.
Sign Out: Click "Sign Out" in the header to log out.

Project Structure
Library/
├── src/
│   ├── components/
│   │   ├── BookForm.tsx      # Form for adding/editing books
│   │   ├── BookList.tsx      # Displays the list of books
│   │   ├── Header.tsx        # Navigation bar with auth controls
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client configuration
│   ├── assets/
│   │   ├── react.svg         # Static assets
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Entry point for React rendering
│   ├── index.css             # Tailwind CSS and global styles
├── public/
├── .env.example              # Template for environment variables
├── index.html                # Main HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation

Future Enhancements

Add search and filter functionality for the book list.
Implement real-time updates using Supabase’s real-time subscriptions.
Add support for uploading book cover images to Supabase Storage.
Enhance authentication with email/password login and role-based access (e.g., admin vs. user).
Add unit and end-to-end tests using Jest and Cypress.
Deploy the app to a hosting platform like Vercel or Netlify.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a pull request with a detailed description of your changes.

Please ensure your code follows the project's ESLint and Prettier configurations.
License
This project is licensed under the MIT License. See the LICENSE file for details.
