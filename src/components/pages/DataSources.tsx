import { useState, useCallback } from 'react'
import { 
  Upload, 
  Database, 
  FileText, 
  Table, 
  Cloud, 
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { DataPreview } from '@/components/ui/data-preview'
import { 
  processDataFile, 
  validateProductData, 
  validateSalesData,
  generateProductTemplate,
  generateSalesTemplate,
  testAPIConnection,
  DataValidationResult,
  DataImportResult
} from '@/lib/dataProcessing'

interface DataSource {
  id: string
  name: string
  type: 'file' | 'api' | 'database'
  sourceType: string
  status: 'active' | 'inactive' | 'error' | 'syncing'
  lastSync?: string
  recordCount?: number
  fileSize?: number
}

interface FileUploadProps {
  onUpload: (file: File) => void
  accept?: string
  maxSize?: number
}

function FileUpload({ onUpload, accept = '.csv,.xlsx,.json', maxSize = 10 * 1024 * 1024 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (!file) return
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
        variant: "destructive"
      })
      return
    }
    
    onUpload(file)
  }, [onUpload, maxSize, toast])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
          variant: "destructive"
        })
        return
      }
      onUpload(file)
    }
  }, [onUpload, maxSize, toast])

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        Drop your file here, or click to browse
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Supports CSV, Excel, and JSON files up to {Math.round(maxSize / 1024 / 1024)}MB
      </p>
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <Button asChild variant="outline">
        <label htmlFor="file-upload" className="cursor-pointer">
          Select File
        </label>
      </Button>
    </div>
  )
}

