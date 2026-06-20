# StartupForge Client

StartupForge is a premium team-builder and co-founder matching platform connecting startup founders with talented collaborators. This directory contains the React frontend application built with Vite, Tailwind CSS, Framer Motion, and Lucide React.

## 🚀 Features

- **Dynamic Homepage**: Modern design with animations, featured startups, featured opportunities, and statistics.
- **Glassmorphic Navigation**: Responsive navigation menu adapting dynamically based on user role and auth status.
- **Authentication**: Custom authentication integration leveraging Better Auth, supporting roles (Founder, Collaborator, Admin) and password validation rules.
- **Image Upload Integration**: Register and update profiles by uploading avatars directly to ImgBB.
- **Browse Catalogs**: Browse approved startups and opportunities with industry filters, search by role title/skills, and server-side pagination.
- **Role-Based Dashboards**:
  - **Founder**: Manage startup profile, post opportunities (limited to 3 for free tier, unlocked with Stripe), accept/reject applicants.
  - **Collaborator**: Submit applications, track application status, edit professional profile.
  - **Admin**: System-wide overview, block/unblock users, approve/reject startups, track revenue transactions.
- **Stripe Premium Integration**: Seamless checkout redirect for founders to purchase unlimited postings.

## 🛠️ Technology Stack

- **Framework**: React (Vite template)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios (configured with HTTPOnly credentials integration)
- **State Management**: React Context API
- **Payments**: Stripe Client SDK

## 📦 Setup & Installation

1. Navigate to the client directory:
   ```bash
   cd startupforge-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in this directory and populate the variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_IMGBB_API_KEY=your_imgbb_key_here
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Folder Structure

- `src/components/`: Shared UI layout elements (Navbar, Footer, etc.).
- `src/context/`: Global state providers (AuthContext).
- `src/pages/`: Public pages (Home, Browse, Details, Login, Register, Loading, Error404).
- `src/pages/dashboard/`: Restricted role-specific view containers and forms.
