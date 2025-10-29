# JPRINT Vendor Dashboard

A comprehensive print service management system for college vendors, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🎯 Core Functionality
- **Sector-based Authentication**: Secure login system for different college sectors (SEC-128, SEC-62, etc.)
- **Live Order Tracking**: Real-time updates on print orders from students
- **Payment Management**: Track payment status and methods (UPI, Cash, Card, Online)
- **Order Management**: Accept, reject, and process print orders with status updates
- **Sales Reporting**: Generate and print daily sales reports with detailed breakdowns

### 📊 Dashboard Features
- **Today's Statistics**: Live metrics for orders, revenue, pending and completed jobs
- **Real-time Updates**: Auto-refreshing dashboard every 30 seconds
- **Order Queue**: Visual status tracking (Pending → Accepted → Printing → Completed)
- **Payment Verification**: Integrated payment status checking
- **Printable Reports**: Professional sales reports with order details

### 🎨 User Experience
- **Responsive Design**: Mobile-friendly interface for all screen sizes
- **Modern UI**: Beautiful, clean interface using shadcn/ui components
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: User-friendly error messages and recovery
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Database**: SQLite with Prisma ORM
- **Authentication**: Custom session-based auth
- **Icons**: Lucide React
- **State Management**: React hooks and server state

## 📋 Database (algorithm)

### Core Models
- **Vendor**: Print shop vendors with sector assignments
- **Student**: Student information and contact details
- **PrintOrder**: Print job details with pricing and specifications
- **Payment**: Payment tracking with multiple payment methods
- **Sale**: Daily sales records and reporting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jprint-vendor-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Login Credentials

After running the seed script, you can use these test accounts:

### SEC-128 Sector
- **Email**: rajesh@sec128.jprint.com
- **Password**: password123

### SEC-62 Sector  
- **Email**: meera@sec62.jprint.com
- **Password**: password123

### Main Campus
- **Email**: amit@main.jprint.com
- **Password**: password123

## 📱 Usage Guide

### For Vendors

1. **Login**: Select your sector and enter credentials
2. **View Dashboard**: Monitor today's orders and revenue
3. **Manage Orders**: 
   - Click "Accept" to confirm paid orders
   - Click "Start Printing" when you begin the job
   - Click "Complete" when the print is ready for pickup
4. **Generate Reports**: Click "Sales Report" to view and print daily summaries

### Order Status Flow
1. **PENDING**: New order awaiting vendor confirmation
2. **ACCEPTED**: Order confirmed, ready for printing
3. **PRINTING**: Currently being printed
4. **COMPLETED**: Print ready for student pickup
5. **CANCELLED**: Order rejected by vendor

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed sample data

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── dashboard/     # Dashboard data
│   │   ├── orders/        # Order management
│   │   └── sales/         # Sales reporting
│   └── page.tsx           # Main application page
├── components/ui/         # shadcn/ui components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   └── db.ts             # Database client
└── prisma/               # Database schema and seeds
```

## 🎨 Design Principles

- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG compliant with semantic HTML
- **Performance**: Optimized loading and smooth interactions
- **Usability**: Intuitive interface for local vendors
- **Consistency**: Unified design language throughout

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in XSS prevention

## 📈 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Mobile app for vendors
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Integration with college student systems
- [ ] Print queue management system
- [ ] Automated notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@jprint.com
- Documentation: [Project Wiki](wiki-link)
- Issues: [GitHub Issues](issues-link)

---

© 2024 JPRINT College Print Service. Built with ❤️ for educational institutions.
