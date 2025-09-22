# Vehicle Sales Management System

A full-stack web application for managing vehicle sales with AI-powered description generation, built with React, Node.js, TypeScript, and MySQL.

Demo Link: https://automart-front.vercel.app/[https://automart-front.vercel.app/]

## 🌟 Features

### 🔐 Authentication & Authorization

- **User Registration & Login**: Secure JWT-based authentication
- **Role-based Access Control**: Admin and Consumer roles with different permissions
- **Protected Routes**: Admin-only access to management features

### 🚙 Vehicle Management (Admin Features)

- **Complete CRUD Operations**: Create, read, update, and delete vehicles
- **Image Upload**: Multi-image upload with Cloudinary integration (up to 10 images per vehicle)
- **AI-Powered Descriptions**: Generate vehicle descriptions using Gemini AI or OpenAI
- **Rich Dashboard**: Statistics and analytics overview
- **Advanced Filtering**: Filter by type, brand, price range, etc.
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion animations

### 🛒 Consumer Features

- **Public Vehicle Browsing**: View all available vehicles without authentication
- **Vehicle Search & Filter**: Find vehicles by type, brand, price range
- **Detailed Vehicle Views**: View vehicle specifications, images, and descriptions
- **Responsive Mobile Interface**: Optimized for all device sizes

### 🤖 AI Integration

- **Gemini AI Integration**: Primary AI service for generating vehicle descriptions
- **OpenAI Integration**: Alternative AI service (requires API key)
- **Flexible AI Service Selection**: Switch between AI providers via environment configuration

### 🗄️ Database & Storage

- **MySQL Database**: Robust relational database with TypeORM
- **Cloudinary Integration**: Cloud-based image storage and optimization
- **Database Seeding**: Automated admin user creation

## 🛠️ Technology Stack

### Backend

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **TypeORM** - Database ORM
- **MySQL** - Primary database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Swagger** - API documentation
- **Helmet** - Security middleware

### Frontend

- **React 19** with **TypeScript**
- **Vite** - Build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Toastify** - Notifications

### External Services

- **Cloudinary** - Image storage and management
- **Google Gemini AI** - Primary AI description generation
- **OpenAI** - Alternative AI service

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd back
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   - Copy `example.env` to `.env`
   - Configure the following environment variables:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=automart

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=24h

   # AI Service Configuration
   AI_SERVICE=gemini  # Options: openai, gemini

   # Gemini Configuration (Primary)
   GEMINI_API_KEY=your_gemini_api_key_here

   # OpenAI Configuration (Alternative)
   OPENAI_API_KEY=your_openai_api_key_here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Database Setup**

   - Create MySQL database named `automart`
   - The application will automatically create tables on first run

5. **Seed Admin User**

   ```bash
   npm run seed:admin
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd front
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint             | Description       | Access    |
| ------ | -------------------- | ----------------- | --------- |
| POST   | `/api/auth/login`    | User login        | Public    |
| POST   | `/api/auth/register` | User registration | Public    |
| GET    | `/api/auth/profile`  | Get user profile  | Protected |

### Vehicle Endpoints

| Method | Endpoint                             | Description                                  | Access |
| ------ | ------------------------------------ | -------------------------------------------- | ------ |
| GET    | `/api/vehicles`                      | Get all vehicles (with pagination & filters) | Public |
| GET    | `/api/vehicles/:id`                  | Get vehicle by ID                            | Public |
| POST   | `/api/vehicles`                      | Create new vehicle (with image upload)       | Admin  |
| PUT    | `/api/vehicles/:id`                  | Update vehicle                               | Admin  |
| DELETE | `/api/vehicles/:id`                  | Delete vehicle                               | Admin  |
| POST   | `/api/vehicles/generate-description` | Generate AI description                      | Public |

### Utility Endpoints

| Method | Endpoint    | Description               | Access |
| ------ | ----------- | ------------------------- | ------ |
| GET    | `/health`   | Health check              | Public |
| GET    | `/api-docs` | Swagger API documentation | Public |

## 🔧 Assumptions & Limitations

### AI Service Configuration

- **Primary AI Service**: The application uses **Gemini AI** as the primary service since OpenAI API keys are not readily available
- **API Key Flexibility**: You can switch between Gemini and OpenAI by changing the `AI_SERVICE` value in the `.env` file
- **Service Fallback**: If no AI service is properly configured, the description generation feature will be unavailable but other features remain functional

### Technical Limitations

- **Image Upload**: Maximum 10 images per vehicle, 5MB per image
- **File Types**: Only image files (JPEG, PNG, WebP, etc.) are supported for uploads
- **Database**: Currently configured for MySQL only
- **Authentication**: JWT tokens expire after 24 hours (configurable)
- **Pagination**: Default limit of 10 vehicles per page in API responses

### Business Assumptions

- **Admin Role**: Only admin users can manage vehicles (CRUD operations)
- **Public Access**: Vehicle browsing and viewing are publicly accessible
- **Single Tenancy**: Designed for single organization use
- **Vehicle Types**: Limited to predefined types (Car, Bike, SUV, Truck, Van, Electric, Hybrid)

### Infrastructure Assumptions

- **Image Storage**: Requires Cloudinary account for image management
- **Database**: Requires MySQL server (local or cloud)
- **AI Services**: Requires API keys for Gemini or OpenAI services

## 🎯 Usage

### Admin Workflow

1. Login with admin credentials
2. Access admin dashboard at `/admin`
3. Manage vehicles through the intuitive interface
4. Use AI-powered description generation
5. Upload multiple images per vehicle
6. Monitor statistics and analytics

### Consumer Workflow

1. Browse vehicles on the homepage
2. Use filters to find specific vehicles
3. View detailed vehicle information
4. No authentication required for browsing

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds for password security
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet Integration**: Security headers for Express.js
- **File Upload Validation**: Strict file type and size validation
- **Role-based Access**: Admin-only access to sensitive operations

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- **Desktop**: Full-featured admin interface
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly consumer interface

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in backend environment
2. Build the frontend: `npm run build`
3. Serve frontend static files through your web server
4. Configure production database and AI service credentials
5. Set up SSL certificates for HTTPS
6. Configure environment variables for production services
