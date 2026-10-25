# Job Tracker API

A REST API for keeping track of the jobs you've applied to. Users create an account, log in, and manage their own list of applications, which are stored in a PostgreSQL database.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JSON Web Tokens (JWT), with passwords hashed before storage

## Features

- User accounts with hashed passwords
- Token-based authentication (JWT), so each user only accesses their own applications
- Add a job application
- List all of your applications
- Find an application by ID
- Find applications by position
- Update the status of an application
- Delete an application

## Data Model

**User**

| Field       | Description                  |
|-------------|------------------------------|
| `id`        | Unique identifier            |
| `email`     | User's email address         |
| `password`  | Hashed password              |
| `createdAt` | When the account was created |

**Application**

| Field         | Description                              |
|---------------|------------------------------------------|
| `id`          | Auto-generated identifier                |
| `company`     | Company the application was sent to      |
| `position`    | Title of the position                    |
| `status`      | Current status (e.g. applied, interview) |
| `createdAt`   | When the application was added           |
| `userId`      | Owner of the application (links to User) |

Each application belongs to one user.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A running PostgreSQL instance

### Installation

```bash
git clone https://github.com/ethanGultomm/Job-Tracker.git
cd Job-Tracker
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:my_password@localhost:5432/jobtracker"
JWT_SECRET="my-super-secret-development-key-12345"
PORT=3000
```

### Set Up the Database

```bash
npx prisma migrate dev
```

This applies the schema in `prisma/` and generates the Prisma client.

### Run the Server

```bash
node server.js
```

The API will be available at `http://localhost:3000`.

## Authentication
 
The API uses JWT bearer tokens. Log in with your email and password to receive a token (valid for 7 days), then send it in the `Authorization` header on every request to `/applications`.
 
```http
POST /auth/login
Content-Type: application/json
 
{
  "email": "you@example.com",
  "password": "your-password"
}
```
 
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```
 
```http
GET /applications
Authorization: Bearer <token>
```
 
Requests without a valid token are rejected, and each user can only see and modify their own applications.

## API Endpoints

### Auth

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| POST   | `/auth/register` | Create a new account   |
| POST   | `/auth/login`    | Log in to an account   |

### Applications

| Method | Endpoint                          | Description                          |
|--------|-----------------------------------|--------------------------------------|
| POST   | `/applications`                   | Add a new application                |
| GET    | `/applications`                   | Get all of your applications         |
| GET    | `/applications?id=<id>`           | Get an application by ID             |
| GET    | `/applications?position=<name>`   | Find applications by position        |
| PUT    | `/applications/:id`               | Update the status of an application  |
| DELETE | `/applications/:id`               | Delete an application                |

### Example Request

```http
POST /applications
Authorization: Bearer {{login.response.body.token}}
Content-Type: application/json

{
  "companyName": "Acme Corp",
  "positionName": "Backend Engineer",
  "status": "applied"
}
```

### Example Response

```json
{
  "id": 1,
  "companyName": "Acme Corp",
  "positionName": "Backend Engineer",
  "status": "applied",
  "createdAt": "2026-10-25T09:30:00.000Z",
  "userId": 1
}
```

## Testing the API

Sample requests are in `test.http`. If you use VS Code, install the REST Client extension and click "Send Request" above any request.

## Project Structure

```
.
├── middleware/    # Request middleware (e.g. authentication)
├── prisma/        # Prisma schema and migrations
├── routes/        # Route handlers
├── db.js          # Prisma client setup
├── server.js      # App entry point
└── test.http      # Request examples
```

## Roadmap

- [ ] Input validation and consistent error responses
- [ ] Pagination and filtering by status and date
- [ ] Automated tests and CI
- [ ] Deployment and API documentation
