import { blink } from '@/blink/client'

export interface ProductRecord {
  sku: string
  name: string
  category?: string
  subcategory?: string
  brand?: string
  price?: number
  cost?: number
  margin?: number
  inventoryLevel?: number
  salesVelocity?: number
  seasonality?: string
  launchDate?: string
  status?: string
  attributes?: Record<string, any>
}

export interface SalesRecord {
  sku: string
  date: string
  unitsSold: number
  revenue: number
  channel?: string
  region?: string
}

export interface DataValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  recordCount: number
  validRecords: number
  preview: any[]
}

export interface DataImportResult {
  success: boolean
  recordsProcessed: number
  recordsTotal: number
  errors: string[]
  dataSourceId: string
}

// CSV parsing utility
export function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const records = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    const record: any = {}
    
    headers.forEach((header, index) => {
      const value = values[index] || ''
      // Try to parse numbers
      if (value && !isNaN(Number(value)) && value !== '') {
        record[header] = Number(value)
      } else {
        record[header] = value
      }
    })
    
    records.push(record)
  }

  return records
}

// Excel parsing (simplified - in real app would use a library like xlsx)
export function parseExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // This is a simplified implementation
    // In a real app, you'd use a library like xlsx or exceljs
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        // For demo purposes, we'll simulate Excel parsing
        // In reality, you'd use: const workbook = XLSX.read(e.target?.result, { type: 'binary' })
        resolve([
          { sku: 'DEMO-001', name: 'Demo Product 1', category: 'Electronics', price: 99.99 },
          { sku: 'DEMO-002', name: 'Demo Product 2', category: 'Apparel', price: 49.99 }
        ])
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read Excel file'))
    reader.readAsBinaryString(file)
  })
}

// JSON parsing utility
export function parseJSON(jsonText: string): any[] {
  try {
    const data = JSON.parse(jsonText)
    return Array.isArray(data) ? data : [data]
  } catch (error) {
    throw new Error('Invalid JSON format')
  }
}

// Validate product data
export function validateProductData(records: any[]): DataValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let validRecords = 0
  
  const requiredFields = ['sku', 'name']
  const recommendedFields = ['category', 'price', 'cost']
  
  records.forEach((record, index) => {
    let isRecordValid = true
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!record[field] || record[field].toString().trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`)
        isRecordValid = false
      }
    })
    
    // Check recommended fields
    recommendedFields.forEach(field => {
      if (!record[field]) {
        warnings.push(`Row ${index + 1}: Missing recommended field '${field}'`)
      }
    })
    
    // Validate data types
    if (record.price && isNaN(Number(record.price))) {
      errors.push(`Row ${index + 1}: Price must be a number`)
      isRecordValid = false
    }
    
    if (record.cost && isNaN(Number(record.cost))) {
      errors.push(`Row ${index + 1}: Cost must be a number`)
      isRecordValid = false
    }
    
    if (isRecordValid) validRecords++
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recordCount: records.length,
    validRecords,
    preview: records.slice(0, 5) // First 5 records for preview
  }
}

// Validate sales data
export function validateSalesData(records: any[]): DataValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let validRecords = 0
  
  const requiredFields = ['sku', 'date', 'unitsSold', 'revenue']
  
  records.forEach((record, index) => {
    let isRecordValid = true
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!record[field] || record[field].toString().trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`)
        isRecordValid = false
      }
    })
    
    // Validate data types
    if (record.unitsSold && isNaN(Number(record.unitsSold))) {
      errors.push(`Row ${index + 1}: Units sold must be a number`)
      isRecordValid = false
    }
    
    if (record.revenue && isNaN(Number(record.revenue))) {
      errors.push(`Row ${index + 1}: Revenue must be a number`)
      isRecordValid = false
    }
    
    // Validate date format
    if (record.date && isNaN(Date.parse(record.date))) {
      errors.push(`Row ${index + 1}: Invalid date format`)
      isRecordValid = false
    }
    
    if (isRecordValid) validRecords++
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recordCount: records.length,
    validRecords,
    preview: records.slice(0, 5)
  }
}

