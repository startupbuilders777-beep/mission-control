import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// OpenAPI specification for Mission Control API
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Mission Control API',
    description: 'API for monitoring agents, projects, and tasks',
    version: '1.0.0',
  },
  servers: [
    {
      url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      description: 'Production server',
    },
  ],
  paths: {
    '/api/board': {
      get: {
        summary: 'Get task board',
        description: 'Retrieve all tasks organized by status',
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    todo: { type: 'array', items: { type: 'object' } },
                    inProgress: { type: 'array', items: { type: 'object' } },
                    done: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['todo', 'inProgress', 'done'] },
                  priority: { type: 'string', enum: ['P0', 'P1', 'P2'] },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Task created' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/agents': {
      get: {
        summary: 'Get all agents',
        description: 'Retrieve status of all agents',
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      status: { type: 'string' },
                      lastActivity: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/metrics': {
      get: {
        summary: 'Get system metrics',
        description: 'Retrieve current system metrics',
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    cpu: { type: 'number' },
                    memory: { type: 'number' },
                    requests: { type: 'number' },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/metrics/stream': {
      get: {
        summary: 'Stream metrics',
        description: 'Get real-time metrics streaming (Server-Sent Events)',
        responses: {
          '200': {
            description: 'Success',
            content: {
              'text/event-stream': {
                schema: { type: 'string' },
              },
            },
          },
        },
      },
    },
    '/api/alerts': {
      get: {
        summary: 'Get alerts',
        description: 'Retrieve all configured alerts',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Success' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create alert',
        description: 'Create a new alert rule',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'condition', 'action'],
                properties: {
                  name: { type: 'string' },
                  condition: { type: 'object' },
                  action: { type: 'string', enum: ['email', 'webhook', 'discord'] },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Alert created' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/alerts/test': {
      post: {
        summary: 'Test alert',
        description: 'Send a test alert notification',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['alertId'],
                properties: {
                  alertId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Test sent' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/external-agents': {
      get: {
        summary: 'Get external agents',
        description: 'List all configured external agents',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Success' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Add external agent',
        description: 'Register a new external agent',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'url', 'apiKey'],
                properties: {
                  name: { type: 'string' },
                  url: { type: 'string' },
                  apiKey: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Agent added' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/cron/health': {
      get: {
        summary: 'Health check cron',
        description: 'Cron endpoint for health checks',
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/cron/metrics': {
      get: {
        summary: 'Metrics collection cron',
        description: 'Cron endpoint for collecting metrics',
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec);
}
