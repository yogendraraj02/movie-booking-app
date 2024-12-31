import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'API documentation'
  },
  servers: [
    {
      url: 'http://localhost:4000/api'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/routes/*.js'] // Path to route files
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;