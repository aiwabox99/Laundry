#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Cleanic Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  fs.copyFileSync(path.join(__dirname, '.env.example'), envPath);
  console.log('✅ .env file created. Please update it with your configuration.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Dependencies installed successfully.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check MongoDB connection
console.log('🔍 Checking MongoDB connection...');
try {
  const mongoose = require('mongoose');
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cleanic_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log('✅ MongoDB connection successful.\n');
  mongoose.connection.close();
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
  console.log('💡 Please ensure MongoDB is running and the connection string is correct.\n');
}

// Seed database
console.log('🌱 Would you like to seed the database with sample data? (y/n)');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('🌱 Seeding database...');
    try {
      execSync('npm run seed', { stdio: 'inherit', cwd: __dirname });
      console.log('✅ Database seeded successfully.\n');
    } catch (error) {
      console.error('❌ Failed to seed database:', error.message);
    }
  }
  
  console.log('🎉 Setup complete! You can now start the server with:');
  console.log('   npm run dev (development)');
  console.log('   npm start (production)\n');
  
  console.log('📚 API Documentation:');
  console.log('   Health Check: GET /health');
  console.log('   Authentication: POST /api/auth/register, /api/auth/login');
  console.log('   Services: GET /api/services');
  console.log('   Staff: GET /api/staff');
  console.log('   Orders: GET /api/orders (requires auth)');
  console.log('   Full API documentation available at: http://localhost:5000\n');
  
  console.log('🔧 Configuration:');
  console.log('   - Update .env file with your credentials');
  console.log('   - Configure Twilio for SMS (optional)');
  console.log('   - Configure email service (optional)');
  console.log('   - Set up MongoDB database\n');
  
  rl.close();
});