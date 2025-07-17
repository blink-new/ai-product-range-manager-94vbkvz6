import { useState } from 'react'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Package,
  Users,
  Calendar,
  ArrowRight,
  Lightbulb,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

const strategicRecommendations = [
  {
    id: 'rec_001',
    type: 'range_expansion',
    priority: 'high',
    title: 'Electronics Mid-Tier Gap Opportunity',
    description: 'AI analysis identifies a significant gap in mid-tier smartphone accessories ($50-$150 price range) that competitors are successfully exploiting.',
    impact: {
      revenue: '+$280K',
      margin: '+3.2%',
      marketShare: '+2.1%'
    },
    confidence: 94,
    timeline: '6-8 weeks',
    effort: 'medium',
    category: 'Electronics',
    actions: [
      'Source 8-12 mid-tier wireless charging pads',
      'Add premium phone cases for latest models',
      'Introduce mid-range Bluetooth speakers',
      'Launch targeted marketing campaign'
    ],
    risks: ['Inventory investment of $45K', 'Seasonal demand variation'],
    kpis: ['Revenue growth', 'Category market share', 'Inventory turnover']
  },
  {
    id: 'rec_002',
    type: 'optimization',
    priority: 'high',
    title: 'Seasonal Inventory Optimization',
    description: 'Current seasonal products showing 23% slower turnover than forecasted. Immediate action required to prevent markdown losses.',
    impact: {
      revenue: '-$45K risk',
      margin: '+1.8%',
      inventory: '-30%'
    },
    confidence: 91,
    timeline: '2-3 weeks',
    effort: 'low',
    category: 'Seasonal',
    actions: [
      'Reduce seasonal inventory by 30%',
      'Implement dynamic pricing strategy',
      'Bundle slow-moving items with popular products',
      'Accelerate clearance timeline'
    ],
    risks: ['Potential stockouts on popular items', 'Customer satisfaction impact'],
    kpis: ['Inventory turnover', 'Markdown percentage', 'Gross margin']
  },
  {
    id: 'rec_003',
    type: 'premium_launch',
    priority: 'medium',
    title: 'Beauty Premium Range Expansion',
    description: 'Market analysis shows strong demand for premium beauty products. Customer segments show 67% willingness to pay premium prices.',
    impact: {
      revenue: '+$150K',
      margin: '+5.4%',
      customerValue: '+12%'
    },
    confidence: 87,
    timeline: '8-12 weeks',
    effort: 'high',
    category: 'Beauty',
    actions: [
      'Partner with premium beauty brands',
      'Create dedicated premium display area',
      'Train staff on premium product benefits',
      'Develop loyalty program tier'
    ],
    risks: ['Higher inventory investment', 'Brand positioning challenges'],
    kpis: ['Average transaction value', 'Premium category growth', 'Customer retention']
  }
]

const quickWins = [
  {
    title: 'Cross-Merchandising Opportunity',
    description: 'Bundle yoga mats with water bottles - 34% higher conversion',
    impact: '+$12K revenue',
    effort: 'Low',
    timeline: '1 week'
  },
  {
    title: 'Price Optimization',
    description: 'Adjust pricing on 12 underperforming SKUs based on competitor analysis',
    impact: '+2.3% margin',
    effort: 'Low',
    timeline: '2 days'
  },
  {
    title: 'Inventory Rebalancing',
    description: 'Redistribute slow-moving inventory across high-performing locations',
    impact: '+15% turnover',
    effort: 'Medium',
    timeline: '1 week'
  }
]

const marketInsights = [
  {
    category: 'Electronics',
    trend: 'Growing demand for sustainable tech accessories',
    opportunity: 'Eco-friendly phone cases and chargers',
    confidence: 89,
    timeframe: 'Next 3 months'
  },
  {
    category: 'Apparel',
    trend: 'Shift towards comfort-focused workwear',
    opportunity: 'Hybrid work clothing line',
    confidence: 76,
    timeframe: 'Next 6 months'
  },
  {
    category: 'Home & Garden',
    trend: 'Indoor gardening and wellness focus',
    opportunity: 'Smart plant care products',
    confidence: 82,
    timeframe: 'Next 4 months'
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low': return 'bg-green-100 text-green-800 border-green-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'range_expansion': return <Target className="w-5 h-5 text-blue-600" />
    case 'optimization': return <TrendingUp className="w-5 h-5 text-green-600" />
    case 'premium_launch': return <Zap className="w-5 h-5 text-purple-600" />
    default: return <Lightbulb className="w-5 h-5 text-gray-600" />
  }
}

