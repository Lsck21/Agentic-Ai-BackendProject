const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Basket API",
            version: "1.0.0",
            description: "API documentation for Basket Project"
        },
       servers: [
    {
        url: "https://agentic-ai-backendproject.onrender.com/api"
    }
],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        security: [
            {
                bearerAuth: []
            }
        ]
    },

    apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = specs;