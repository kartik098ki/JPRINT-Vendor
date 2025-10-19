'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  IndianRupee, 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Edit,
  Calculator,
  FileText,
  Printer,
  Package,
  Users
} from 'lucide-react'

interface PricingRule {
  id: string
  name: string
  category: 'b&w' | 'color' | 'binding' | 'scanning' | '3d-printing' | 'laminating'
  basePrice: number
  unitType: 'per-page' | 'per-copy' | 'per-item' | 'flat-rate'
  description: string
  isActive: boolean
  minQuantity?: number
  maxQuantity?: number
  paperSizes?: string[]
  additionalCharges?: Array<{
    name: string
    price: number
    type: 'fixed' | 'percentage'
  }>
}

interface PriceCalculator {
  service: string
  pages: number
  copies: number
  colorPrint: boolean
  duplex: boolean
  paperSize: string
  binding: boolean
  lamination: boolean
  totalPrice: number
}

export function PricingManagement() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [calculator, setCalculator] = useState<PriceCalculator>({
    service: 'b&w',
    pages: 10,
    copies: 1,
    colorPrint: false,
    duplex: false,
    paperSize: 'A4',
    binding: false,
    lamination: false,
    totalPrice: 0
  })
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Generate mock pricing rules
  const generateMockPricingRules = (): PricingRule[] => {
    return [
      {
        id: '1',
        name: 'B&W Printing - A4',
        category: 'b&w',
        basePrice: 2,
        unitType: 'per-page',
        description: 'Standard black and white printing on A4 paper',
        isActive: true,
        paperSizes: ['A4'],
        additionalCharges: [
          { name: 'Duplex Printing', price: 1, type: 'fixed' },
          { name: 'Rush Delivery', price: 50, type: 'percentage' }
        ]
      },
      {
        id: '2',
        name: 'Color Printing - A4',
        category: 'color',
        basePrice: 8,
        unitType: 'per-page',
        description: 'High quality color printing on A4 paper',
        isActive: true,
        paperSizes: ['A4'],
        additionalCharges: [
          { name: 'Duplex Printing', price: 4, type: 'fixed' },
          { name: 'Rush Delivery', price: 50, type: 'percentage' }
        ]
      },
      {
        id: '3',
        name: 'Thesis Binding',
        category: 'binding',
        basePrice: 50,
        unitType: 'flat-rate',
        description: 'Professional spiral binding for thesis and projects',
        isActive: true,
        minQuantity: 30,
        additionalCharges: [
          { name: 'Hard Cover', price: 100, type: 'fixed' },
          { name: 'Gold Embossing', price: 50, type: 'fixed' }
        ]
      },
      {
        id: '4',
        name: 'Document Scanning',
        category: 'scanning',
        basePrice: 3,
        unitType: 'per-page',
        description: 'High resolution document scanning',
        isActive: true,
        additionalCharges: [
          { name: 'OCR Service', price: 2, type: 'fixed' },
          { name: 'Urgent Scanning', price: 100, type: 'percentage' }
        ]
      },
      {
        id: '5',
        name: '3D Printing',
        category: '3d-printing',
        basePrice: 5,
        unitType: 'per-item',
        description: 'Basic 3D printing service (PLA material)',
        isActive: true,
        additionalCharges: [
          { name: 'Premium Material (ABS)', price: 3, type: 'fixed' },
          { name: 'Large Size (>15cm)', price: 50, type: 'percentage' }
        ]
      },
      {
        id: '6',
        name: 'Laminating Service',
        category: 'laminating',
        basePrice: 10,
        unitType: 'flat-rate',
        description: 'Document laminating service (A4 size)',
        isActive: true,
        additionalCharges: [
          { name: 'Glossy Finish', price: 5, type: 'fixed' },
          { name: 'Thick Lamination', price: 8, type: 'fixed' }
        ]
      }
    ]
  }

  useEffect(() => {
    setPricingRules(generateMockPricingRules())
  }, [])

  // Calculate total price based on calculator inputs
  useEffect(() => {
    calculateTotalPrice()
  }, [calculator.pages, calculator.copies, calculator.colorPrint, calculator.duplex, calculator.paperSize, calculator.binding, calculator.lamination])

  const calculateTotalPrice = () => {
    let totalPrice = 0

    // Base printing cost
    if (calculator.colorPrint) {
      totalPrice = 8 * calculator.pages * calculator.copies
    } else {
      totalPrice = 2 * calculator.pages * calculator.copies
    }

    // Duplex charge
    if (calculator.duplex) {
      totalPrice += calculator.copies * 1
    }

    // Paper size adjustment
    if (calculator.paperSize === 'A3') {
      totalPrice *= 2
    }

    // Binding charge
    if (calculator.binding) {
      totalPrice += 50
    }

    // Lamination charge
    if (calculator.lamination) {
      totalPrice += 10
    }

    setCalculator(prev => ({ ...prev, totalPrice }))
  }

  const savePricingRule = (rule: PricingRule) => {
    if (editingRule) {
      setPricingRules(prev => prev.map(r => r.id === rule.id ? rule : r))
    } else {
      setPricingRules(prev => [...prev, { ...rule, id: Date.now().toString() }])
    }
    setEditingRule(null)
    setShowAddForm(false)
  }

  const deletePricingRule = (id: string) => {
    setPricingRules(prev => prev.filter(r => r.id !== id))
  }

  const toggleRuleStatus = (id: string) => {
    setPricingRules(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ))
  }

  const getCategoryIcon = (category: PricingRule['category']) => {
    switch (category) {
      case 'b&w': return <FileText className="h-4 w-4" />
      case 'color': return <FileText className="h-4 w-4" />
      case 'binding': return <Package className="h-4 w-4" />
      case 'scanning': return <FileText className="h-4 w-4" />
      case '3d-printing': return <Printer className="h-4 w-4" />
      case 'laminating': return <Package className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: PricingRule['category']) => {
    switch (category) {
      case 'b&w': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'color': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'binding': return 'bg-green-100 text-green-800 border-green-200'
      case 'scanning': return 'bg-purple-100 text-purple-800 border-purple-200'
      case '3d-printing': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'laminating': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pricing Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Rule
        </Button>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
          <TabsTrigger value="calculator">Price Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          {/* Pricing Rules */}
          <div className="grid gap-4">
            {pricingRules.map((rule) => (
              <Card key={rule.id} className={`${!rule.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(rule.category)}`}>
                        {getCategoryIcon(rule.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRuleStatus(rule.id)}
                      >
                        {rule.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRule(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePricingRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Base Price</Label>
                      <div className="text-lg font-semibold">
                        ₹{rule.basePrice} / {rule.unitType.replace('-', ' ')}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Unit Type</Label>
                      <div className="text-lg font-semibold capitalize">{rule.unitType}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Category</Label>
                      <div className="text-lg font-semibold capitalize">{rule.category}</div>
                    </div>
                  </div>
                  
                  {rule.additionalCharges && rule.additionalCharges.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-600">Additional Charges</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {rule.additionalCharges.map((charge, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{charge.name}</span>
                            <span>
                              {charge.type === 'percentage' ? `${charge.price}%` : `₹${charge.price}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          {/* Price Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Price Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pages">Number of Pages</Label>
                    <Input
                      id="pages"
                      type="number"
                      value={calculator.pages}
                      onChange={(e) => setCalculator(prev => ({ ...prev, pages: parseInt(e.target.value) || 0 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="copies">Number of Copies</Label>
                    <Input
                      id="copies"
                      type="number"
                      value={calculator.copies}
                      onChange={(e) => setCalculator(prev => ({ ...prev, copies: parseInt(e.target.value) || 0 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paperSize">Paper Size</Label>
                    <Select value={calculator.paperSize} onValueChange={(value) => setCalculator(prev => ({ ...prev, paperSize: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Additional Options</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={calculator.colorPrint}
                          onChange={(e) => setCalculator(prev => ({ ...prev, colorPrint: e.target.checked }))}
                          className="rounded"
                        />
                        <span>Color Printing (+₹6 per page)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={calculator.duplex}
                          onChange={(e) => setCalculator(prev => ({ ...prev, duplex: e.target.checked }))}
                          className="rounded"
                        />
                        <span>Duplex Printing (+₹1 per copy)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={calculator.binding}
                          onChange={(e) => setCalculator(prev => ({ ...prev, binding: e.target.checked }))}
                          className="rounded"
                        />
                        <span>Binding (+₹50)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={calculator.lamination}
                          onChange={(e) => setCalculator(prev => ({ ...prev, lamination: e.target.checked }))}
                          className="rounded"
                        />
                        <span>Lamination (+₹10)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-medium">Total Price</Label>
                    <p className="text-sm text-gray-600">
                      {calculator.pages} pages × {calculator.copies} copies
                      {calculator.colorPrint && ' • Color'}
                      {calculator.duplex && ' • Duplex'}
                      {calculator.binding && ' • Binding'}
                      {calculator.lamination && ' • Lamination'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      ₹{calculator.totalPrice}
                    </div>
                    <p className="text-sm text-gray-600">Inclusive of all charges</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Pricing Rule Modal */}
      {(showAddForm || editingRule) && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={editingRule?.name}
                    placeholder="e.g., B&W Printing - A4"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={editingRule?.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b&w">B&W Printing</SelectItem>
                      <SelectItem value="color">Color Printing</SelectItem>
                      <SelectItem value="binding">Binding</SelectItem>
                      <SelectItem value="scanning">Scanning</SelectItem>
                      <SelectItem value="3d-printing">3D Printing</SelectItem>
                      <SelectItem value="laminating">Laminating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  defaultValue={editingRule?.description}
                  placeholder="Describe the service..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="basePrice">Base Price (₹)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    defaultValue={editingRule?.basePrice}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="unitType">Unit Type</Label>
                  <Select defaultValue={editingRule?.unitType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per-page">Per Page</SelectItem>
                      <SelectItem value="per-copy">Per Copy</SelectItem>
                      <SelectItem value="per-item">Per Item</SelectItem>
                      <SelectItem value="flat-rate">Flat Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowAddForm(false)
                  setEditingRule(null)
                }}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // This would save the form data
                  setShowAddForm(false)
                  setEditingRule(null)
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  )
}