# StartupForge Client

A React-based frontend for the StartupForge platform — connecting startup founders with talented collaborators.

## Features

- **Role-based dashboards**: Founder, Collaborator, Admin
- **Authentication**: Email/password + Google OAuth via Better Auth
- **Startup management**: Create, update, delete startup profiles
- **Opportunity management**: Post, edit, delete team openings
- **Application system**: Apply to opportunities, accept/reject candidates
- **Premium payments**: Stripe Checkout integration
- **Image upload**: ImgBB integration for avatars and logos
- **Pagination + search/filter**: Server-side pagination with regex search
- **Responsive design**: Mobile, tablet, desktop friendly

## Tech Stack

- React 19 + Vite
- React Router v6
- Tailwind CSS v3
- Framer Motion
- Axios
- Better Auth (client SDK)

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_IMGBB_API_KEY=your_imgbb_key
```

## Getting Started

```bash
npm install
npm run dev
```
