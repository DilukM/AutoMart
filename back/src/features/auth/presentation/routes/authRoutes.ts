import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../../infrastructure/web/middlewares/AuthMiddleware";

export const authRoutes = (
  authController: AuthController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: User login
   *     description: Authenticate user with username and password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/login", authController.login);

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: User registration
   *     description: Register a new user account
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       200:
   *         description: Registration successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Bad request or user already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/register", authController.register);

  /**
   * @swagger
   * /api/auth/profile:
   *   get:
   *     summary: Get user profile
   *     description: Get the current authenticated user's profile information
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(
    "/profile",
    authMiddleware.authenticate,
    authController.getProfile
  );

  /**
   * @swagger
   * /api/auth/users:
   *   get:
   *     summary: Get all users
   *     description: Get a list of all registered users (requires authentication)
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       username:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(
    "/users",
    authMiddleware.authenticate,
    authController.getAllUsers
  );

  return router;
};
