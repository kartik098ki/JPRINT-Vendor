import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

async function main() {
  console.log('Seeding database...')

  // Create sample vendors
  const vendors = [
    {
      name: 'Rajesh Print Shop',
      email: 'rajesh@sec128.jprint.com',
      password: 'password123',
      sector: 'SEC-128'
    },
    {
      name: 'Meera Print Services',
      email: 'meera@sec62.jprint.com', 
      password: 'password123',
      sector: 'SEC-62'
    },
    {
      name: 'Amit Print Center',
      email: 'amit@main.jprint.com',
      password: 'password123',
      sector: 'MAIN-CAMPUS'
    }
  ]

  for (let i = 0; i < vendors.length; i++) {
    const vendorData = vendors[i]
    const hashedPassword = await hashPassword(vendorData.password)
    
    try {
      const vendor = await db.vendor.create({
        data: {
          ...vendorData,
          password: hashedPassword,
        },
      })
      console.log(`Created vendor: ${vendor.name} (${vendor.sector})`)

      // Create unique students for each vendor
      const studentSuffix = i + 1
      const students = await Promise.all([
        db.student.upsert({
          where: { email: `rahul${studentSuffix}@student.edu` },
          update: {},
          create: {
            name: 'Rahul Kumar',
            email: `rahul${studentSuffix}@student.edu`,
            phone: '+91 98765 43210',
            rollNumber: `CS202100${studentSuffix}`,
            department: 'Computer Science'
          }
        }),
        db.student.upsert({
          where: { email: `priya${studentSuffix}@student.edu` },
          update: {},
          create: {
            name: 'Priya Sharma',
            email: `priya${studentSuffix}@student.edu`,
            phone: '+91 98765 43211',
            rollNumber: `EC202100${studentSuffix}`,
            department: 'Electronics'
          }
        }),
        db.student.upsert({
          where: { email: `amit${studentSuffix}@student.edu` },
          update: {},
          create: {
            name: 'Amit Singh',
            email: `amit${studentSuffix}@student.edu`,
            phone: '+91 98765 43212',
            rollNumber: `ME202100${studentSuffix}`,
            department: 'Mechanical'
          }
        })
      ])

      // Create sample print orders
      for (let j = 0; j < 3; j++) {
        const orderNumber = `JPT${vendor.sector.replace('-', '')}${String(j + 1).padStart(2, '0')}`
        const order = await db.printOrder.create({
          data: {
            orderNumber,
            studentId: students[j].id,
            vendorId: vendor.id,
            fileName: `assignment_${j + 1}_${Date.now()}.pdf`,
            originalFileName: `Assignment_${j + 1}.pdf`,
            fileSize: 2048576, // 2MB
            fileUrl: `https://example.com/files/${orderNumber}.pdf`, // Mock file URL
            pageCount: 10 + j * 5,
            copies: 1 + j,
            colorPrint: j % 2 === 0,
            duplex: true,
            paperSize: 'A4',
            totalPrice: (10 + j * 5) * (1 + j) * 2, // Simple pricing calculation
            status: ['PENDING', 'ACCEPTED', 'PRINTING'][j] as any,
            priority: j === 2 ? 'HIGH' : 'NORMAL',
            notes: j === 0 ? 'Please print on both sides' : undefined,
            dueDate: new Date(Date.now() + (j + 1) * 24 * 60 * 60 * 1000) // Due in 1-3 days
          }
        })

        // Create payment for the order
        await db.payment.create({
          data: {
            printOrderId: order.id,
            studentId: students[j].id,
            amount: order.totalPrice,
            method: ['UPI', 'CASH', 'CARD'][j] as any,
            transactionId: `TXN${Date.now()}${i}${j}`,
            status: 'COMPLETED',
            paidAt: new Date()
          }
        })

        console.log(`Created sample order: ${orderNumber}`)
      }
    } catch (error) {
      console.log(`Vendor ${vendorData.email} already exists, skipping...`)
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })