# Kadir Geçit - Portfolio Website

A modern, animated portfolio website showcasing 8+ years of freelance software development experience. Built with Vue.js, Vite, and featuring award-winning design elements with smooth 3D animations.

## 🚀 Features

- **Modern Design**: Award-winning design inspired by top portfolio websites
- **3D Animations**: Smooth GSAP animations and Three.js 3D effects
- **Responsive**: Fully responsive design that works on all devices
- **Admin Panel**: Complete CMS for managing projects and contact messages
- **Database Integration**: NeonDB PostgreSQL with Prisma ORM
- **Contact Form**: Functional contact form with email notifications
- **Performance Optimized**: Fast loading with Vite build system

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **GSAP** - Professional animation library
- **Three.js** - 3D graphics and animations
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database (NeonDB)
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🎨 Design Features

- Smooth scroll animations
- Interactive 3D elements
- Particle systems
- Gradient backgrounds
- Glass morphism effects
- Responsive typography
- Mobile-first design

## 📱 Pages

- **Home**: Hero section with 3D animations
- **About**: Professional background and skills
- **Projects**: Portfolio showcase with filtering
- **Contact**: Contact form with validation
- **Admin Panel**: Project and message management

## 🔧 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (NeonDB recommended)

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/kadirgecit/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Seed admin user
npm run seed

# Start server
npm run dev
```

### Environment Variables
Create a `.env` file in the server directory:
```env
DATABASE_URL="your_neondb_connection_string"
JWT_SECRET="your_jwt_secret"
ADMIN_EMAIL="admin@kadirgecit.com"
ADMIN_PASSWORD="admin123"
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment with serverless functions.

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**:
   - `DATABASE_URL`: Your NeonDB PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `ADMIN_EMAIL`: Admin email
   - `ADMIN_PASSWORD`: Admin password

3. **Features included**:
   - Automatic Prisma client generation
   - Serverless API functions in `/api` directory
   - Optimized build with code splitting
   - SPA routing configuration
   - Asset caching headers

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider
3. **Set up API endpoints** using the `/api` directory structure

## 📊 Admin Panel

Access the admin panel at `/admin/login` with:
- **Email**: admin@kadirgecit.com
- **Password**: admin123

### Admin Features
- Dashboard with statistics
- Project management (CRUD operations)
- Contact message management
- User authentication
- Responsive admin interface

## 🎯 Project Structure

```
portfolio/
├── src/
│   ├── components/     # Vue components
│   ├── views/         # Page components
│   ├── services/      # API services
│   ├── assets/        # Static assets
│   └── router/        # Vue Router config
├── server/
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   ├── prisma/        # Database schema
│   └── utils/         # Utility functions
└── public/            # Public assets
```

## 🌟 Key Features

### 3D Animations
- Interactive particle systems
- Smooth scroll-triggered animations
- 3D model integration
- Performance-optimized rendering

### Admin System
- JWT-based authentication
- Role-based access control
- CRUD operations for projects
- Contact form management
- Real-time statistics

### Database Schema
- Users (admin authentication)
- Projects (portfolio items)
- Contacts (form submissions)
- Optimized queries with Prisma

## 📈 Performance

- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About

Created by **Kadir Geçit** - Senior Software Developer with 8+ years of freelance experience.

- 🌐 Website: [kadirgecit.com](https://kadirgecit.com)
- 💼 LinkedIn: [linkedin.com/in/kadirgecit](https://linkedin.com/in/kadirgecit)
- 📧 Email: gecit.kadir@icloud.com
- 🐙 GitHub: [github.com/kadirgecit](https://github.com/kadirgecit)

## 🙏 Acknowledgments

- Design inspiration from Awwwards winning websites
- Three.js community for 3D graphics resources
- Vue.js team for the amazing framework
- GSAP for professional animations
