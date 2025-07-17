import { useState } from 'react'
import { 
  Filter, 
  Download, 
  RefreshCw, 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const rangeData = [
  {
    id: 'SKU001',
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    status: 'performing',
    revenue: 45000,
    margin: 32.5,
    velocity: 8.2,
    inventory: 156,
    forecast: 'growing',
    recommendation: 'expand',
    score: 92
  },
  {
    id: 'SKU002',
    name: 'Organic Cotton T-Shirt',
    category: 'Apparel',
    status: 'underperforming',
    revenue: 12000,
    margin: 28.1,
    velocity: 3.1,
    inventory: 340,
    forecast: 'declining',
    recommendation: 'reduce',
    score: 45
  },
  {
    id: 'SKU003',
    name: 'Smart Home Security Camera',
    category: 'Electronics',
    status: 'performing',
    revenue: 38000,
    margin: 41.2,
    velocity: 6.8,
    inventory: 89,
    forecast: 'stable',
    recommendation: 'maintain',
    score: 78
  },
  {
    id: 'SKU004',
    name: 'Yoga Mat Premium',
    category: 'Sports',
    status: 'opportunity',
    revenue: 8500,
    margin: 45.8,
    velocity: 12.3,
    inventory: 45,
    forecast: 'growing',
    recommendation: 'expand',
    score: 88
  },
  {
    id: 'SKU005',
    name: 'Kitchen Knife Set',
    category: 'Home & Garden',
    status: 'at_risk',
    revenue: 22000,
    margin: 18.5,
    velocity: 2.1,
    inventory: 280,
    forecast: 'declining',
    recommendation: 'discontinue',
    score: 32
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'performing': return 'bg-green-100 text-green-800'
    case 'underperforming': return 'bg-yellow-100 text-yellow-800'
    case 'opportunity': return 'bg-blue-100 text-blue-800'
    case 'at_risk': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getRecommendationIcon = (recommendation: string) => {
  switch (recommendation) {
    case 'expand': return <TrendingUp className="w-4 h-4 text-green-600" />
    case 'reduce': return <TrendingDown className="w-4 h-4 text-yellow-600" />
    case 'maintain': return <CheckCircle className="w-4 h-4 text-blue-600" />
    case 'discontinue': return <AlertCircle className="w-4 h-4 text-red-600" />
    default: return <Clock className="w-4 h-4 text-gray-600" />
  }
}

export function RangeAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = rangeData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesStatus && matchesSearch
  })

  const categoryStats = {
    total: rangeData.length,
    performing: rangeData.filter(item => item.status === 'performing').length,
    underperforming: rangeData.filter(item => item.status === 'underperforming').length,
    opportunities: rangeData.filter(item => item.status === 'opportunity').length,
    atRisk: rangeData.filter(item => item.status === 'at_risk').length
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Range Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Deep dive into product performance and optimization opportunities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{categoryStats.total}</p>
                <p className="text-sm text-muted-foreground">Total SKUs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{categoryStats.performing}</p>
                <p className="text-sm text-muted-foreground">Performing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{categoryStats.opportunities}</p>
                <p className="text-sm text-muted-foreground">Opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{categoryStats.underperforming}</p>
                <p className="text-sm text-muted-foreground">Underperforming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{categoryStats.atRisk}</p>
                <p className="text-sm text-muted-foreground">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Analysis Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Apparel">Apparel</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Home & Garden">Home & Garden</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="performing">Performing</SelectItem>
                <SelectItem value="underperforming">Underperforming</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Matrix</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Range Overview</CardTitle>
              <CardDescription>
                Detailed analysis of {filteredData.length} products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Velocity</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>${product.revenue.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.margin}%</TableCell>
                      <TableCell>{product.velocity}x</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={product.score} className="w-16" />
                          <span className="text-sm font-medium">{product.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRecommendationIcon(product.recommendation)}
                          <span className="text-sm capitalize">{product.recommendation}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Matrix</CardTitle>
              <CardDescription>
                Visual analysis of product performance across key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map((product) => (
                  <div key={product.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{product.name}</h4>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Performance Score</span>
                        <span className="font-medium">{product.score}/100</span>
                      </div>
                      <Progress value={product.score} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">${(product.revenue / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Margin</p>
                        <p className="font-medium">{product.margin}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Velocity</p>
                        <p className="font-medium">{product.velocity}x</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center space-x-2">
                        {getRecommendationIcon(product.recommendation)}
                        <span className="text-sm font-medium capitalize">{product.recommendation}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription>
                Strategic recommendations based on performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData
                  .filter(product => product.recommendation !== 'maintain')
                  .map((product) => (
                    <div key={product.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start space-x-3">
                        {getRecommendationIcon(product.recommendation)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">{product.name}</h4>
                            <Badge variant="outline">Score: {product.score}</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {product.recommendation === 'expand' && 
                              `High-performing product with strong velocity (${product.velocity}x) and healthy margin (${product.margin}%). Consider increasing inventory and marketing investment.`
                            }
                            {product.recommendation === 'reduce' && 
                              `Underperforming with low velocity (${product.velocity}x). Consider reducing inventory levels and promotional pricing.`
                            }
                            {product.recommendation === 'discontinue' && 
                              `Poor performance across metrics. High inventory (${product.inventory} units) with declining forecast. Consider phase-out strategy.`
                            }
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-muted-foreground">
                                Revenue Impact: <span className="font-medium text-foreground">
                                  {product.recommendation === 'expand' ? '+$15K' : 
                                   product.recommendation === 'reduce' ? '-$8K' : '-$22K'}
                                </span>
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              Apply Recommendation
                            </Button>
                          </div>
                        </div>
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