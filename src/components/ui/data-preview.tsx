import { useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Eye, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataValidationResult } from '@/lib/dataProcessing'

interface DataPreviewProps {
  validation: DataValidationResult
  fileName: string
  onImport: () => void
  onCancel: () => void
  isImporting?: boolean
}

export function DataPreview({ 
  validation, 
  fileName, 
  onImport, 
  onCancel, 
  isImporting = false 
}: DataPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview')

  const getStatusColor = () => {
    if (validation.errors.length > 0) return 'text-red-500'
    if (validation.warnings.length > 0) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = () => {
    if (validation.errors.length > 0) return <XCircle className="w-5 h-5 text-red-500" />
    if (validation.warnings.length > 0) return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    return <CheckCircle className="w-5 h-5 text-green-500" />
  }

  const getStatusText = () => {
    if (validation.errors.length > 0) return 'Validation Failed'
    if (validation.warnings.length > 0) return 'Validation Passed with Warnings'
    return 'Validation Passed'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Data Preview: {fileName}</span>
            </CardTitle>
            <CardDescription>
              Review your data before importing into the system
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-foreground">{validation.recordCount}</p>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-green-600">{validation.validRecords}</p>
            <p className="text-sm text-muted-foreground">Valid Records</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-red-600">{validation.errors.length}</p>
            <p className="text-sm text-muted-foreground">Errors</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{validation.warnings.length}</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
        </div>

        {/* Validation Messages */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Validation Errors:</strong> Please fix the following issues before importing:
              <ul className="mt-2 list-disc list-inside space-y-1">
                {validation.errors.slice(0, 5).map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
                {validation.errors.length > 5 && (
                  <li className="text-sm font-medium">
                    ...and {validation.errors.length - 5} more errors
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warnings:</strong> The following issues were found but won't prevent import:
              <ul className="mt-2 list-disc list-inside space-y-1">
                {validation.warnings.slice(0, 3).map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
                {validation.warnings.length > 3 && (
                  <li className="text-sm font-medium">
                    ...and {validation.warnings.length - 3} more warnings
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Data Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">Data Preview</TabsTrigger>
            {validation.errors.length > 0 && (
              <TabsTrigger value="errors">
                Errors ({validation.errors.length})
              </TabsTrigger>
            )}
            {validation.warnings.length > 0 && (
              <TabsTrigger value="warnings">
                Warnings ({validation.warnings.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Sample Data (First 5 Records)</h3>
              <Badge variant="outline">
                {validation.preview.length} of {validation.recordCount} records shown
              </Badge>
            </div>
            
            {validation.preview.length > 0 ? (
              <ScrollArea className="h-64 w-full border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(validation.preview[0]).map((header) => (
                        <TableHead key={header} className="whitespace-nowrap">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validation.preview.map((record, index) => (
                      <TableRow key={index}>
                        {Object.values(record).map((value, cellIndex) => (
                          <TableCell key={cellIndex} className="whitespace-nowrap">
                            {value?.toString() || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No data preview available
              </div>
            )}
          </TabsContent>

          {validation.errors.length > 0 && (
            <TabsContent value="errors">
              <ScrollArea className="h-64 w-full">
                <div className="space-y-2">
                  {validation.errors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded border-l-4 border-red-500">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          {validation.warnings.length > 0 && (
            <TabsContent value="warnings">
              <ScrollArea className="h-64 w-full">
                <div className="space-y-2">
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-700">{warning}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onCancel} disabled={isImporting}>
            Cancel
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button 
              onClick={onImport} 
              disabled={validation.errors.length > 0 || isImporting}
              className="min-w-[120px]"
            >
              {isImporting ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}