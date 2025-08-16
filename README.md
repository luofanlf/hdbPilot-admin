# HDBPilot Admin Dashboard

A modern admin dashboard for HDBPilot property management system, built with Next.js 15, React 19, and TypeScript.

## Features

- **User Management**: Manage system users and permissions
- **Property Listings**: Review and approve property submissions
- **Dashboard Analytics**: Visual charts and statistics for property data
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Authentication**: Secure login/logout with session management
- **Route Protection**: Protected admin routes for authenticated users only

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Charts**: Recharts for data visualization
- **Icons**: FontAwesome icons
- **State Management**: React Context API
- **Build Tool**: Turbopack for development

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## Local Development

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd hdbpilot-admin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for production
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/            # Admin dashboard pages
│   │   ├── dashboard/    # Analytics dashboard
│   │   ├── users/        # User management
│   │   ├── listings/     # Property listings
│   │   └── reviews/      # Review management
│   └── page.tsx          # Login page
├── components/            # Reusable UI components
├── contexts/              # React context providers
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API Endpoints

The application expects the following API endpoints:

- `POST /api/admin/user/login` - User authentication
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/charts` - Chart data
- `POST /api/user/logout` - User logout

## Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions to EC2 with GitHub Actions CI/CD.

## License

Private - All rights reserved
