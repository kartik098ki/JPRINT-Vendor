import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API called')
    
    // Get vendor from session
    const session = request.cookies.get('vendor-session')
    console.log('Session cookie found:', !!session)
    
    if (!session) {
      console.log('No session cookie found')
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 })
    }

    let vendor
    try {
      vendor = JSON.parse(session.value)
      console.log('Session parsed for vendor:', vendor.name, 'Sector:', vendor.sector)
    } catch (e) {
      console.error('Failed to parse session:', e)
      return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 })
    }
    
    // Get today's date range
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    console.log('Fetching orders for vendor ID:', vendor.id)

    // Get today's orders for this vendor
    const todayOrders = await db.printOrder.findMany({
      where: {
        vendorId: vendor.id,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      include: {
        student: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Found orders:', todayOrders.length)

    // Calculate stats
    const totalOrders = todayOrders.length
    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const pendingOrders = todayOrders.filter(order => order.status === 'PENDING').length
    const completedOrders = todayOrders.filter(order => order.status === 'COMPLETED').length

    // Get recent orders (last 10)
    const recentOrders = todayOrders.slice(0, 10).map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      studentName: order.student.name,
      fileName: order.fileName,
      copies: order.copies,
      pages: order.pageCount,
      amount: order.totalPrice,
      status: order.status,
      time: formatTimeAgo(order.createdAt),
      paymentStatus: order.payment?.status || 'PENDING'
    }))

    const response = {
      stats: {
        todayOrders: totalOrders,
        todayRevenue: totalRevenue,
        pendingOrders,
        completedOrders
      },
      recentOrders
    }

    console.log('Dashboard response prepared:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} days ago`
}