function ConnectorDialog({ onConnect }: { onConnect: (config: any) => void }) {
  const [connectorType, setConnectorType] = useState<string>('')
  const [config, setConfig] = useState<any>({})

  const connectorTypes = [
    { value: 'rest_api', label: 'REST API', icon: Cloud },
    { value: 'postgres', label: 'PostgreSQL', icon: Database },
    { value: 'mysql', label: 'MySQL', icon: Database },
    { value: 'shopify', label: 'Shopify', icon: Cloud },
    { value: 'woocommerce', label: 'WooCommerce', icon: Cloud },
  ]

  const handleConnect = () => {
    onConnect({
      type: 'api',
      sourceType: connectorType,
      config
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Connector
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Data Connector</DialogTitle>
          <DialogDescription>
            Connect to external data sources to import product and sales data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="connector-type">Connector Type</Label>
            <Select value={connectorType} onValueChange={setConnectorType}>
              <SelectTrigger>
                <SelectValue placeholder="Select connector type" />
              </SelectTrigger>
              <SelectContent>
                {connectorTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {connectorType === 'rest_api' && (
            <>
              <div>
                <Label htmlFor="api-url">API URL</Label>
                <Input
                  id="api-url"
                  placeholder="https://api.example.com/products"
                  value={config.url || ''}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Your API key"
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                />
              </div>
            </>
          )}

          {(connectorType === 'postgres' || connectorType === 'mysql') && (
            <>
              <div>
                <Label htmlFor="db-host">Host</Label>
                <Input
                  id="db-host"
                  placeholder="localhost"
                  value={config.host || ''}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="db-name">Database Name</Label>
                <Input
                  id="db-name"
                  placeholder="products_db"
                  value={config.database || ''}
                  onChange={(e) => setConfig({ ...config, database: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="db-user">Username</Label>
                <Input
                  id="db-user"
                  placeholder="username"
                  value={config.username || ''}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="db-password">Password</Label>
                <Input
                  id="db-password"
                  type="password"
                  placeholder="password"
                  value={config.password || ''}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                />
              </div>
            </>
          )}

          {(connectorType === 'shopify' || connectorType === 'woocommerce') && (
            <>
              <div>
                <Label htmlFor="store-url">Store URL</Label>
                <Input
                  id="store-url"
                  placeholder="https://your-store.myshopify.com"
                  value={config.storeUrl || ''}
                  onChange={(e) => setConfig({ ...config, storeUrl: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="access-token">Access Token</Label>
                <Input
                  id="access-token"
                  type="password"
                  placeholder="Your access token"
                  value={config.accessToken || ''}
                  onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                />
              </div>
            </>
          )}

          <Button 
            onClick={handleConnect} 
            className="w-full"
            disabled={!connectorType}
          >
            Connect Data Source
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function DataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Product Catalog CSV',
      type: 'file',
      sourceType: 'csv',
      status: 'active',
      lastSync: '2024-01-15T10:30:00Z',
      recordCount: 2847,
      fileSize: 1024000
    },
    {
      id: '2',
      name: 'Sales Data Excel',
      type: 'file',
      sourceType: 'excel',
      status: 'active',
      lastSync: '2024-01-15T09:15:00Z',
      recordCount: 15632,
      fileSize: 2048000
    },
    {
      id: '3',
      name: 'Shopify Store API',
      type: 'api',
      sourceType: 'shopify',
      status: 'syncing',
      lastSync: '2024-01-15T11:00:00Z',
      recordCount: 1205
    }
  ])
  
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<{
    validation: DataValidationResult
    fileName: string
    file: File
    dataType: 'product' | 'sales' | 'inventory'
  } | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Determine data type based on filename or content
      let dataType: 'product' | 'sales' | 'inventory' = 'product'
      const fileName = file.name.toLowerCase()
      if (fileName.includes('sales') || fileName.includes('revenue')) {
        dataType = 'sales'
      } else if (fileName.includes('inventory') || fileName.includes('stock')) {
        dataType = 'inventory'
      }

      // Parse and validate file
      let records: any[] = []
      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        records = text.trim().split('\n').slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          const headers = text.split('\n')[0].split(',').map(h => h.trim().replace(/"/g, ''))
          const record: any = {}
          headers.forEach((header, index) => {
            const value = values[index] || ''
            record[header] = !isNaN(Number(value)) && value !== '' ? Number(value) : value
          })
          return record
        })
      } else {
        // For demo purposes, create sample data for Excel/JSON
        records = [
          { sku: 'DEMO-001', name: 'Demo Product 1', category: 'Electronics', price: 99.99 },
          { sku: 'DEMO-002', name: 'Demo Product 2', category: 'Apparel', price: 49.99 }
        ]
      }

      // Validate data
      let validation: DataValidationResult
      if (dataType === 'product') {
        validation = validateProductData(records)
      } else if (dataType === 'sales') {
        validation = validateSalesData(records)
      } else {
        validation = {
          isValid: records.length > 0,
          errors: records.length === 0 ? ['No data found in file'] : [],
          warnings: [],
          recordCount: records.length,
          validRecords: records.length,
          preview: records.slice(0, 5)
        }
      }

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Show preview dialog
      setPreviewData({
        validation,
        fileName: file.name,
        file,
        dataType
      })
      setShowPreview(true)

      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)

    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      })
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleImportData = async () => {
    if (!previewData) return

    setIsImporting(true)

    try {
      // Process and import the data
      const result: DataImportResult = await processDataFile(
        previewData.file,
        previewData.dataType
      )

      if (result.success) {
        // Create data source record
        const newDataSource: DataSource = {
          id: result.dataSourceId || Date.now().toString(),
          name: previewData.fileName,
          type: 'file',
          sourceType: previewData.fileName.endsWith('.csv') ? 'csv' : 
                     previewData.fileName.endsWith('.xlsx') ? 'excel' : 'json',
          status: 'active',
          lastSync: new Date().toISOString(),
          recordCount: result.recordsProcessed,
          fileSize: previewData.file.size
        }

        setDataSources(prev => [...prev, newDataSource])

        toast({
          title: "Data imported successfully",
          description: `${result.recordsProcessed} records have been imported and are ready for analysis`
        })

        setShowPreview(false)
        setPreviewData(null)
      } else {
        toast({
          title: "Import failed",
          description: result.errors.join(', '),
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Import failed:', error)
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleCancelPreview = () => {
    setShowPreview(false)
    setPreviewData(null)
  }

  const handleConnectorAdd = async (config: any) => {
    try {
      // Test API connection if it's an API connector
      if (config.type === 'api') {
        const testResult = await testAPIConnection({
          url: config.url || config.storeUrl,
          apiKey: config.apiKey || config.accessToken,
          headers: config.headers
        })

        if (!testResult.success) {
          toast({
            title: "Connection failed",
            description: testResult.message,
            variant: "destructive"
          })
          return
        }
      }

      const newDataSource: DataSource = {
        id: Date.now().toString(),
        name: `${config.sourceType} Connector`,
        type: config.type,
        sourceType: config.sourceType,
        status: 'active',
        lastSync: new Date().toISOString(),
        recordCount: Math.floor(Math.random() * 3000) + 500
      }

      setDataSources(prev => [...prev, newDataSource])

      toast({
        title: "Connector added successfully",
        description: "Your data source has been connected and is syncing"
      })
    } catch (error) {
      console.error('Connector add failed:', error)
      toast({
        title: "Connection failed",
        description: "There was an error connecting to your data source.",
        variant: "destructive"
      })
    }
  }

  const handleDownloadTemplate = (templateType: string) => {
    let content = ''
    let filename = ''

    switch (templateType) {
      case 'product':
        content = generateProductTemplate()
        filename = 'product_template.csv'
        break
      case 'sales':
        content = generateSalesTemplate()
        filename = 'sales_template.csv'
        break
      default:
        return
    }

    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Template downloaded",
      description: `${filename} has been downloaded to your computer`
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string, sourceType: string) => {
    if (type === 'file') {
      return sourceType === 'csv' ? <FileText className="w-5 h-5" /> : <Table className="w-5 h-5" />
    }
    return <Database className="w-5 h-5" />
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground mt-1">
            Connect and manage your product and sales data sources
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ConnectorDialog onConnect={handleConnectorAdd} />
        </div>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* Data Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.map((source) => (
              <Card key={source.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(source.type, source.sourceType)}
                      <CardTitle className="text-base">{source.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(source.status)}
                      <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                        {source.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{source.sourceType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Records</p>
                      <p className="font-medium">{source.recordCount?.toLocaleString() || 'N/A'}</p>
                    </div>
                    {source.fileSize && (
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{formatFileSize(source.fileSize)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Last Sync</p>
                      <p className="font-medium text-xs">{formatLastSync(source.lastSync)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Sync
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Data Files</CardTitle>
              <CardDescription>
                Upload CSV, Excel, or JSON files containing your product and sales data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isUploading ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Uploading and processing...</h3>
                    <p className="text-sm text-muted-foreground">Please wait while we process your file</p>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    {uploadProgress}% complete
                  </p>
                </div>
              ) : (
                <FileUpload onUpload={handleFileUpload} />
              )}
            </CardContent>
          </Card>

          {/* Upload Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>File Format Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Product Data (CSV/Excel)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Required columns: SKU, Name, Category, Price, Cost
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Optional: Brand, Inventory, Launch Date
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Table className="w-4 h-4 mr-2" />
                    Sales Data (CSV/Excel)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Required columns: SKU, Date, Units Sold, Revenue
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Optional: Channel, Region, Customer Segment
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Inventory Data (JSON)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Structure: Array of objects with SKU, quantity, location
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports nested attributes and metadata
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Product Catalog Template',
                description: 'Standard product information template with all required fields',
                type: 'CSV',
                icon: FileText
              },
              {
                name: 'Sales Data Template',
                description: 'Historical sales data template for performance analysis',
                type: 'Excel',
                icon: Table
              },
              {
                name: 'Inventory Template',
                description: 'Current inventory levels and stock information',
                type: 'CSV',
                icon: Database
              },
              {
                name: 'Competitor Data Template',
                description: 'Competitive pricing and product information',
                type: 'Excel',
                icon: FileText
              }
            ].map((template, index) => {
              const Icon = template.icon
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Icon className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleDownloadTemplate(
                        template.name.toLowerCase().includes('product') ? 'product' : 'sales'
                      )}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Data Preview Dialog */}
      {showPreview && previewData && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <DataPreview
            validation={previewData.validation}
            fileName={previewData.fileName}
            onImport={handleImportData}
            onCancel={handleCancelPreview}
            isImporting={isImporting}
          />
        </div>
      )}
    </div>
  )
}