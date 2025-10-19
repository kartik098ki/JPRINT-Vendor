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
    
    // Get all orders for this vendor (not just today's)
    const orders = await db.printOrder.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        student: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 orders
    })

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      studentName: order.student.name,
      fileName: order.fileName,
      fileSize: order.fileSize,
      copies: order.copies,
      pages: order.pageCount,
      amount: order.totalPrice,
      status: order.status,
      paymentStatus: order.payment?.status || 'PENDING',
      colorPrint: order.colorPrint,
      duplex: order.duplex,
      paperSize: order.paperSize,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    return NextResponse.json({
      orders: formattedOrders
    })
  } catch (error) {
    console.error('Orders history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}