import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Studentska Služba API",
        description:
          "API dokumentacija za aplikaciju Studentska Služba. " +
          "Ova aplikacija omogućava studentima da podnose zahteve, " +
          "a službenicima da ih obrađuju.",
        version: "1.0.0",
        contact: {
          name: "Tim Studentska Služba",
          email: "admin@fon.bg.ac.rs",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      tags: [
        {
          name: "Auth",
          description: "Autentifikacija korisnika (login, register, logout)",
        },
        {
          name: "Requests",
          description: "Upravljanje studentskim zahtevima",
        },
        {
          name: "Request Types",
          description: "Tipovi zahteva",
        },
        {
          name: "Users",
          description: "Upravljanje korisnicima",
        },
        {
          name: "Documents",
          description: "Upravljanje dokumentima",
        },
      ],
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              email: {
                type: "string",
                example: "student@student.fon.bg.ac.rs",
              },
              role: {
                type: "string",
                enum: ["STUDENT", "STAFF", "ADMIN"],
                example: "STUDENT",
              },
              createdAt: {
                type: "string",
                format: "date-time",
              },
            },
          },
          Request: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              studentId: { type: "integer", example: 1 },
              requestTypeId: { type: "integer", example: 1 },
              status: {
                type: "string",
                enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED"],
                example: "PENDING",
              },
              description: {
                type: "string",
                example: "Potrebno uverenje o studiranju",
              },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          RequestType: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: {
                type: "string",
                example: "Uverenje o studiranju",
              },
              description: {
                type: "string",
                example: "Zahtev za izdavanje uverenja o statusu studenta",
              },
            },
          },
          Document: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              requestId: { type: "integer", example: 1 },
              fileName: { type: "string", example: "uverenje.pdf" },
              fileUrl: { type: "string", example: "/uploads/uverenje.pdf" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          LoginRequest: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                example: "student@student.fon.bg.ac.rs",
              },
              password: { type: "string", example: "student123" },
            },
          },
          RegisterRequest: {
            type: "object",
            required: ["email", "password", "role"],
            properties: {
              email: { type: "string", example: "novi@student.fon.bg.ac.rs" },
              password: { type: "string", example: "novasifra123" },
              role: {
                type: "string",
                enum: ["STUDENT", "STAFF", "ADMIN"],
              },
              firstName: { type: "string", example: "Marko" },
              lastName: { type: "string", example: "Marković" },
              indexNumber: { type: "string", example: "2021/0123" },
            },
          },
          Error: {
            type: "object",
            properties: {
              error: { type: "string", example: "Unauthorized" },
            },
          },
        },
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "session",
            description: "Session cookie za autentifikaciju",
          },
        },
      },
    },
  });
  return spec;
};