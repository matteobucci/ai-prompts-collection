# Node.js API Template Setup

## 🎯 Overview

Create a robust, scalable Node.js API with TypeScript, Express, testing, and production-ready features.

## 🚀 Quick Start

### Project Initialization
```bash
# Create project directory
mkdir my-api-project
cd my-api-project

# Initialize npm project
npm init -y

# Install production dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install express-rate-limit express-validator compression

# Install TypeScript and development dependencies
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D nodemon ts-node concurrently jest @types/jest supertest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# Initialize TypeScript
npx tsc --init
```

## 📁 Project Structure

```
src/
├── controllers/         # Route handlers and business logic
├── middleware/          # Custom middleware functions
├── models/             # Data models and database schemas
├── routes/             # API route definitions
├── services/           # Business logic and external service calls
├── utils/              # Utility functions and helpers
├── validators/         # Request validation schemas
├── types/              # TypeScript type definitions
├── config/             # Configuration files
└── __tests__/          # Test files

dist/                   # Compiled JavaScript output
docs/                   # API documentation
scripts/                # Build and deployment scripts
```

## ⚙️ Configuration Files

### package.json - Enhanced Scripts
```json
{
  "name": "my-api-project",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "concurrently \"tsc -w\" \"nodemon dist/server.js\"",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "docker:build": "docker build -t my-api .",
    "docker:run": "docker run -p 3000:3000 my-api"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^6.0.1",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "express-rate-limit": "^6.7.0",
    "express-validator": "^6.14.3",
    "compression": "^1.7.4",
    "mongoose": "^7.0.1",
    "redis": "^4.6.5"
  },
  "devDependencies": {
    "typescript": "^4.9.5",
    "@types/node": "^18.14.2",
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/bcryptjs": "^2.4.2",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/compression": "^1.7.2",
    "nodemon": "^2.0.20",
    "ts-node": "^10.9.1",
    "concurrently": "^7.6.0",
    "jest": "^29.4.3",
    "@types/jest": "^29.4.0",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.12",
    "eslint": "^8.35.0",
    "@typescript-eslint/parser": "^5.54.0",
    "@typescript-eslint/eslint-plugin": "^5.54.0",
    "prettier": "^2.8.4"
  }
}
```

### tsconfig.json - TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@/controllers/*": ["./controllers/*"],
      "@/middleware/*": ["./middleware/*"],
      "@/models/*": ["./models/*"],
      "@/routes/*": ["./routes/*"],
      "@/services/*": ["./services/*"],
      "@/utils/*": ["./utils/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## 🛠️ Core Application Setup

### Main Server File
```typescript
// src/server.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from '@/config/environment'
import { errorHandler } from '@/middleware/errorHandler'
import { notFoundHandler } from '@/middleware/notFoundHandler'
import { apiRoutes } from '@/routes'
import { connectDatabase } from '@/config/database'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Body parsing and compression
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API routes
app.use('/api', apiRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await connectDatabase()
    
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port} in ${config.env} mode`)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully')
      server.close(() => {
        console.log('Process terminated')
        process.exit(0)
      })
    })

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
```

### Environment Configuration
```typescript
// src/config/environment.ts
import dotenv from 'dotenv'

dotenv.config()

interface Config {
  env: string
  port: number
  database: {
    url: string
    options: object
  }
  jwt: {
    secret: string
    expiresIn: string
  }
  cors: {
    origin: string | string[]
  }
  redis: {
    url: string
  }
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
}

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
  process.exit(1)
}
```

## 🔧 Middleware Setup

### Error Handler
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'
import { config } from '@/config/environment'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Log error in development
  if (config.env === 'development') {
    console.error('Error:', err)
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(config.env === 'development' && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  })
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.isOperational = true
  return error
}
```

### Authentication Middleware
```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config/environment'
import { createError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError('Access denied. No token provided.', 401)
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any
    req.user = decoded

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid token.', 401))
    } else {
      next(error)
    }
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Access denied.', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions.', 403))
    }

    next()
  }
}
```

## 🗄️ Database Setup

### MongoDB with Mongoose
```typescript
// src/config/database.ts
import mongoose from 'mongoose'
import { config } from './environment'

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.url, config.database.options)
    console.log('✅ Database connected successfully')

    mongoose.connection.on('error', (error) => {
      console.error('Database error:', error)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected')
    })

  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model<IUser>('User', userSchema)
```

## 🛣️ API Routes Setup

### Route Structure
```typescript
// src/routes/index.ts
import { Router } from 'express'
import { authRoutes } from './auth'
import { userRoutes } from './users'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)

// API version info
router.get('/', (req, res) => {
  res.json({
    message: 'API v1.0.0',
    documentation: '/api/docs',
    status: 'active',
  })
})

export { router as apiRoutes }

// src/routes/auth.ts
import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '@/controllers/AuthController'
import { validateRequest } from '@/middleware/validateRequest'

const router = Router()
const authController = new AuthController()

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  validateRequest,
], authController.register)

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  validateRequest,
], authController.login)

router.post('/refresh', authController.refreshToken)

export { router as authRoutes }
```

### Controller Implementation
```typescript
// src/controllers/AuthController.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '@/models/User'
import { config } from '@/config/environment'
import { createError } from '@/middleware/errorHandler'

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw createError('User already exists with this email', 400)
      }

      // Create new user
      const user = new User({ email, password, name })
      await user.save()

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      )

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      // Find user and include password for comparison
      const user = await User.findOne({ email, isActive: true }).select('+password')
      if (!user) {
        throw createError('Invalid credentials', 401)
      }

      // Check password
      const isValidPassword = await user.comparePassword(password)
      if (!isValidPassword) {
        throw createError('Invalid credentials', 401)
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      )

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation for token refresh
      res.json({ message: 'Token refresh endpoint' })
    } catch (error) {
      next(error)
    }
  }
}
```

## 🧪 Testing Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
}
```

### Test Setup and Examples
```typescript
// src/__tests__/setup.ts
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
})

// src/__tests__/auth.test.ts
import request from 'supertest'
import app from '../server'
import { User } from '../models/User'

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.token).toBeDefined()

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email })
      expect(user).toBeTruthy()
    })

    it('should not register user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      }

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })
      await user.save()
    })

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.token).toBeDefined()
    })

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)
    })
  })
})
```

## 🐳 Docker Setup

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership and switch to non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "dist/server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  mongo_data:
```

## ✅ Development Workflow

### Environment Variables (.env)
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp-dev
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
REDIS_URL=redis://localhost:6379
```

### Development Commands
```bash
# Start development server
npm run dev

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Code quality
npm run lint
npm run lint:fix
npm run format
npm run type-check

# Build and start production
npm run build
npm start

# Docker development
docker-compose up -d
```