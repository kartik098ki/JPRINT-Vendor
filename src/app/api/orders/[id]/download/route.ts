import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get vendor from session
    const session = request.cookies.get('vendor-session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vendor = JSON.parse(session.value)
    
    // Get the order
    const order = await db.printOrder.findFirst({
      where: {
        id: params.id,
        vendorId: vendor.id // Ensure vendor can only download their own orders
      },
      include: {
        student: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Create a mock file content for demonstration
    // In a real implementation, you would fetch the actual file from storage
    const fileContent = `
JPRINT ORDER RECEIPT
===================

Order Number: ${order.orderNumber}
Date: ${order.createdAt.toLocaleDateString()}
Student: ${order.student.name}
File: ${order.fileName}

Order Details:
- Pages: ${order.pageCount}
- Copies: ${order.copies}
- Color Print: ${order.colorPrint ? 'Yes' : 'No'}
- Duplex: ${order.duplex ? 'Yes' : 'No'}
- Paper Size: ${order.paperSize}
- Total Amount: ₹${order.totalPrice}

${order.notes ? `Notes: ${order.notes}` : ''}

This is a demo file for the JPRINT system.
In production, this would be the actual file uploaded by the student.
    `.trim()

    // Create response with file download
    const response = new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${order.fileName.replace('.pdf', '.txt')}"`
      }
    })

    return response
  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}