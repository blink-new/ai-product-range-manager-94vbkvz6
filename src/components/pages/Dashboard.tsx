import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Brain,
  Target,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const kpiData = [
  {
    title: 'Range Performance Score',
    value: '87.2',
    change: '+5.3%',
    trend: 'up',
    icon: Target,
    description: 'Overall range optimization score'
  },
  {
    title: 'Revenue Impact',
    value: '$2.4M',
    change: '+12.8%',
    trend: 'up',
    icon: DollarSign,
    description: 'Monthly revenue from optimized ranges'
  },
  {
    title: 'SKU Efficiency',
    value: '73%',
    change: '-2.1%',
    trend: 'down',
    icon: Package,
    description: 'Active SKUs contributing to 80% revenue'
  },
  {
    title: 'Margin Optimization',
    value: '34.2%',
    change: '+3.7%',
    trend: 'up',
    icon: TrendingUp,
    description: 'Average gross margin improvement'
  }
]

const salesTrendData = [
  { month: 'Jan', revenue: 2100000, forecast: 2050000 },
  { month: 'Feb', revenue: 2300000, forecast: 2200000 },
  { month: 'Mar', revenue: 2150000, forecast: 2180000 },
  { month: 'Apr', revenue: 2400000, forecast: 2350000 },
  { month: 'May', revenue: 2600000, forecast: 2500000 },
  { month: 'Jun', revenue: 2450000, forecast: 2480000 },
]

const categoryPerformanceData = [
  { category: 'Electronics', performance: 92, revenue: 850000 },
  { category: 'Apparel', performance: 78, revenue: 620000 },
  { category: 'Home & Garden', performance: 85, revenue: 540000 },
  { category: 'Sports', performance: 71, revenue: 380000 },
  { category: 'Beauty', performance: 89, revenue: 290000 },
]

const rangeDistributionData = [
  { name: 'Core Products', value: 45, color: '#2563EB' },
  { name: 'Seasonal', value: 25, color: '#10B981' },
  { name: 'Premium', value: 20, color: '#F59E0B' },
  { name: 'Clearance', value: 10, color: '#EF4444' },
]

const aiInsights = [
  {
    type: 'opportunity',
    title: 'Range Gap Identified',
    description: 'Electronics category missing mid-tier smartphone accessories',
    impact: 'Potential +$180K revenue',
    confidence: 94,
    action: 'Add 12 SKUs'
  },
  {
    type: 'warning',
    title: 'Inventory Risk',
    description: 'Seasonal items showing slower than expected turnover',
    impact: 'Risk of $45K markdown',
    confidence: 87,
    action: 'Reduce by 30%'
  },
  {
    type: 'success',
    title: 'Margin Opportunity',
    description: 'Beauty category ready for premium range expansion',
    impact: 'Margin increase +4.2%',
    confidence: 91,
    action: 'Launch premium line'
  }
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights for your product range performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            <Brain className="w-3 h-3 mr-1" />
            AI Analysis Active
          </Badge>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          const isPositive = kpi.trend === 'up'
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <Badge 
                    variant={isPositive ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-sm font-medium text-foreground">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Forecast</CardTitle>
            <CardDescription>
              Monthly performance against AI predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  name="Actual Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Performance score vs revenue contribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" fill="#2563EB" name="Performance Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Range Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Range Distribution</CardTitle>
            <CardDescription>
              Product mix across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={rangeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rangeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {rangeDistributionData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <span>AI Insights & Recommendations</span>
            </CardTitle>
            <CardDescription>
              Real-time analysis and strategic recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                  <div className={`
                    w-2 h-2 rounded-full mt-2 flex-shrink-0
                    ${insight.type === 'opportunity' ? 'bg-accent' : ''}
                    ${insight.type === 'warning' ? 'bg-yellow-500' : ''}
                    ${insight.type === 'success' ? 'bg-green-500' : ''}
                  `} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-medium text-accent">{insight.impact}</span>
                      <Button variant="outline" size="sm">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}