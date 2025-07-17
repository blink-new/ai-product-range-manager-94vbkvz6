import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './components/pages/Dashboard'
import { RangeAnalysis } from './components/pages/RangeAnalysis'
import { AIRecommendations } from './components/pages/AIRecommendations'
import { DataSources } from './components/pages/DataSources'

// Placeholder components for other pages
const ProductPerformance = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Product Performance</h1>
    <p className="text-muted-foreground">Detailed product performance analytics coming soon...</p>
  </div>
)

const DemandForecasting = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Demand Forecasting</h1>
    <p className="text-muted-foreground">AI-powered demand forecasting tools coming soon...</p>
  </div>
)

const CompetitiveIntelligence = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Competitive Intelligence</h1>
    <p className="text-muted-foreground">Competitive analysis and market intelligence coming soon...</p>
  </div>
)

const Settings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
    <p className="text-muted-foreground">Platform settings and configuration coming soon...</p>
  </div>
)

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto animate-pulse">
            <span className="text-primary-foreground font-bold">R</span>
          </div>
          <p className="text-muted-foreground">Loading RangeAI Platform...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-2xl">R</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Welcome to RangeAI</h1>
            <p className="text-muted-foreground">
              AI-powered product range management platform for category managers and merchandisers
            </p>
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'range-analysis':
        return <RangeAnalysis />
      case 'performance':
        return <ProductPerformance />
      case 'ai-recommendations':
        return <AIRecommendations />
      case 'forecasting':
        return <DemandForecasting />
      case 'competitive':
        return <CompetitiveIntelligence />
      case 'data-sources':
        return <DataSources />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <AppLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AppLayout>
  )
}

export default App