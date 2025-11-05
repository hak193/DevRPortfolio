# I-DevR Code - Professional Portfolio & AI App Builder

## Project Overview

I-DevR Code is a professional portfolio website for a Worcester, MA-based software development company, featuring:
- AI-powered automated app builder with smart prompting using Google Gemini API
- Comprehensive software/snippet/template marketplace
- Modern dark theme with Inter typography and indigo accents
- Full-stack JavaScript application with React frontend and Express backend

## Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Wouter for routing
- TanStack Query (React Query) for data fetching
- Shadcn UI component library
- Lucide React for icons

**Backend:**
- Node.js with Express
- TypeScript
- Google Gemini AI API integration
- In-memory storage (MemStorage)
- Zod for validation

**Development Tools:**
- Vite for build tooling
- Drizzle ORM for schema definitions
- ESBuild for transpilation

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Shadcn UI primitives
│   │   │   ├── Navigation.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── AppBuilderForm.tsx
│   │   │   ├── AIModal.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Store.tsx
│   │   │   ├── AppBuilder.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   ├── lib/          # Utilities
│   │   └── hooks/        # Custom React hooks
│   └── index.html
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   ├── gemini.ts         # Gemini AI integration
│   └── vite.ts           # Vite dev server integration
├── shared/                # Shared types and schemas
│   └── schema.ts         # Drizzle schemas and Zod validators
└── attached_assets/       # Static assets (images)
```

## Features

### 1. AI-Powered App Builder

The app builder guides users through creating application requirements with AI assistance:

- **Multi-step Form**: Three-step process (Basic Info → Requirements → Review)
- **Smart AI Suggestions**: Context-aware suggestions for:
  - App type selection
  - Feature recommendations based on app type and description
  - Target audience definition
- **AI-Generated Development Plan**: Comprehensive plan including:
  - Executive summary
  - Technical architecture recommendations
  - Core features prioritized by phase
  - Development timeline estimates
  - Resource requirements

**API Endpoints:**
- `POST /api/ai/suggestions/app-type` - Get app type suggestions
- `POST /api/ai/suggestions/features` - Get feature suggestions
- `POST /api/ai/suggestions/target-audience` - Get audience definition help
- `POST /api/app-projects` - Create project and generate AI plan
- `GET /api/app-projects/:id` - Retrieve project details

### 2. Template Marketplace

Browse and filter professional code templates:

- **Dynamic Template Listing**: Real-time data from backend API
- **Category Filtering**: Filter by technology/category
- **Search Functionality**: Search by title and description
- **Template Details**: Title, description, tech stack, features, pricing

**API Endpoints:**
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get template details
- `POST /api/templates` - Create new template (admin)

### 3. Contact System

Professional contact form with backend integration:

- **Form Validation**: Required fields with type checking
- **Submission Tracking**: Stores all contact submissions
- **Success Feedback**: Toast notifications and success messages

**API Endpoints:**
- `POST /api/contact` - Submit contact form

## Data Models

### Templates
```typescript
{
  id: string (UUID)
  title: string
  description: string
  category: string
  price: number
  image: string
  technologies: string[]
  features: string[]
}
```

### App Projects
```typescript
{
  id: string (UUID)
  appName: string
  appType: string
  description: string
  features: string
  targetAudience: string
  aiPlan: string | null
  createdAt: Date
}
```

### Contact Submissions
```typescript
{
  id: string (UUID)
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}
```

## Environment Configuration

### Required Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key for AI features
- `SESSION_SECRET` - Session secret for Express (auto-generated if not provided)
- `NODE_ENV` - Environment mode (development/production)

### Optional Environment Variables

- `PORT` - Server port (default: 5000)

## Design System

### Color Palette

- **Primary (Indigo)**: Used for CTAs, links, and brand elements
- **Background**: Deep dark tones for sophisticated appearance
- **Card**: Slightly elevated from background
- **Muted**: Secondary backgrounds and borders
- **Foreground**: Primary text color
- **Muted Foreground**: Secondary text color

### Typography

- **Font Family**: Inter (400, 500, 600, 700, 800 weights)
- **Headings**: Bold to extrabold (600-800)
- **Body**: Regular to medium (400-500)
- **Small Text**: 400 weight

### Spacing

Consistent spacing scale using Tailwind units:
- Small: 4, 6
- Medium: 8, 12, 16
- Large: 20, 24

## Development

### Running the Project

```bash
npm run dev
```

This starts both the Express backend and Vite frontend on port 5000.

### Adding New Features

1. **Define Schema**: Add data models to `shared/schema.ts`
2. **Update Storage**: Add CRUD methods to `server/storage.ts`
3. **Create Routes**: Add API endpoints to `server/routes.ts`
4. **Build UI**: Create components in `client/src/components`
5. **Create Pages**: Add pages to `client/src/pages`
6. **Register Routes**: Update `client/src/App.tsx`

### AI Integration

The Gemini AI integration uses the `gemini-2.0-flash-exp` model for:
- Fast response times
- Cost-effective operation
- High-quality suggestions

Error handling includes fallbacks for all AI operations to ensure graceful degradation.

## Deployment

The application is designed for deployment on Replit with:
- Automatic secret management
- Single-command deployment
- Built-in database support (when needed)

## Recent Updates

- Integrated Google Gemini API for AI-powered features
- Implemented backend API with Express and TypeScript
- Created comprehensive data schema with Drizzle
- Built AI-powered app builder with smart prompting
- Integrated template marketplace with real API data
- Added contact form with backend persistence
- Fixed React navigation warnings
- Implemented proper error handling and loading states

## Future Enhancements

Potential improvements for future iterations:
- User authentication and profiles
- Payment integration for template purchases
- Database migration from memory to PostgreSQL
- Admin dashboard for content management
- Template preview and demo functionality
- Email notifications for contact form submissions
- User project dashboard
- Real-time collaboration features
