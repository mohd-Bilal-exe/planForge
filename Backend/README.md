# PlanForge Backend

AI-powered Project Planner Backend built with Express.js, TypeScript, and Firebase.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Firebase Admin SDK** - Authentication and Firestore
- **Gemini API** - AI processing
- **REST API** - API architecture

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Admin SDK credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your-gemini-api-key-here

# Firebase Configuration (choose one):
# Option 1: Service Account Key (JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Option 2: Path to service account file
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json

# Option 3: Project ID (development only)
FIREBASE_PROJECT_ID=your-project-id
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Planner (Protected - Requires Firebase Auth)

- `POST /planner/questions` - Generate questions based on project idea
  - Requires: `idea`, `domain`, `platform`, `projectId`
  - Returns: Array of questions with options

- `POST /planner/plan` - Generate project plan from answers
  - Requires: `projectId`, `idea`, `domain`, `platform`, `answers`
  - Returns: Complete project plan with roadmap, tasks, and decisions

### Health Check

- `GET /health` - Server health status

## Authentication

All planner endpoints require Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

The backend verifies the token and extracts the user ID. Frontend handles all authentication and user management.

## Firestore Structure

The backend writes to Firestore:

```
projects/{projectId}
  ├── questions/{questionId}  # Generated questions
  └── plan/main               # Generated plan
```

## Project Structure

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Server entry point
├── config/                   # Configuration files
│   ├── firebase.ts          # Firebase Admin setup
│   └── ai.ts                # AI configuration
├── routes/                   # API routes
│   └── planner.routes.ts    # Planner endpoints
├── controllers/              # Request handlers
│   └── planner.controller.ts
├── services/                # Business logic
│   ├── planner.service.ts
│   └── ai/                  # AI-specific services
│       ├── promptFactory.ts
│       ├── questionGenerator.ts
│       ├── planGenerator.ts
│       ├── validators.ts
│       └── types.ts
├── middlewares/            # Express middlewares
│   ├── firebaseAuth.middleware.ts
│   └── error.middleware.ts
├── utils/                  # Utility functions
│   ├── response.ts
│   └── logger.ts
└── types/                  # TypeScript types
    └── planner.ts
```

## Development Notes

- Backend only verifies Firebase tokens - no user management
- All AI responses are validated before saving to Firestore
- Gemini API falls back to mock responses if API key is missing
- Firestore writes are non-blocking (errors logged but don't fail requests)

## Next Steps

1. Set up Firebase project and service account
2. Configure Firestore security rules
3. Add request rate limiting
4. Add API documentation (Swagger/OpenAPI)