// Process and import data
export async function processDataFile(
  file: File,
  dataType: 'product' | 'sales' | 'inventory'
): Promise<DataImportResult> {
  try {
    let records: any[] = []
    
    // Parse file based on type
    if (file.name.endsWith('.csv')) {
      const text = await file.text()
      records = parseCSV(text)
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      records = await parseExcel(file)
    } else if (file.name.endsWith('.json')) {
      const text = await file.text()
      records = parseJSON(text)
    } else {
      throw new Error('Unsupported file format')
    }
    
    // Validate data
    let validation: DataValidationResult
    if (dataType === 'product') {
      validation = validateProductData(records)
    } else if (dataType === 'sales') {
      validation = validateSalesData(records)
    } else {
      // For inventory or other types, use basic validation
      validation = {
        isValid: records.length > 0,
        errors: records.length === 0 ? ['No data found in file'] : [],
        warnings: [],
        recordCount: records.length,
        validRecords: records.length,
        preview: records.slice(0, 5)
      }
    }
    
    if (!validation.isValid) {
      return {
        success: false,
        recordsProcessed: 0,
        recordsTotal: records.length,
        errors: validation.errors,
        dataSourceId: ''
      }
    }
    
    // Upload file to storage
    const { publicUrl } = await blink.storage.upload(
      file,
      `data-sources/${Date.now()}-${file.name}`,
      { upsert: true }
    )
    
    // Create data source record (simplified - in real app would use database)
    const dataSourceId = `ds_${Date.now()}`
    
    // In a real implementation, you would:
    // 1. Save data source metadata to database
    // 2. Process and store individual records
    // 3. Run data quality checks
    // 4. Generate import summary
    
    return {
      success: true,
      recordsProcessed: validation.validRecords,
      recordsTotal: records.length,
      errors: validation.warnings, // Warnings as non-critical errors
      dataSourceId
    }
    
  } catch (error) {
    return {
      success: false,
      recordsProcessed: 0,
      recordsTotal: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      dataSourceId: ''
    }
  }
}

// Generate sample data templates
export function generateProductTemplate(): string {
  const headers = ['sku', 'name', 'category', 'subcategory', 'brand', 'price', 'cost', 'inventory_level', 'launch_date']
  const sampleData = [
    ['ELEC-001', 'Wireless Headphones', 'Electronics', 'Audio', 'TechBrand', '99.99', '45.00', '150', '2024-01-15'],
    ['APPR-001', 'Cotton T-Shirt', 'Apparel', 'Shirts', 'FashionCo', '24.99', '12.50', '300', '2024-02-01'],
    ['HOME-001', 'Coffee Maker', 'Home & Garden', 'Kitchen', 'HomePlus', '149.99', '75.00', '75', '2024-01-20']
  ]
  
  return [headers, ...sampleData].map(row => row.join(',')).join('\n')
}

export function generateSalesTemplate(): string {
  const headers = ['sku', 'date', 'units_sold', 'revenue', 'channel', 'region']
  const sampleData = [
    ['ELEC-001', '2024-01-15', '5', '499.95', 'online', 'North America'],
    ['APPR-001', '2024-01-16', '12', '299.88', 'retail', 'Europe'],
    ['HOME-001', '2024-01-17', '3', '449.97', 'online', 'Asia Pacific']
  ]
  
  return [headers, ...sampleData].map(row => row.join(',')).join('\n')
}

// API connector utilities
export async function testAPIConnection(config: {
  url: string
  apiKey?: string
  headers?: Record<string, string>
}): Promise<{ success: boolean; message: string; sampleData?: any }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    }
    
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`
    }
    
    // Use Blink's secure fetch to test API connection
    const response = await blink.data.fetch({
      url: config.url,
      method: 'GET',
      headers
    })
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Connection successful',
        sampleData: response.body
      }
    } else {
      return {
        success: false,
        message: `API returned status ${response.status}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed'
    }
  }
}