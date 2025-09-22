import { Router } from "express";
import multer from "multer";
import { VehicleController } from "../controllers/VehicleController";
import { AuthMiddleware } from "../../../auth/infrastructure/web/middlewares/AuthMiddleware";

export const vehicleRoutes = (
  vehicleController: VehicleController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  // Configure multer for file uploads
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit per file
      files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
      // Accept only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  /**
   * @swagger
   * /api/vehicles:
   *   get:
   *     summary: Get all vehicles
   *     description: Retrieve a list of all vehicles (public access)
   *     tags: [Vehicles]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of items per page
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [Car, Bike, SUV, Truck, Van, Electric, Hybrid]
   *         description: Filter by vehicle type
   *       - in: query
   *         name: brand
   *         schema:
   *           type: string
   *         description: Filter by brand
   *       - in: query
   *         name: minPrice
   *         schema:
   *           type: number
   *         description: Minimum price filter
   *       - in: query
   *         name: maxPrice
   *         schema:
   *           type: number
   *         description: Maximum price filter
   *     responses:
   *       200:
   *         description: Vehicles retrieved successfully
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
   *                     $ref: '#/components/schemas/Vehicle'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   */
  router.get("/", vehicleController.getAllVehicles);

  /**
   * @swagger
   * /api/vehicles/{id}:
   *   get:
   *     summary: Get vehicle by ID
   *     description: Retrieve a specific vehicle by its ID (public access)
   *     tags: [Vehicles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Vehicle ID
   *     responses:
   *       200:
   *         description: Vehicle retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Vehicle'
   *       404:
   *         description: Vehicle not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get("/:id", vehicleController.getVehicleById);

  /**
   * @swagger
   * /api/vehicles:
   *   post:
   *     summary: Create a new vehicle
   *     description: Create a new vehicle in the inventory with image uploads (Admin only). Images are automatically uploaded to Cloudinary and their URLs are stored in the database. At least one image file is required.
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - brand
   *               - modelName
   *               - color
   *               - engineSize
   *               - year
   *               - price
   *             properties:
   *               type:
   *                 type: string
   *                 enum: [Car, Bike, SUV, Truck, Van, Electric, Hybrid]
   *                 description: Vehicle type
   *               brand:
   *                 type: string
   *                 description: Vehicle brand
   *               modelName:
   *                 type: string
   *                 description: Vehicle model name
   *               color:
   *                 type: string
   *                 description: Vehicle color
   *               engineSize:
   *                 type: string
   *                 description: Engine size
   *               year:
   *                 type: integer
   *                 description: Manufacturing year
   *               price:
   *                 type: number
   *                 format: float
   *                 description: Vehicle price
   *               description:
   *                 type: string
   *                 description: Vehicle description (optional)
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *                 description: Image files (up to 10 files, max 5MB each)
   *                 maxItems: 10
   *     responses:
   *       201:
   *         description: Vehicle created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     type:
   *                       type: string
   *                     brand:
   *                       type: string
   *                     modelName:
   *                       type: string
   *                     color:
   *                       type: string
   *                     engineSize:
   *                       type: string
   *                     year:
   *                       type: integer
   *                     price:
   *                       type: number
   *                     images:
   *                       type: array
   *                       items:
   *                         type: string
   *                       description: Array of uploaded image URLs
   *                     description:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Bad request - Invalid data or no images provided
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - Admin access required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    upload.any(), // Accept any files with any field name
    vehicleController.createVehicle
  );

  /**
   * @swagger
   * /api/vehicles/{id}:
   *   put:
   *     summary: Update a vehicle
   *     description: Update an existing vehicle in the inventory (Admin only)
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Vehicle ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateVehicleRequest'
   *     responses:
   *       200:
   *         description: Vehicle updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Vehicle'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - Admin access required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Vehicle not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.put(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    vehicleController.updateVehicle
  );

  /**
   * @swagger
   * /api/vehicles/{id}:
   *   delete:
   *     summary: Delete a vehicle
   *     description: Delete a vehicle from the inventory (Admin only)
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Vehicle ID
   *     responses:
   *       200:
   *         description: Vehicle deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - Admin access required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Vehicle not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    vehicleController.deleteVehicle
  );

  /**
   * @swagger
   * /api/vehicles/generate-description:
   *   post:
   *     summary: Generate vehicle description
   *     description: Generate an AI-powered description for a vehicle based on its details
   *     tags: [Vehicles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - brand
   *               - modelName
   *               - color
   *               - year
   *               - price
   *             properties:
   *               type:
   *                 type: string
   *                 enum: [Car, Bike, SUV, Truck, Van, Electric, Hybrid]
   *                 description: Type of vehicle
   *               brand:
   *                 type: string
   *                 description: Vehicle brand/manufacturer
   *               modelName:
   *                 type: string
   *                 description: Vehicle model name
   *               color:
   *                 type: string
   *                 description: Vehicle color
   *               engineSize:
   *                 type: string
   *                 description: Engine size (optional)
   *               year:
   *                 type: integer
   *                 description: Manufacturing year
   *               price:
   *                 type: number
   *                 description: Vehicle price
   *     responses:
   *       200:
   *         description: Description generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     description:
   *                       type: string
   *                       description: Generated vehicle description
   *                 message:
   *                   type: string
   *                   example: "AI-generated description created successfully"
   *       400:
   *         description: Bad request - Missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       503:
   *         description: Service unavailable - AI service not configured
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post(
    "/generate-description",
    vehicleController.generateDescription
  );

  return router;
};
