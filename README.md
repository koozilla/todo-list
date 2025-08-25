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
- [ ] Setup Next.js project + Tailwind
- [ ] Connect to Supabase project
- [ ] Implement login/signup with Supabase email auth

### Phase 2: Basic Task CRUD
- [ ] Create Supabase tasks table
- [ ] Implement Create, Read, Update, Delete APIs
- [ ] Connect APIs to frontend UI

### Phase 3: Task Views & UX
- [ ] Add Completed/Pending views
- [ ] Add sorting by created_at
- [ ] Improve UI (responsive design)

### Phase 4: Polish & Deployment
- [ ] Add dark mode toggle (optional)
- [ ] Deploy on Vercel (frontend) + Supabase (backend)
- [ ] Write minimal documentation for usage

## 🔮 Future Enhancements

- **Categories/Tags** for tasks
- **Reminders** via email/push notifications
- **Collaboration** (shared lists)
- **Mobile App** (React Native, reusing Supabase backend)

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

*Coming soon - setup instructions will be added as development progresses*

## 📄 License

*License information to be added*

## 🤝 Contributing

*Contribution guidelines to be added*

---

**Built with ❤️ using Next.js, Tailwind CSS, and Supabase**
