# FitFlow AI

**Automated Exercise Tracking & Personalized Growth Insights**

FitFlow AI is an intelligent fitness tracking web application that automatically logs workout data and provides personalized performance insights powered by AI. Built with React, Supabase, and OpenAI.

## 🚀 Features

### Core Features
- **Automated Real-time Workout Logging**: Track exercises, sets, reps, and weights during workout sessions
- **Progress Visualization & Analysis**: View workout history, personal records, and performance trends
- **Personalized AI Recommendations**: Get data-driven workout advice powered by OpenAI
- **Cross-App Data Integration**: Consolidate fitness data from multiple sources (future scope)

### Technical Features
- **Authentication**: Secure user registration and login with Supabase Auth
- **Real-time Database**: PostgreSQL with Row Level Security (RLS)
- **AI Integration**: OpenAI GPT-3.5 Turbo for personalized recommendations
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Subscription Management**: Tiered pricing with Stripe integration (ready)

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-3.5 Turbo
- **Payments**: Stripe (configured, not implemented)
- **Deployment**: Ready for Vercel/Netlify

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Stripe account (optional, for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd fitflow-ai
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
VITE_APP_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migration:

```bash
# Copy the SQL from supabase/migrations/001_initial_schema.sql
# and run it in your Supabase SQL editor
```

The migration creates:
- User profiles and preferences
- Workout and exercise tracking tables
- Exercise library with common exercises
- Personal records tracking
- AI recommendations storage
- Row Level Security (RLS) policies

### 4. API Keys Setup

#### Supabase
1. Go to your Supabase project settings
2. Copy the Project URL and anon public key
3. Add them to your `.env` file

#### OpenAI
1. Get an API key from [OpenAI Platform](https://platform.openai.com)
2. Add it to your `.env` file
3. Ensure you have credits in your OpenAI account

#### Stripe (Optional)
1. Create a Stripe account
2. Get your publishable and secret keys
3. Add them to your `.env` file

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📊 Database Schema

### Core Tables

- **users**: User profiles extending Supabase auth
- **workouts**: Workout sessions with timing
- **exercises**: Individual exercises within workouts
- **exercise_library**: Predefined exercise database
- **personal_records**: PR tracking
- **ai_recommendations**: AI-generated advice
- **user_preferences**: User settings
- **workout_templates**: Reusable workout plans

### Key Features

- **Row Level Security**: Users can only access their own data
- **Real-time subscriptions**: Live updates across sessions
- **Automatic timestamps**: Created/updated tracking
- **Data validation**: Constraints and checks

## 🤖 AI Integration

### OpenAI Features

- **Personalized Recommendations**: Analyzes workout history and PRs
- **Workout Planning**: Generates custom workout plans
- **Progress Insights**: Identifies patterns and suggests improvements

### Recommendation Categories

1. **STRENGTH**: Progressive overload suggestions
2. **RECOVERY**: Rest and injury prevention
3. **VARIETY**: New exercises and variations
4. **FORM**: Technique improvements
5. **NUTRITION**: Basic nutrition guidance

## 🎨 Design System

### Color Palette
- **Primary**: `hsl(210, 80%, 50%)` - Blue
- **Accent**: `hsl(140, 70%, 45%)` - Green
- **Background**: `hsl(230, 20%, 95%)` - Light gray
- **Surface**: `hsl(0, 0%, 100%)` - White
- **Text**: `hsl(220, 20%, 20%)` - Dark gray

### Components
- Responsive grid system (12-column)
- Consistent spacing and typography
- Accessible form controls
- Loading states and error handling

## 🔐 Security

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security (RLS)
- **Data Validation**: Client and server-side validation
- **API Security**: Environment variables for sensitive keys

## 📱 User Experience

### Authentication Flow
1. Sign up with email/password
2. Email confirmation (optional)
3. Automatic profile creation
4. Onboarding tour

### Workout Flow
1. Start workout session
2. Add exercises with sets/reps/weight
3. Real-time duration tracking
4. Finish and save workout
5. Automatic AI analysis

### Progress Tracking
1. View workout history
2. Track personal records
3. Analyze performance trends
4. Receive AI recommendations

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Netlify Deployment

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 Subscription Tiers

### Free Tier
- Basic workout tracking
- Limited AI insights
- 10 workouts per month

### Pro Tier ($9/month)
- Unlimited workouts
- Advanced analytics
- Full AI recommendations
- Export data

### Elite Tier ($19/month)
- Everything in Pro
- Custom workout plans
- Priority support
- Beta features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests via GitHub

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core workout tracking
- ✅ AI recommendations
- ✅ User authentication
- ✅ Progress visualization

### Phase 2 (Next)
- [ ] Stripe subscription integration
- [ ] Mobile app (React Native)
- [ ] Wearable device integration
- [ ] Social features

### Phase 3 (Future)
- [ ] Advanced analytics
- [ ] Nutrition tracking
- [ ] Trainer marketplace
- [ ] API for third-party integrations

---

**Built with ❤️ for fitness enthusiasts who want to train smarter, not just harder.**