export function AIRecommendations() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Recommendations</h1>
          <p className="text-muted-foreground mt-1">
            Strategic insights and actionable recommendations powered by AI analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Brain className="w-3 h-3 mr-1" />
            AI Analysis Updated 2 min ago
          </Badge>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{strategicRecommendations.length}</p>
                <p className="text-sm text-muted-foreground">Strategic Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">$385K</p>
                <p className="text-sm text-muted-foreground">Potential Revenue Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">+6.8%</p>
                <p className="text-sm text-muted-foreground">Margin Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{quickWins.length}</p>
                <p className="text-sm text-muted-foreground">Quick Wins Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="strategic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="strategic">Strategic Recommendations</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
          <TabsTrigger value="market-insights">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommendations List */}
            <div className="lg:col-span-2 space-y-4">
              {strategicRecommendations.map((rec) => (
                <Card 
                  key={rec.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRecommendation === rec.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedRecommendation(rec.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(rec.type)}
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription className="mt-1">{rec.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Impact Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-lg font-bold text-foreground">{rec.impact.revenue}</p>
                          <p className="text-xs text-muted-foreground">Revenue Impact</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-lg font-bold text-foreground">{rec.impact.margin}</p>
                          <p className="text-xs text-muted-foreground">Margin Impact</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-lg font-bold text-foreground">{rec.confidence}%</p>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                        </div>
                      </div>

                      {/* Timeline and Effort */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Timeline: {rec.timeline}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Effort: {rec.effort}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed View */}
            <div className="space-y-4">
              {selectedRecommendation ? (
                (() => {
                  const rec = strategicRecommendations.find(r => r.id === selectedRecommendation)
                  if (!rec) return null
                  
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          {getTypeIcon(rec.type)}
                          <span>Action Plan</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Confidence Score */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">AI Confidence</span>
                            <span className="text-sm font-bold">{rec.confidence}%</span>
                          </div>
                          <Progress value={rec.confidence} />
                        </div>

                        <Separator />

                        {/* Action Items */}
                        <div>
                          <h4 className="font-medium mb-3">Required Actions</h4>
                          <div className="space-y-2">
                            {rec.actions.map((action, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Risks */}
                        <div>
                          <h4 className="font-medium mb-3">Key Risks</h4>
                          <div className="space-y-2">
                            {rec.risks.map((risk, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{risk}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* KPIs */}
                        <div>
                          <h4 className="font-medium mb-3">Success Metrics</h4>
                          <div className="space-y-1">
                            {rec.kpis.map((kpi, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-1">
                                {kpi}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full">
                          <Zap className="w-4 h-4 mr-2" />
                          Implement Recommendation
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })()
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a recommendation to view detailed action plan
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick-wins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Wins - Immediate Actions</CardTitle>
              <CardDescription>
                Low-effort, high-impact opportunities you can implement today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickWins.map((win, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground">{win.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {win.timeline}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{win.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-accent">{win.impact}</p>
                        <p className="text-xs text-muted-foreground">Effort: {win.effort}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence & Trends</CardTitle>
              <CardDescription>
                AI-powered market analysis and emerging opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {marketInsights.map((insight, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{insight.category}</h4>
                        <Badge variant="outline" className="mt-1">{insight.timeframe}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{insight.confidence}%</p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Market Trend</p>
                        <p className="text-sm text-foreground">{insight.trend}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Opportunity</p>
                        <p className="text-sm text-foreground">{insight.opportunity}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                      <Progress value={insight.confidence} className="w-24" />
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        Research Market
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}