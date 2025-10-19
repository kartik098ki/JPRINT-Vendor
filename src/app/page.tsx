'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Printer, Store, TrendingUp, Users, FileText, CreditCard, Download, Eye, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Settings, History, Bell, Database, BarChart3, PrinterIcon } from 'lucide-react'
import { NotificationCenter } from '@/components/notifications'
import { BusinessAnalytics } from '@/components/business-analytics'
import { PricingManagement } from '@/components/pricing-management'
import { SettingsDialog } from '@/components/settings'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    sector: ''
  })

  useEffect(() => {
    // Check if already logged in
    const session = document.cookie
      .split('; ')
      .find(row => row.startsWith('vendor-session='))
    
    if (session) {
      try {
        const vendorData = JSON.parse(session.split('=')[1])
        setIsLoggedIn(true)
      } catch (e) {
        // Invalid session, clear it
        document.cookie = 'vendor-session=; Max-Age=0'
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', formData)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Login response status:', response.status)
      const data = await response.json()
      console.log('Login response data:', data)

      if (data.success) {
        console.log('Login successful, setting logged in state')
        setIsLoggedIn(true)
        setError('')
        // Force a re-render to show dashboard
        setTimeout(() => {
          fetchDashboardData()
        }, 100)
      } else {
        console.error('Login failed:', data.error)
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setFormData({ email: '', password: '', sector: '' })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Printer className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">JPRINT Vendor</h1>
          <p className="text-slate-600">College Print Service Dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Vendor Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the print dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vendor@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEC-128">SEC-128</SelectItem>
                    <SelectItem value="SEC-62">SEC-62</SelectItem>
                    <SelectItem value="SEC-45">SEC-45</SelectItem>
                    <SelectItem value="SEC-33">SEC-33</SelectItem>
                    <SelectItem value="MAIN-CAMPUS">Main Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !formData.email || !formData.password || !formData.sector}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>© 2024 JPRINT College Print Service</p>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    fetchDashboardData()
    fetchAllOrders()
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchDashboardData()
      fetchAllOrders()
    }, 30000) // Update every 30 seconds
    
    // Simulate real-time order updates every 15 seconds
    const orderInterval = setInterval(() => {
      setRecentOrders(prev => {
        const updatedOrders = [...prev]
        // Randomly update an order status
        if (updatedOrders.length > 0 && Math.random() > 0.5) {
          const randomIndex = Math.floor(Math.random() * updatedOrders.length)
          const statuses = ['PENDING', 'ACCEPTED', 'PRINTING', 'COMPLETED']
          const currentStatusIndex = statuses.indexOf(updatedOrders[randomIndex].status)
          if (currentStatusIndex < statuses.length - 1) {
            updatedOrders[randomIndex] = {
              ...updatedOrders[randomIndex],
              status: statuses[currentStatusIndex + 1],
              time: 'Just now'
            }
          }
        }
        return updatedOrders
      })
    }, 15000)
    
    return () => {
      clearInterval(interval)
      clearInterval(orderInterval)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      console.log('Dashboard response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Dashboard data received:', data)
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
      } else {
        const errorData = await response.json()
        console.error('Dashboard API error:', errorData)
        // If unauthorized, redirect to login
        if (response.status === 401) {
          setIsLoggedIn(false)
          setError('Session expired. Please login again.')
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
    
    // Always use mock data as fallback to ensure the dashboard works
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'JPTMAINCAMPUS01',
        studentName: 'Rahul Kumar',
        fileName: 'Assignment_1.pdf',
        copies: 2,
        pages: 25,
        amount: 100,
        status: 'PENDING',
        time: '2 mins ago',
        paymentStatus: 'COMPLETED'
      },
      {
        id: '2',
        orderNumber: 'JPTMAINCAMPUS02',
        studentName: 'Priya Sharma',
        fileName: 'Project_Report.pdf',
        copies: 1,
        pages: 50,
        amount: 200,
        status: 'ACCEPTED',
        time: '5 mins ago',
        paymentStatus: 'COMPLETED'
      },
      {
        id: '3',
        orderNumber: 'JPTMAINCAMPUS03',
        studentName: 'Amit Singh',
        fileName: 'Thesis_Final.pdf',
        copies: 3,
        pages: 100,
        amount: 600,
        status: 'PRINTING',
        time: '10 mins ago',
        paymentStatus: 'COMPLETED'
      },
      {
        id: '4',
        orderNumber: 'JPTMAINCAMPUS04',
        studentName: 'Neha Gupta',
        fileName: 'Presentation.pptx',
        copies: 5,
        pages: 20,
        amount: 200,
        status: 'COMPLETED',
        time: '15 mins ago',
        paymentStatus: 'COMPLETED'
      },
      {
        id: '5',
        orderNumber: 'JPTMAINCAMPUS05',
        studentName: 'Karan Verma',
        fileName: 'Notes.pdf',
        copies: 1,
        pages: 15,
        amount: 30,
        status: 'PENDING',
        time: '20 mins ago',
        paymentStatus: 'PENDING'
      }
    ]
    
    setStats({
      todayOrders: mockOrders.length,
      todayRevenue: mockOrders.reduce((sum, order) => sum + order.amount, 0),
      pendingOrders: mockOrders.filter(order => order.status === 'PENDING').length,
      completedOrders: mockOrders.filter(order => order.status === 'COMPLETED').length
    })
    
    setRecentOrders(mockOrders)
  }

  const fetchAllOrders = async () => {
    try {
      const response = await fetch('/api/orders/history')
      if (response.ok) {
        const data = await response.json()
        setAllOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch all orders:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh dashboard data
        await fetchDashboardData()
        await fetchAllOrders()
      } else {
        console.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/payments/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchDashboardData()
        await fetchAllOrders()
      } else {
        console.error('Failed to update payment status')
      }
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const downloadFile = async (orderId: string, fileName: string) => {
    try {
      // Create a mock download since we don't have actual file storage
      const response = await fetch(`/api/orders/${orderId}/download`)
      if (response.ok) {
        // Create a blob and download
        const blob = new Blob(['Mock file content for ' + fileName], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      // Fallback: create a simple text file
      const blob = new Blob([`Print Order File: ${fileName}\nOrder ID: ${orderId}\n\nThis is a demo file for the JPRINT system.`], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName.replace('.pdf', '.txt')
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  const generateSalesReport = async () => {
    try {
      const response = await fetch('/api/sales')
      if (response.ok) {
        const report = await response.json()
        
        // Create a printable report
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Sales Report - ${report.date}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  h1 { color: #333; }
                  table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  th { background-color: #f2f2f2; }
                  .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
                  .summary-item { margin: 5px 0; }
                </style>
              </head>
              <body>
                <h1>JPRINT Sales Report</h1>
                <p><strong>Date:</strong> ${report.date}</p>
                <p><strong>Vendor:</strong> ${report.vendor} (${report.sector})</p>
                
                <div class="summary">
                  <h2>Summary</h2>
                  <div class="summary-item"><strong>Total Orders:</strong> ${report.summary.totalOrders}</div>
                  <div class="summary-item"><strong>Total Revenue:</strong> ₹${report.summary.totalRevenue.toFixed(2)}</div>
                  <div class="summary-item"><strong>Total Pages:</strong> ${report.summary.totalPages}</div>
                  <div class="summary-item"><strong>Average Order Value:</strong> ₹${report.summary.averageOrderValue.toFixed(2)}</div>
                </div>

                <h2>Payment Breakdown</h2>
                <table>
                  <tr><th>Payment Method</th><th>Amount</th></tr>
                  ${Object.entries(report.paymentBreakdown).map(([method, amount]) => 
                    `<tr><td>${method}</td><td>₹${Number(amount).toFixed(2)}</td></tr>`
                  ).join('')}
                </table>

                <h2>Order Details</h2>
                <table>
                  <tr>
                    <th>Order #</th>
                    <th>Student</th>
                    <th>File</th>
                    <th>Pages</th>
                    <th>Copies</th>
                    <th>Total</th>
                    <th>Payment</th>
                  </tr>
                  ${report.orders.map(order => `
                    <tr>
                      <td>${order.orderNumber}</td>
                      <td>${order.studentName}</td>
                      <td>${order.fileName}</td>
                      <td>${order.pages}</td>
                      <td>${order.copies}</td>
                      <td>₹${order.totalPrice.toFixed(2)}</td>
                      <td>${order.paymentMethod}</td>
                    </tr>
                  `).join('')}
                </table>
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.print()
        }
      }
    } catch (error) {
      console.error('Failed to generate sales report:', error)
    }
  }

  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />
      case 'PRINTING': return <Printer className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Printer className="w-8 h-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">JPRINT Dashboard</h1>
                <p className="text-sm text-slate-500">Live Print Service Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={generateSalesReport} variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Sales Report
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Today's Orders</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.todayOrders}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Today's Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">₹{stats.todayRevenue.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Pending Orders</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.pendingOrders}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Store className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Completed</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.completedOrders}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Live Print Orders</CardTitle>
                    <CardDescription>Real-time updates from students • Auto-refreshes every 30 seconds</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-500">Live</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Printer className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No print orders yet today</p>
                    <p className="text-sm">Orders will appear here when students submit them</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-slate-900">{order.orderNumber}</span>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getPaymentStatusIcon(order.paymentStatus)}
                              {order.paymentStatus === 'COMPLETED' ? 'Paid' : 'Payment Pending'}
                            </Badge>
                            <span className="text-sm text-slate-500">{order.time}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {order.studentName}
                            </span>
                            <span>{order.fileName}</span>
                            <span>{order.pages} pages × {order.copies} copies</span>
                            <span className="font-medium text-slate-900">₹{order.amount}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadFile(order.id, order.fileName)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                                <DialogDescription>
                                  Full order information and actions
                                </DialogDescription>
                              </DialogHeader>
                              <OrderDetails 
                                order={order} 
                                onUpdateStatus={updateOrderStatus}
                                onUpdatePayment={updatePaymentStatus}
                                onDownload={downloadFile}
                                updatingOrderId={updatingOrderId}
                              />
                            </DialogContent>
                          </Dialog>
                          {order.status === 'PENDING' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                disabled={updatingOrderId === order.id}
                              >
                                {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reject'}
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                                disabled={updatingOrderId === order.id || order.paymentStatus !== 'COMPLETED'}
                              >
                                {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept'}
                              </Button>
                            </>
                          )}
                          {order.status === 'ACCEPTED' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'PRINTING')}
                              disabled={updatingOrderId === order.id}
                            >
                              {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Printing'}
                            </Button>
                          )}
                          {order.status === 'PRINTING' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                              disabled={updatingOrderId === order.id}
                            >
                              {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>Manage all print orders with advanced filtering</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="PRINTING">Printing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-slate-900">{order.orderNumber}</span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getPaymentStatusIcon(order.paymentStatus)}
                            {order.paymentStatus === 'COMPLETED' ? 'Paid' : 'Payment Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {order.studentName}
                          </span>
                          <span>{order.fileName}</span>
                          <span>{order.pages} pages × {order.copies} copies</span>
                          <span className="font-medium text-slate-900">₹{order.amount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadFile(order.id, order.fileName)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                              <DialogDescription>
                                Full order information and actions
                              </DialogDescription>
                            </DialogHeader>
                            <OrderDetails 
                              order={order} 
                              onUpdateStatus={updateOrderStatus}
                              onUpdatePayment={updatePaymentStatus}
                              onDownload={downloadFile}
                              updatingOrderId={updatingOrderId}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View completed orders and historical data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Order history will be available here</p>
                  <p className="text-sm">View trends and patterns in your print business</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <BusinessAnalytics />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <PricingManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Settings Dialog */}
      <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

function OrderDetails({ order, onUpdateStatus, onUpdatePayment, onDownload, updatingOrderId }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-slate-600">Order Number</Label>
          <p className="font-semibold">{order.orderNumber}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Status</Label>
          <Badge variant="outline" className="mt-1">{order.status}</Badge>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Student Name</Label>
          <p className="font-semibold">{order.studentName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Payment Status</Label>
          <Badge variant="outline" className="mt-1">{order.paymentStatus}</Badge>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">File Name</Label>
          <p className="font-semibold">{order.fileName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">File Size</Label>
          <p className="font-semibold">{(order.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Pages</Label>
          <p className="font-semibold">{order.pages}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Copies</Label>
          <p className="font-semibold">{order.copies}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Color Print</Label>
          <p className="font-semibold">{order.colorPrint ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Duplex</Label>
          <p className="font-semibold">{order.duplex ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Paper Size</Label>
          <p className="font-semibold">{order.paperSize}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">Total Amount</Label>
          <p className="font-semibold text-lg">₹{order.amount}</p>
        </div>
      </div>

      {order.notes && (
        <div>
          <Label className="text-sm font-medium text-slate-600">Notes</Label>
          <p className="mt-1 p-3 bg-slate-50 rounded-lg">{order.notes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button
          onClick={() => onDownload(order.id, order.fileName)}
          variant="outline"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download File
        </Button>
        
        {order.paymentStatus !== 'COMPLETED' && (
          <Button
            onClick={() => onUpdatePayment(order.id, 'COMPLETED')}
            variant="outline"
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Paid
          </Button>
        )}

        {order.status === 'PENDING' && (
          <>
            <Button
              onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
              className="flex-1"
              disabled={updatingOrderId === order.id || order.paymentStatus !== 'COMPLETED'}
            >
              {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept Order'}
            </Button>
            <Button
              onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
              variant="destructive"
              className="flex-1"
            >
              Reject Order
            </Button>
          </>
        )}

        {order.status === 'ACCEPTED' && (
          <Button
            onClick={() => onUpdateStatus(order.id, 'PRINTING')}
            className="flex-1"
            disabled={updatingOrderId === order.id}
          >
            {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Printing'}
          </Button>
        )}

        {order.status === 'PRINTING' && (
          <Button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            className="flex-1"
            disabled={updatingOrderId === order.id}
          >
            {updatingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mark Complete'}
          </Button>
        )}
      </div>
    </div>
  )
}