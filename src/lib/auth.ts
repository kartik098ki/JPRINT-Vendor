import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  console.log('Verifying password, input length:', password.length)
  console.log('Hashed password length:', hashedPassword.length)
  const result = await bcrypt.compare(password, hashedPassword)
  console.log('Bcrypt comparison result:', result)
  return result
}

export async function createVendor(data: {
  name: string
  email: string
  password: string
  sector: string
}) {
  const hashedPassword = await hashPassword(data.password)
  
  return db.vendor.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  })
}

export async function authenticateVendor(email: string, password: string) {
  console.log('Authenticating vendor:', email)
  const vendor = await db.vendor.findUnique({
    where: { email },
  })

  console.log('Vendor found:', !!vendor)
  if (vendor) {
    console.log('Vendor active:', vendor.isActive)
    console.log('Vendor name:', vendor.name)
  }

  if (!vendor || !vendor.isActive) {
    console.log('Authentication failed: Vendor not found or inactive')
    return null
  }

  const isValid = await verifyPassword(password, vendor.password)
  console.log('Password valid:', isValid)
  
  if (!isValid) {
    console.log('Authentication failed: Invalid password')
    return null
  }

  const result = {
    id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    sector: vendor.sector,
  }
  console.log('Authentication successful for:', result.name)
  return result
}

export async function getVendorById(id: string) {
  return db.vendor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      sector: true,
      isActive: true,
      createdAt: true,
    },
  })
}