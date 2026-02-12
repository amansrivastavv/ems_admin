# EMS Admin Dashboard

A production-ready Employee Management System frontend built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI.

## Features

- **Authentication**: JWT-based auth with secure localStorage token management.
- **Role-Based Access Control**: Admin, HR, and Employee roles with protected routes and UI elements.
- **Modern UI**: Clean SaaS design using Shadcn UI components and Tailwind CSS.
- **Data Tables**: Powerful tables using TanStack Table with sorting, filtering, and pagination.
- **Forms**: Type-safe forms using React Hook Form and Zod validation.
- **Responsive**: Fully responsive sidebar and layout.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State/Auth**: React Context, Axios Interceptors
- **Icons**: Lucide React
- **Validation**: Zod
- **Tables**: TanStack Table v8

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

- `/app`: App Router pages and layouts.
  - `(auth)`: Public authentication pages (Login, Signup).
  - `(dashboard)`: Protected dashboard pages with Sidebar/Navbar layout.
- `/components`: Reusable UI components.
  - `/ui`: Shadcn primitives (Button, Input, etc.).
  - `/layout`: Sidebar, Navbar.
  - `/tables`: Data table components.
  - `/forms`: Form components.
- `/lib`: Utilities and configuration.
  - `api.ts`: Axios instance with interceptors.
  - `auth.ts`: Auth helpers.
  - `utils.ts`: Tailwind class merger.
- `/hooks`: Custom hooks (useAuth).
- `/types`: TypeScript interfaces.

## Mock Data

This frontend currently uses mock data for demonstration.

- **Login**: Use standard email format (e.g., `admin@example.com`). Password > 6 chars.
- **API integration**: Update `lib/api.ts` with your actual backend URL.
