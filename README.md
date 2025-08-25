# Todo List App

A lightweight, secure Todo List application built with Next.js, Tailwind CSS, and Supabase. Users can authenticate via magic link email authentication and manage their personal tasks with full CRUD operations.

## 🚀 Features

### Authentication
- **Secure Login/Signup** with Supabase Auth
- **Magic Link Authentication** - no passwords needed
- **JWT-based Sessions** for persistent login
- **Row-Level Security** ensuring users only access their own data

### Task Management
- **Create Tasks** with title, optional description, and due date
- **Edit Tasks** - modify any field of existing tasks
- **Complete Tasks** - mark tasks as done with boolean toggle
- **Delete Tasks** - remove tasks from your list
- **Task Organization** - view All, Pending, or Completed tasks
- **Smart Sorting** - default sorting by creation date

### User Experience
- **Responsive Design** - works seamlessly on desktop and mobile
- **Clean, Minimalist UI** built with Tailwind CSS
- **Dark Mode Toggle** (planned enhancement)
- **Fast Performance** - page loads under 2 seconds

## 🛠️ Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL + Auth + API)
- **Authentication**: Supabase Auth with magic links
- **Hosting**: Vercel (frontend), Supabase Cloud (backend)
- **Styling**: Tailwind CSS for responsive design

## 🗄️ Database Schema

### Tasks Table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | primary key, default uuid_generate_v4() |
| `user_id` | uuid | foreign key → auth.users.id |
| `title` | text | not null |
| `description` | text | nullable |
| `due_date` | date | nullable |
| `is_completed` | boolean | default false |
| `created_at` | timestamp | default now() |
| `updated_at` | timestamp | default now() |

**Row Level Security (RLS)**: Users can only access tasks where `user_id = auth.uid()`

## 📱 User Stories

- As a user, I can log in with my email so I can access my todos anywhere
- As a user, I can create tasks with a title and optional details
- As a user, I can mark tasks completed to track progress
- As a user, I can edit tasks to adjust them
- As a user, I can delete tasks to keep my list clean

## 🚧 Development Phases

### Phase 1: Setup & Authentication ✅
- [x] Setup Next.js project + Tailwind
- [x] Connect to Supabase project
- [x] Implement login/signup with Supabase email auth

### Phase 2: Basic Task CRUD ✅
- [x] Create Supabase tasks table schema
- [x] Set up TypeScript types and interfaces
- [x] Create Supabase client configuration
- [x] Implement Create, Read, Update, Delete APIs
- [x] Connect APIs to frontend UI

### Phase 3: Task Views & UX ✅
- [x] Add Completed/Pending views
- [x] Add sorting by created_at
- [x] Improve UI (responsive design)
- [x] Add search functionality
- [x] Add advanced sorting options

### Phase 4: Polish & Deployment 🔄
- [x] Add dark mode toggle with theme context
- [x] Improve UI styling and dark mode support
- [ ] Deploy on Vercel (frontend) + Supabase (backend)
- [x] Write comprehensive documentation for usage

## 🔮 Future Enhancements

- **Categories/Tags** for tasks
- **Reminders** via email/push notifications
- **Collaboration** (shared lists)
- **Mobile App** (React Native, reusing Supabase backend)

## 🏗️ What's Built So Far

### ✅ Completed Features
- **Next.js 15.5.0** project with TypeScript and Tailwind CSS
- **Supabase Integration** with proper client configuration
- **Magic Link Authentication** - no passwords needed
- **Protected Routes** with authentication checks
- **Database Schema** ready for tasks table
- **TypeScript Types** for tasks, users, and API inputs
- **Responsive UI** with modern design patterns

### ✅ Completed Features
- **Next.js 15.5.0** project with TypeScript and Tailwind CSS
- **Supabase Integration** with proper client configuration
- **Magic Link Authentication** - no passwords needed
- **Protected Routes** with authentication checks
- **Database Schema** ready for tasks table
- **TypeScript Types** for tasks, users, and API inputs
- **Responsive UI** with modern design patterns
- **Full Task CRUD System** - create, read, update, delete
- **Task Filtering** - All, Pending, Completed views
- **Real-time Updates** - automatic refresh on changes
- **Overdue Detection** - smart date comparison logic
- **Inline Editing** - edit tasks without page refresh
- **Error Handling** - user-friendly error messages
- **Loading States** - smooth user experience
- **Advanced Search** - debounced search by title/description
- **Smart Sorting** - multiple sort options with visual indicators
- **Dark Mode Support** - complete theme switching system
- **Enhanced Styling** - beautiful UI in both light and dark themes

### 🔄 In Progress
- **Phase 4 Deployment** - deploy to Vercel and production setup

### 📱 Current Pages
- `/` - Landing page (Next.js default)
- `/test` - Supabase connection test
- `/auth/login` - Magic link authentication
- `/dashboard` - Complete task management dashboard

### 🗄️ Database Ready
- Tasks table schema with proper constraints
- Row Level Security (RLS) policies
- Automatic timestamp updates
- Performance indexes

## 📋 Requirements

### Functional Requirements
- Secure authentication with Supabase
- Full CRUD operations for tasks
- Task persistence in Supabase Postgres DB
- Clean, responsive UI

### Non-Functional Requirements
- **Performance**: Page load < 2s
- **Security**: Supabase-managed auth, row-level security
- **Scalability**: Support up to 10k users in MVP
- **Cross-platform**: Responsive web app (desktop + mobile)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (we're using v22.18.0 LTS)
- npm or yarn package manager
- Supabase account and project

### Local Development Setup
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the contents of `database-setup.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Test the application**
   - Visit `http://localhost:3000/test` to verify Supabase connection
   - Visit `http://localhost:3000/auth/login` to test authentication
   - Use magic link authentication to sign in

### Project Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page with magic link
│   │   └── callback/route.ts       # Auth callback handler
│   ├── dashboard/page.tsx          # Main dashboard (protected)
│   ├── test/page.tsx               # Supabase connection test
│   └── layout.tsx                  # Root layout
├── lib/
│   └── supabase.ts                 # Supabase client configuration
└── types/
    └── index.ts                     # TypeScript type definitions
```

## 📄 License

*License information to be added*

## 🤝 Contributing

*Contribution guidelines to be added*

---

**Built with ❤️ using Next.js, Tailwind CSS, and Supabase**
