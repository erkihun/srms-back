
const port = process.env.PORT || 4000;

const serverUrl =
  process.env.RENDER_EXTERNAL_URL ||
  process.env.PUBLIC_BASE_URL ||
  'https://srms-ewt8.onrender.com';

const servers = [];

if (serverUrl) {
  servers.push({
    url: serverUrl,
    description: 'Production server',
  });
}

servers.push({
  url: `http://localhost:${port}`,
  description: 'Local development server',
});

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'SRMS API',
    version: '1.0.0',
    description: 'Service Request Management System API documentation.',
  },
  servers,
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtained from /api/auth/login',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          full_name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['ADMIN', 'TECHNICIAN', 'EMPLOYEE'] },
          department_id: { type: 'integer', nullable: true },
          is_active: { type: 'boolean' },
          username: { type: 'string', nullable: true },
          avatar_url: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
          updated_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      UserSummary: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          full_name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['ADMIN', 'TECHNICIAN', 'EMPLOYEE'] },
          department_id: { type: 'integer', nullable: true },
          is_active: { type: 'boolean' },
        },
      },
      Department: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
          updated_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          is_active: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time', nullable: true },
          updated_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Ticket: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          ticket_code: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          requester_id: { type: 'integer' },
          assigned_to_id: { type: 'integer', nullable: true },
          department_id: { type: 'integer', nullable: true },
          category_id: { type: 'integer', nullable: true },
          feedback_rating: { type: 'integer', nullable: true },
          feedback_comment: { type: 'string', nullable: true },
          feedback_given_at: { type: 'string', format: 'date-time', nullable: true },
          requested_at: { type: 'string', format: 'date-time', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
          updated_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      TicketLog: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          ticket_id: { type: 'integer' },
          created_by_id: { type: 'integer' },
          action_type: { type: 'string' },
          old_status: { type: 'string', enum: ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'], nullable: true },
          new_status: { type: 'string', enum: ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'], nullable: true },
          note: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      TicketAttachment: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          ticket_id: { type: 'integer' },
          uploaded_by_id: { type: 'integer' },
          filename_original: { type: 'string' },
          filename_stored: { type: 'string' },
          mime_type: { type: 'string', nullable: true },
          size_bytes: { type: 'integer', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          assigned_to: { type: 'integer', nullable: true },
          created_by: { type: 'integer', nullable: true },
          due_date: { type: 'string', format: 'date-time', nullable: true },
          technician_note: { type: 'string', nullable: true },
          technician_rating: { type: 'integer', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
          updated_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      TaskProgress: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          task_id: { type: 'integer' },
          technician_id: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
          note: { type: 'string', nullable: true },
          admin_comment: { type: 'string', nullable: true },
          admin_id: { type: 'integer', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          user_id: { type: 'integer' },
          title: { type: 'string' },
          message: { type: 'string' },
          link_url: { type: 'string', nullable: true },
          is_read: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time', nullable: true },
          read_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'JWT token' },
          user: { $ref: '#/components/schemas/UserSummary' },
        },
      },
      Ok: {
        type: 'object',
        properties: { ok: { type: 'boolean', example: true } },
      },
      Error: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        description: 'Returns basic information about API health and uptime.',
        security: [],
        responses: {
          '200': {
            description: 'API is healthy',
          },
        },
      },
    },

    '/api/auth/login': {
      post: {
        summary: 'Log in',
        description: 'Authenticate a user and return a JWT.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
                required: ['email', 'password'],
              },
              example: {
                email: 'user@example.com',
                password: 'password123',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Logged in',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Current user',
        description: 'Get the profile for the currently authenticated user.',
        responses: {
          '200': {
            description: 'User profile',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/register-employee': {
      post: {
        summary: 'Register employee',
        description: 'Public endpoint to register a new employee account.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: {
                    type: 'string',
                    description: 'Full name, e.g. "John Doe"',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Work email, e.g. you@organization.gov',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    description: 'Password (min 6 characters)',
                  },
                  department_id: {
                    type: 'integer',
                    description: 'Department ID selected from /api/departments',
                  },
                },
                required: ['full_name', 'email', 'password', 'department_id'],
              },
              example: {
                full_name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
                department_id: 1,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Employee registered',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
        },
      },
    },

    '/api/users': {
      get: {
        summary: 'List users',
        description: 'Admin-only list of all users.',
        responses: {
          '200': {
            description: 'Array of users',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } },
          },
          '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        summary: 'Create user',
        description: 'Admin-only: create a new user (optionally with avatar).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                  role: {
                    type: 'string',
                    enum: ['ADMIN', 'TECHNICIAN', 'EMPLOYEE'],
                  },
                  department_id: { type: 'integer', nullable: true },
                  is_active: { type: 'boolean' },
                  username: { type: 'string' },
                  phone: { type: 'string' },
                },
                required: ['full_name', 'email', 'password'],
              },
              example: {
                full_name: 'Tech User',
                email: 'tech@example.com',
                password: 'password123',
                role: 'TECHNICIAN',
                department_id: 1,
                is_active: true,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID',
        description: 'Get a user profile (self or admin).',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': {
            description: 'User',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        summary: 'Update user',
        description: 'Update a user profile (self or admin).',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  role: {
                    type: 'string',
                    enum: ['ADMIN', 'TECHNICIAN', 'EMPLOYEE'],
                  },
                  department_id: { type: 'integer', nullable: true },
                  is_active: { type: 'boolean' },
                  username: { type: 'string' },
                  phone: { type: 'string' },
                  password: { type: 'string', format: 'password' },
                },
              },
              example: {
                full_name: 'Updated Name',
                role: 'EMPLOYEE',
                department_id: 2,
                is_active: true,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated user',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
        },
      },
      delete: {
        summary: 'Deactivate user',
        description: 'Admin-only: deactivate a user.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'User deactivated' },
        },
      },
    },

    '/api/departments': {
      get: {
        summary: 'List departments',
        description: 'Public list of departments.',
        responses: {
          '200': {
            description: 'Array of departments',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Department' } } } },
          },
        },
      },
      post: {
        summary: 'Create department',
        description: 'Admin-only: create a new department.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                },
                required: ['name'],
              },
              example: {
                name: 'IT',
                description: 'Information Technology',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Department created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Department' } } },
          },
        },
      },
    },
    '/api/departments/{id}': {
      put: {
        summary: 'Update department',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                },
                required: ['name'],
              },
              example: {
                name: 'Updated department',
                description: 'Updated description',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Department updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Department' } } },
          },
        },
      },
      delete: {
        summary: 'Delete department',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'Department deleted' },
        },
      },
    },

    '/api/categories': {
      get: {
        summary: 'List categories',
        responses: {
          '200': {
            description: 'Array of categories',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } },
          },
        },
      },
      post: {
        summary: 'Create category',
        description: 'Admin-only: create a category.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  is_active: { type: 'boolean' },
                },
                required: ['name'],
              },
              example: {
                name: 'Hardware',
                description: 'Hardware-related issues',
                is_active: true,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Category created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } },
          },
        },
      },
    },
    '/api/categories/{id}': {
      put: {
        summary: 'Update category',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  is_active: { type: 'boolean' },
                },
                required: ['name'],
              },
              example: {
                name: 'Updated category',
                description: 'Updated description',
                is_active: true,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Category updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } },
          },
        },
      },
      delete: {
        summary: 'Delete category',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'Category deleted' },
        },
      },
    },

    '/api/tickets': {
      get: {
        summary: 'List tickets',
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'],
            },
            description: 'Filter by ticket status',
          },
          {
            name: 'department_id',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Filter by department',
          },
          {
            name: 'category_id',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Filter by category',
          },
          {
            name: 'mine',
            in: 'query',
            schema: { type: 'string', enum: ['true', 'false'] },
            description: "If 'true' and role is EMPLOYEE, only own tickets.",
          },
          {
            name: 'assigned',
            in: 'query',
            schema: { type: 'string', enum: ['true', 'false'] },
            description: "If 'true' and role is TECHNICIAN, only assigned tickets.",
          },
        ],
        responses: {
          '200': {
            description: 'Array of tickets',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create ticket',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  department_id: { type: 'integer' },
                  category_id: { type: 'integer' },
                  priority: {
                    type: 'string',
                    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
                  },
                  requester_id: {
                    type: 'integer',
                    description: 'Only used when admin creates on behalf of an employee.',
                  },
                },
                required: ['title'],
              },
              example: {
                title: 'PC not turning on',
                description: 'My workstation does not power on.',
                department_id: 1,
                category_id: 2,
                priority: 'HIGH',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Ticket created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } },
          },
        },
      },
    },
    '/api/tickets/{id}': {
      get: {
        summary: 'Get ticket',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Ticket', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/tickets/{id}/status': {
      patch: {
        summary: 'Change ticket status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'],
                  },
                },
                required: ['status'],
              },
              example: { status: 'IN_PROGRESS' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Status updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } },
          },
        },
      },
    },
    '/api/tickets/{id}/assign': {
      patch: {
        summary: 'Assign ticket',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  assigned_to_id: { type: 'integer' },
                },
                required: ['assigned_to_id'],
              },
              example: { assigned_to_id: 5 },
            },
          },
        },
        responses: {
          '200': {
            description: 'Ticket assigned',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } },
          },
        },
      },
    },
    '/api/tickets/{id}/logs': {
      get: {
        summary: 'Ticket logs',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': {
            description: 'Array of logs',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/TicketLog' } },
              },
            },
          },
        },
      },
    },
    '/api/tickets/{id}/attachments': {
      get: {
        summary: 'List ticket attachments',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': {
            description: 'Array of attachments',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/TicketAttachment' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Upload ticket attachment',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Attachment uploaded',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TicketAttachment' } } },
          },
        },
      },
    },
    '/api/tickets/{id}/notes': {
      post: {
        summary: 'Add ticket note',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  note: { type: 'string' },
                  time_spent_minutes: { type: 'integer', nullable: true },
                },
                required: ['note'],
              },
              example: {
                note: 'Investigated the issue and replaced power supply.',
                time_spent_minutes: 45,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Note added',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TicketLog' } } },
          },
        },
      },
    },
    '/api/tickets/{id}/employee-update': {
      patch: {
        summary: 'Employee update own ticket',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: {
                    type: 'string',
                    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
                  },
                  department_id: { type: 'integer' },
                  category_id: { type: 'integer' },
                },
                required: ['title', 'description'],
              },
              example: {
                title: 'Updated ticket title',
                description: 'More accurate description of the problem.',
                priority: 'HIGH',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Ticket updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } },
          },
        },
      },
    },
    '/api/tickets/{id}/feedback': {
      post: {
        summary: 'Submit ticket feedback',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  comment: { type: 'string', nullable: true },
                },
                required: ['rating'],
              },
              example: {
                rating: 5,
                comment: 'Great support, issue resolved quickly.',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Feedback stored',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } },
          },
        },
      },
    },

    '/api/dashboard/technician-performance': {
      get: {
        summary: 'Technician performance (admin)',
        responses: {
          '200': { description: 'Technician performance data' },
        },
      },
    },
    '/api/dashboard/summary': {
      get: {
        summary: 'Admin summary',
        responses: {
          '200': { description: 'Summary stats' },
        },
      },
    },
    '/api/dashboard/technician-summary': {
      get: {
        summary: 'Technician summary',
        responses: {
          '200': { description: 'Summary for logged-in technician' },
        },
      },
    },
    '/api/dashboard/technician-rating': {
      get: {
        summary: 'Technician rating',
        responses: {
          '200': { description: 'Rating for logged-in technician' },
        },
      },
    },
    '/api/dashboard/technician-task-rating': {
      get: {
        summary: 'Technician task rating',
        responses: {
          '200': { description: 'Task rating for logged-in technician' },
        },
      },
    },

    '/api/tasks': {
      get: {
        summary: 'List tasks',
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              description: 'Filter by task status (OPEN, IN_PROGRESS, DONE, etc.)',
            },
          },
          {
            name: 'assigned_to',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Filter tasks assigned to a specific user',
          },
        ],
        responses: {
          '200': {
            description: 'Array of tasks',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } },
          },
        },
      },
      post: {
        summary: 'Create task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  status: { type: 'string' },
                  priority: { type: 'string' },
                  assigned_to: { type: 'integer', nullable: true },
                  due_date: { type: 'string', format: 'date-time', nullable: true },
                  technician_note: { type: 'string', nullable: true },
                  technician_rating: { type: 'integer', nullable: true },
                },
                required: ['title'],
              },
              example: {
                title: 'Install new software',
                description: 'Install antivirus on 10 PCs',
                priority: 'MEDIUM',
                assigned_to: 3,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Task created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
          },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Task', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        summary: 'Update task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  status: { type: 'string' },
                  priority: { type: 'string' },
                  assigned_to: { type: 'integer', nullable: true },
                  due_date: { type: 'string', format: 'date-time', nullable: true },
                  technician_note: { type: 'string', nullable: true },
                  technician_rating: { type: 'integer', nullable: true },
                },
              },
              example: {
                status: 'IN_PROGRESS',
                technician_note: 'Started working on this task.',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Task updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
          },
        },
      },
      delete: {
        summary: 'Delete task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'Task deleted' },
        },
      },
    },
    '/api/tasks/{id}/progress': {
      get: {
        summary: 'Get task progress',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': {
            description: 'Task progress',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/TaskProgress' } },
              },
            },
          },
        },
      },
    },
    '/api/tasks/{id}/progress/{progressId}/admin-comment': {
      put: {
        summary: 'Update task progress admin comment',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'progressId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  admin_comment: { type: 'string' },
                },
                required: ['admin_comment'],
              },
              example: {
                admin_comment: 'Reviewed progress, looks good.',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Admin comment updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskProgress' } } },
          },
        },
      },
    },

    '/api/notifications': {
      get: {
        summary: 'List notifications',
        description: 'List notifications for the current user.',
        parameters: [
          {
            name: 'unread',
            in: 'query',
            schema: { type: 'string', enum: ['true', 'false'] },
            description: "If 'true', only return unread notifications.",
          },
        ],
        responses: {
          '200': {
            description: 'Array of notifications',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
              },
            },
          },
        },
      },
    },
    '/api/notifications/{id}/read': {
      post: {
        summary: 'Mark notification as read',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Notification marked as read', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ok' } } } },
        },
      },
    },
    '/api/notifications/read-all': {
      post: {
        summary: 'Mark all notifications as read',
        responses: {
          '200': { description: 'All notifications marked as read', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ok' } } } },
        },
      },
    },
  },
};

export default openApiSpec;
