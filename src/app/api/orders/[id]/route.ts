import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get vendor from session
    const session = request.cookies.get('vendor-session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vendor = JSON.parse(session.value)
    const { status } = await request.json()

    if (!['ACCEPTED', 'PRINTING', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update order status
    const order = await db.printOrder.update({
      where: {
        id: params.id,
        vendorId: vendor.id // Ensure vendor can only update their own orders
      },
      data: {
        status
      },
      include: {
        student: true,
        payment: true
      }
    })

    // If order is completed, create a sale record
    if (status === 'COMPLETED' && order.payment?.status === 'COMPLETED') {
      await db.sale.create({
        data: {
          vendorId: vendor.id,
          totalOrders: 1,
          totalRevenue: order.totalPrice,
          status: 'COMPLETED'
        }
      })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        studentName: order.student.name,
        fileName: order.fileName,
        copies: order.copies,
        pages: order.pageCount,
        amount: order.totalPrice,
        paymentStatus: order.payment?.status || 'PENDING'
      }
    })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}