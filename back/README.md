# Vehicle Sales Management System - Backend

A comprehensive backend API for managing vehicle sales, built with Node.js, Express, TypeScript, and TypeORM.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Vehicle Management**: CRUD operations for vehicles with image upload support
- **AI-Powered Descriptions**: Generate vehicle descriptions using OpenAI or Gemini
- **Image Upload**: Cloudinary integration for vehicle image storage
- **Swagger Documentation**: Interactive API documentation
- **Database**: MySQL with TypeORM for data persistence

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Cloudinary
- **AI Services**: OpenAI GPT & Google Gemini
- **Documentation**: Swagger/OpenAPI

## Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env`
   - Fill in your environment variables

4. **Database Setup**

   ```bash
   npm run seed:admin
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Integration**: Connect your GitHub repository to Vercel

### Environment Variables

Set these environment variables in your Vercel project settings:

#### Database Configuration

```
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name
```

#### JWT Configuration

```
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

#### AI Service Configuration

```
AI_SERVICE=gemini  # or 'openai'
```

#### OpenAI Configuration (if using OpenAI)

```
OPENAI_API_KEY=your-openai-api-key
```

#### Gemini Configuration (if using Gemini)

```
GEMINI_API_KEY=your-gemini-api-key
```

#### Cloudinary Configuration

```
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Deployment Steps

1. **Connect Repository**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**

   - **Framework Preset**: Other
   - **Root Directory**: backend (if your backend is in a subfolder)
   - **Build Command**: npm run build
   - **Output Directory**: dist

3. **Environment Variables**

   - Add all required environment variables in the Vercel dashboard
   - Make sure to set them for both Production and Preview environments

4. **Deploy**
   - Vercel will automatically deploy your application
   - The API will be available at `https://your-project.vercel.app`

### API Endpoints

Once deployed, your API will be available with these endpoints:

- **Health Check**: `GET /health`
- **API Documentation**: `GET /api-docs`
- **Authentication**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- **Vehicles**:
  - `GET /api/vehicles` - List vehicles
  - `POST /api/vehicles` - Create vehicle (requires auth)
  - `GET /api/vehicles/:id` - Get vehicle by ID
  - `PUT /api/vehicles/:id` - Update vehicle (requires auth)
  - `DELETE /api/vehicles/:id` - Delete vehicle (requires auth)
  - `POST /api/vehicles/generate-description` - Generate AI description

## Project Structure

```
src/
├── app.ts                 # Main Express application (local dev)
├── app.vercel.ts          # Vercel-compatible Express app
├── config/
│   ├── database.ts        # Database configuration
│   └── swagger.ts         # Swagger configuration
├── features/
│   ├── auth/              # Authentication module
│   └── vehicles/          # Vehicle management module
├── scripts/
│   └── seedAdmin.ts       # Admin user seeding script
└── shared/
    ├── middleware/        # Shared middleware
    └── types/            # Shared type definitions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed:admin` - Seed admin user
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
