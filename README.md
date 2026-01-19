# AI-Powered Sales Dashboard

A modern sales dashboard with integrated AI insights, built as a portfolio project demonstrating frontend architecture and AI integration skills.

![Dashboard Preview](./preview.png)

## Features

- **Real-time Metrics**: Revenue, orders, conversion rate, and average order value
- **Interactive Charts**: Revenue trends, order volume, and regional distribution
- **Top Products**: Best-performing product tracking with growth indicators
- **Recent Orders**: Live transaction feed with status tracking
- **AI Insights Panel**: Ask questions about your data and get AI-powered analysis

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Data Fetching**: TanStack React Query
- **AI Integration**: Pluggable provider system (Ollama, Claude, Groq, Gemini)

## AI Provider Architecture

The dashboard uses a pluggable AI provider system that supports:

| Provider | Cost | Best For |
|----------|------|----------|
| **Ollama** | Free (local) | Development, self-hosted |
| **Groq** | Free tier | Fast inference, production demos |
| **Claude** | Pay per use | High-quality responses |
| **Gemini** | Free tier | Google ecosystem |

### Switching Providers

1. Copy `.env.example` to `.env`
2. Set the API key for your preferred provider
3. The system auto-detects which provider to use based on available keys

## Getting Started

### Prerequisites

- Node.js 18+
- Ollama (for local AI - optional but recommended)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-sales-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Setting up Ollama (Recommended for Development)

```bash
# Install Ollama (macOS)
brew install ollama

# Or download from https://ollama.ai

# Pull a model
ollama pull llama3.2

# Start Ollama server (runs on port 11434)
ollama serve
```

## Usage Limits

In production mode, the AI feature is limited to **5 prompts per user** to keep demo costs manageable. This limit resets when localStorage is cleared.

For unlimited local development, use Ollama.

## Project Structure

```
src/
├── components/          # React components
│   ├── AIInsightsPanel.tsx    # AI chat interface
│   ├── DashboardCard.tsx      # Reusable card wrapper
│   ├── Header.tsx             # Dashboard header
│   ├── MetricCard.tsx         # KPI metric cards
│   ├── RecentOrders.tsx       # Orders table
│   ├── RegionChart.tsx        # Geographic revenue
│   ├── RevenueChart.tsx       # Line/bar charts
│   └── TopProducts.tsx        # Product rankings
├── data/
│   └── sales-data.ts    # Mock data & helpers
├── hooks/
│   └── useAI.ts         # AI hook with data context
├── services/
│   └── ai/
│       ├── index.ts           # Main AI service
│       ├── config.ts          # Provider configuration
│       ├── types.ts           # TypeScript types
│       ├── usage-limiter.ts   # Rate limiting
│       └── providers/
│           ├── ollama.ts      # Local LLM
│           ├── claude.ts      # Anthropic
│           ├── groq.ts        # Groq
│           └── gemini.ts      # Google
├── App.tsx              # Main dashboard layout
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment

### Vercel / Netlify

1. Connect your repository
2. Set environment variables for your AI provider
3. Deploy

### With Groq (Recommended for Production)

Groq offers a free tier with generous limits, making it ideal for portfolio demos:

1. Get an API key from [groq.com](https://groq.com)
2. Set `VITE_GROQ_API_KEY` in your deployment environment
3. Deploy

## License

MIT

## Author

**Yuvaraj** - Frontend Architect | React & Vue | Agentic Development & Integration

- [Upwork Profile](https://www.upwork.com/freelancers/~your-profile)
- [GitHub](https://github.com/your-username)
- [LinkedIn](https://linkedin.com/in/your-profile)
