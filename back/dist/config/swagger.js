"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Vehicle Sales Management API",
        version: "1.0.0",
        description: "API for managing vehicle sales, including authentication and vehicle inventory management",
        contact: {
            name: "API Support",
            email: "support@vehiclesales.com",
        },
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Development server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "User ID",
                    },
                    username: {
                        type: "string",
                        description: "Username",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "Account creation date",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "Last update date",
                    },
                },
            },
            Vehicle: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Vehicle ID",
                    },
                    type: {
                        type: "string",
                        enum: ["Car", "Bike", "SUV", "Truck", "Van", "Electric", "Hybrid"],
                        description: "Vehicle type",
                    },
                    brand: {
                        type: "string",
                        description: "Vehicle brand",
                    },
                    modelName: {
                        type: "string",
                        description: "Vehicle model name",
                    },
                    color: {
                        type: "string",
                        description: "Vehicle color",
                    },
                    engineSize: {
                        type: "string",
                        description: "Engine size",
                    },
                    year: {
                        type: "integer",
                        description: "Manufacturing year",
                    },
                    price: {
                        type: "number",
                        format: "float",
                        description: "Vehicle price",
                    },
                    images: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                        description: "Array of image URLs",
                    },
                    description: {
                        type: "string",
                        description: "Vehicle description",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "Creation date",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "Last update date",
                    },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: {
                        type: "string",
                        description: "Username",
                    },
                    password: {
                        type: "string",
                        description: "Password",
                    },
                },
            },
            RegisterRequest: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: {
                        type: "string",
                        description: "Username",
                    },
                    password: {
                        type: "string",
                        description: "Password",
                    },
                },
            },
            AuthResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        description: "Operation success status",
                    },
                    data: {
                        type: "object",
                        properties: {
                            accessToken: {
                                type: "string",
                                description: "JWT access token",
                            },
                            user: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        description: "User ID",
                                    },
                                    username: {
                                        type: "string",
                                        description: "Username",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            CreateVehicleRequest: {
                type: "object",
                required: [
                    "type",
                    "brand",
                    "modelName",
                    "color",
                    "engineSize",
                    "year",
                    "price",
                    "images",
                ],
                properties: {
                    type: {
                        type: "string",
                        enum: ["Car", "Bike", "SUV", "Truck", "Van", "Electric", "Hybrid"],
                        description: "Vehicle type",
                    },
                    brand: {
                        type: "string",
                        description: "Vehicle brand",
                    },
                    modelName: {
                        type: "string",
                        description: "Vehicle model name",
                    },
                    color: {
                        type: "string",
                        description: "Vehicle color",
                    },
                    engineSize: {
                        type: "string",
                        description: "Engine size",
                    },
                    year: {
                        type: "integer",
                        description: "Manufacturing year",
                    },
                    price: {
                        type: "number",
                        format: "float",
                        description: "Vehicle price",
                    },
                    images: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                        description: "Array of image URLs",
                    },
                    description: {
                        type: "string",
                        description: "Vehicle description (optional)",
                    },
                },
            },
            UpdateVehicleRequest: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["Car", "Bike", "SUV", "Truck", "Van", "Electric", "Hybrid"],
                        description: "Vehicle type",
                    },
                    brand: {
                        type: "string",
                        description: "Vehicle brand",
                    },
                    modelName: {
                        type: "string",
                        description: "Vehicle model name",
                    },
                    color: {
                        type: "string",
                        description: "Vehicle color",
                    },
                    engineSize: {
                        type: "string",
                        description: "Engine size",
                    },
                    year: {
                        type: "integer",
                        description: "Manufacturing year",
                    },
                    price: {
                        type: "number",
                        format: "float",
                        description: "Vehicle price",
                    },
                    images: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                        description: "Array of image URLs",
                    },
                    description: {
                        type: "string",
                        description: "Vehicle description",
                    },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        description: "Operation success status",
                    },
                    error: {
                        type: "string",
                        description: "Error message",
                    },
                },
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: [
        "./src/features/auth/presentation/routes/authRoutes.ts",
        "./src/features/vehicles/presentation/routes/vehicleRoutes.ts",
        "./src/app.ts",
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map