Hail Mary - Subscription Manager

A modern subscription management web application that helps users track, manage, and analyze their recurring subscriptions.
Technologies Used
Frontend Framework

    Next.js 16 - React framework with App Router for server-side rendering and routing
    React 19 - UI component library with hooks for state management
    TypeScript - Type-safe JavaScript for better developer experience

Styling

    Tailwind CSS 4 - Utility-first CSS framework for responsive design
    tw-animate-css - Animation utilities for smooth transitions
    class-variance-authority - For creating component variants
    tailwind-merge - Intelligent class merging for Tailwind

UI Components

    shadcn/ui - Accessible, customizable component library built on Radix UI
    Radix UI - Unstyled, accessible UI primitives (Dialog, Dropdown, Select, Switch, etc.)
    Lucide React - Icon library with 1000+ icons
    Recharts - Composable charting library for data visualization
    Vaul - Drawer component for mobile-friendly modals
    Sonner - Toast notification system
    cmdk - Command menu component

Forms & Validation

    React Hook Form - Performant form handling with minimal re-renders
    Zod - TypeScript-first schema validation
    @hookform/resolvers - Zod integration for React Hook Form

Data Fetching

    SWR - React hooks for data fetching with caching and revalidation

Date Handling

    date-fns - Modern JavaScript date utility library
    react-day-picker - Flexible date picker component

Implementation Details
Authentication Flow

User authentication is handled through Supabase Auth with email/password login. Sessions are managed client-side using the Supabase JS client with automatic token refresh.
Database Schema

The subscriptions table stores user subscription data with Row Level Security policies ensuring users can only access their own data. Columns include name, amount, category, billing frequency, and billing date.
State Management

A React Context (SubscriptionProvider) manages global subscription state, providing CRUD operations that sync with the Supabase database. Components consume this context via the useSubscriptions hook.
Responsive Design

The app uses a mobile-first approach with Tailwind's responsive prefixes. A floating dock navigation at the bottom provides easy access to all sections on mobile and desktop.
Data Visualization

The Insights page uses Recharts to display spending trends, category breakdowns, and budget tracking through area charts, pie charts, and bar charts.
Features

    Add, edit, and delete subscriptions
    Track billing frequency (weekly, monthly, quarterly, yearly)
    Categorize subscriptions
    View spending insights and analytics
    Budget tracking
    Notification preferences