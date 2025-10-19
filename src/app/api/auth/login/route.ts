import { NextRequest, NextResponse } from 'next/server'
import { authenticateVendor } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called')
    const { email, password } = await request.json()
    console.log('Login attempt for email:', email)

    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const vendor = await authenticateVendor(email, password)
    console.log('Authentication result:', vendor ? 'Success' : 'Failed')

    if (!vendor) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session token (in production, use proper JWT)
    const response = NextResponse.json({
      success: true,
      vendor,
    })

    // Set session cookie
    response.cookies.set('vendor-session', JSON.stringify(vendor), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    console.log('Session cookie set for vendor:', vendor.name)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}