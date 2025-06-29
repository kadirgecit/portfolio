const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kadirgecit.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin'
      }
    });

    console.log('Admin user created:', admin.email);
  } catch (error) {
    console.error('Error seeding admin:', error);
    throw error;
  }
};

const seedProjects = async () => {
  try {
    const existingProjects = await prisma.project.count();
    if (existingProjects > 0) {
      console.log('Projects already exist');
      return;
    }

    const projects = [
      {
        title: 'Enterprise Analytics Platform',
        description: 'A comprehensive analytics dashboard for enterprise clients with real-time data visualization and advanced reporting capabilities.',
        category: 'Web Application',
        status: 'Confidential',
        features: [
          'Real-time data processing',
          'Advanced visualization',
          'Multi-tenant architecture',
          'Role-based access control'
        ],
        technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
        order: 1
      },
      {
        title: 'Mobile E-commerce Solution',
        description: 'Cross-platform mobile application for a major retail client with seamless shopping experience and payment integration.',
        category: 'Mobile App',
        status: 'Under NDA',
        features: [
          'Cross-platform compatibility',
          'Secure payment processing',
          'Offline functionality',
          'Push notifications'
        ],
        technologies: ['React Native', 'TypeScript', 'AWS', 'Stripe', 'Firebase'],
        order: 2
      },
      {
        title: 'AI-Powered Content Management',
        description: 'Intelligent content management system with AI-driven recommendations and automated workflow optimization.',
        category: 'AI/ML Platform',
        status: 'Confidential',
        features: [
          'AI content recommendations',
          'Automated workflows',
          'Natural language processing',
          'Scalable architecture'
        ],
        technologies: ['Python', 'TensorFlow', 'React', 'MongoDB', 'Kubernetes'],
        order: 3
      },
      {
        title: 'Financial Trading Platform',
        description: 'High-frequency trading platform with real-time market data, advanced charting, and risk management tools.',
        category: 'FinTech',
        status: 'Under NDA',
        features: [
          'Real-time market data',
          'Advanced charting',
          'Risk management',
          'High-frequency trading'
        ],
        technologies: ['Vue.js', 'WebSocket', 'C++', 'Redis', 'PostgreSQL'],
        order: 4
      },
      {
        title: 'Healthcare Management System',
        description: 'Comprehensive healthcare management platform with patient records, appointment scheduling, and telemedicine capabilities.',
        category: 'Healthcare',
        status: 'Confidential',
        features: [
          'Patient record management',
          'Telemedicine integration',
          'Appointment scheduling',
          'HIPAA compliance'
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'WebRTC', 'AWS'],
        order: 5
      },
      {
        title: 'IoT Monitoring Dashboard',
        description: 'Real-time IoT device monitoring and control system for industrial automation with predictive maintenance.',
        category: 'IoT Platform',
        status: 'Under NDA',
        features: [
          'Real-time monitoring',
          'Predictive maintenance',
          'Device control',
          'Data analytics'
        ],
        technologies: ['Vue.js', 'MQTT', 'InfluxDB', 'Grafana', 'Docker'],
        order: 6
      }
    ];

    await prisma.project.createMany({
      data: projects
    });

    console.log('Sample projects created');
  } catch (error) {
    console.error('Error seeding projects:', error);
    throw error;
  }
};

module.exports = { seedAdmin, seedProjects };