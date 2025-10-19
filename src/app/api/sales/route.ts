import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get vendor from session
    const session = request.cookies.get('vendor-session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vendor = JSON.parse(session.value)
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // Get sales for the specified date
    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)

    // Get completed orders for the day
    const completedOrders = await db.printOrder.findMany({
      where: {
        vendorId: vendor.id,
        status: 'COMPLETED',
        updatedAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      include: {
        student: true,
        payment: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Calculate totals
    const totalOrders = completedOrders.length
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalPages = completedOrders.reduce((sum, order) => sum + (order.pageCount * order.copies), 0)

    // Group by payment method
    const paymentBreakdown = completedOrders.reduce((acc, order) => {
      const method = order.payment?.method || 'CASH'
      acc[method] = (acc[method] || 0) + order.totalPrice
      return acc
    }, {} as Record<string, number>)

    // Format orders for report
    const orderDetails = completedOrders.map(order => ({
      orderNumber: order.orderNumber,
      studentName: order.student.name,
      fileName: order.fileName,
      pages: order.pageCount,
      copies: order.copies,
      totalPrice: order.totalPrice,
      paymentMethod: order.payment?.method || 'CASH',
      completedAt: order.updatedAt
    }))

    const report = {
      date,
      vendor: vendor.name,
      sector: vendor.sector,
      summary: {
        totalOrders,
        totalRevenue,
        totalPages,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      paymentBreakdown,
      orders: orderDetails
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Sales report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}