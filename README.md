# planForge

Transform your raw ideas into actionable masterplans with AI-powered project planning.

## Features

- **AI-Powered Planning**: Generate comprehensive project plans using Google Gemini AI
- **Interactive Questionnaire**: Answer tailored questions to refine your project scope
- **Tech Stack Recommendations**: Get technology suggestions based on your requirements
- **Phase-Based Roadmap**: Structured development phases with clear milestones
- **Task Management**: Detailed tasks with difficulty ratings and dependencies

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Zustand for state management

### Backend
- Node.js with Express
- TypeScript
- Firebase Firestore for database
- Google Gemini AI for plan generation
- Winston for logging

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project
- Google AI Studio API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd planForge
```

2. Install dependencies
```bash
# Frontend
cd Frontend
npm install

# Backend
cd ../Backend
npm install
```

3. Environment Setup

**Backend (.env)**
```env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
PORT=3001
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

4. Start the application
```bash
# Backend
cd Backend
npm run dev

# Frontend (new terminal)
cd Frontend
npm run dev
```

## Usage

1. **Input Your Idea**: Describe your project concept
2. **Select Domain**: Choose between Tech Product, Non-Tech, Academic, or Creative
3. **Choose Platform**: For tech projects, specify the platform type
4. **Answer Questions**: Complete the AI-generated questionnaire
5. **Get Your Plan**: Receive a comprehensive project masterplan

## Project Structure

```
planForge/
├── Frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and hooks
│   │   └── types/         # TypeScript definitions
├── Backend/
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Helper functions
└── README.md
```

## API Endpoints

- `POST /api/questions` - Generate project questions
- `POST /api/plan` - Generate project plan
- `GET /api/projects/:id` - Get project details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License