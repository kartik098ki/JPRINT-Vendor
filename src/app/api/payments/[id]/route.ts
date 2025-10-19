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

    if (!['COMPLETED', 'PENDING', 'FAILED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    // Get the order first to find the payment
    const order = await db.printOrder.findFirst({
      where: {
        id: params.id,
        vendorId: vendor.id // Ensure vendor can only update their own orders
      },
      include: {
        payment: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: {
        id: order.payment.id
      },
      data: {
        status,
        paidAt: status === 'COMPLETED' ? new Date() : null
      }
    })

    return NextResponse.json({
      success: true,
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        paidAt: updatedPayment.paidAt
      }
    })
  } catch (error) {
    console.error('Payment update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}