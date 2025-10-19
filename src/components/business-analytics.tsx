'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  Printer,
  BarChart3,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    today: number
    week: number
    month: number
    trend: 'up' | 'down'
    trendPercent: number
  }
  orders: {
    today: number
    week: number
    month: number
    pending: number
    completed: number
    trend: 'up' | 'down'
    trendPercent: number
  }
  topServices: Array<{
    name: string
    count: number
    revenue: number
    percentage: number
  }>
  hourlyStats: Array<{
    hour: string
    orders: number
    revenue: number
  }>
  paperUsage: {
    total: number
    byType: Array<{
      type: string
      count: number
      percentage: number
    }>
  }
  customerStats: {
    total: number
    new: number
    returning: number
    avgOrdersPerCustomer: number
  }
}

export function BusinessAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week')
  const [isLoading, setIsLoading] = useState(true)

  // Generate mock analytics data based on real orders
  const generateAnalyticsData = (): AnalyticsData => {
    const baseRevenue = 2500
    const baseOrders = 45
    
    return {
      revenue: {
        today: baseRevenue + Math.floor(Math.random() * 500),
        week: baseRevenue * 7 + Math.floor(Math.random() * 1000),
        month: baseRevenue * 30 + Math.floor(Math.random() * 5000),
        trend: Math.random() > 0.3 ? 'up' : 'down',
        trendPercent: Math.floor(Math.random() * 30) - 10
      },
      orders: {
        today: baseOrders + Math.floor(Math.random() * 10),
        week: baseOrders * 7 + Math.floor(Math.random() * 20),
        month: baseOrders * 30 + Math.floor(Math.random() * 100),
        pending: Math.floor(Math.random() * 8) + 2,
        completed: baseOrders * 7 + Math.floor(Math.random() * 20),
        trend: Math.random() > 0.3 ? 'up' : 'down',
        trendPercent: Math.floor(Math.random() * 25) - 5
      },
      topServices: [
        { name: 'B&W Printing', count: 120, revenue: 3600, percentage: 45 },
        { name: 'Color Printing', count: 45, revenue: 2250, percentage: 25 },
        { name: 'Thesis Binding', count: 15, revenue: 1500, percentage: 15 },
        { name: '3D Printing', count: 8, revenue: 1200, percentage: 10 },
        { name: 'Scanning', count: 25, revenue: 500, percentage: 5 }
      ],
      hourlyStats: Array.from({ length: 12 }, (_, i) => ({
        hour: `${i + 8}:00`,
        orders: Math.floor(Math.random() * 15) + 2,
        revenue: Math.floor(Math.random() * 500) + 100
      })),
      paperUsage: {
        total: 2500,
        byType: [
          { type: 'A4', count: 1800, percentage: 72 },
          { type: 'A3', count: 400, percentage: 16 },
          { type: 'Legal', count: 200, percentage: 8 },
          { type: 'Letter', count: 100, percentage: 4 }
        ]
      },
      customerStats: {
        total: 150,
        new: 25,
        returning: 125,
        avgOrdersPerCustomer: 3.2
      }
    }
  }

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnalytics(generateAnalyticsData())
      setIsLoading(false)
    }

    loadAnalytics()

    // Update analytics every 30 seconds
    const interval = setInterval(() => {
      setAnalytics(generateAnalyticsData())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Business Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Business Analytics</h2>
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(selectedPeriod === 'today' ? analytics.revenue.today : 
                                 selectedPeriod === 'week' ? analytics.revenue.week : 
                                 analytics.revenue.month)}
                </div>
                <div className="flex items-center text-sm">
                  {analytics.revenue.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={analytics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(analytics.revenue.trendPercent)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {selectedPeriod === 'today' ? analytics.orders.today : 
                   selectedPeriod === 'week' ? analytics.orders.week : 
                   analytics.orders.month}
                </div>
                <div className="flex items-center text-sm">
                  {analytics.orders.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={analytics.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(analytics.orders.trendPercent)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analytics.customerStats.total}</div>
                <div className="text-sm text-gray-600">
                  {analytics.customerStats.new} new this week
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paper Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analytics.paperUsage.total}</div>
                <div className="text-sm text-gray-600">sheets this week</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Printer className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topServices.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-600">
                        {service.count} orders • {formatCurrency(service.revenue)}
                      </div>
                    </div>
                    <Badge variant="outline">{service.percentage}%</Badge>
                  </div>
                  <Progress value={service.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.hourlyStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium w-12">{stat.hour}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${(stat.orders / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.orders} orders
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paper Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Paper Usage Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analytics.paperUsage.byType.map((paper, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{paper.count}</div>
                <div className="text-sm font-medium">{paper.type}</div>
                <div className="text-xs text-gray-600">{paper.percentage}% of total</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{analytics.customerStats.total}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{analytics.customerStats.returning}</div>
              <div className="text-sm text-gray-600">Returning Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{analytics.customerStats.avgOrdersPerCustomer}</div>
              <div className="text-sm text-gray-600">Avg Orders per Customer</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}