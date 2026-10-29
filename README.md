# Task Manager Portfolio — Practicals 1–13

### Advanced Web Development Frameworks (ITUE301)

**Student Name:** Sahil Makwana  
**Student ID:** `24IT045`  
**Institution:** CHARUSAT — Faculty of Technology and Engineering

A full-stack student portfolio and task-management application developed progressively across 13 practicals, from reusable React components to a Dockerized app with JWT authentication, automated CI tests, and AI-assisted task descriptions.

[Main Project Repository](https://github.com/sahilmak1602/Task-Manager-Portfolio-24IT045) · [Additional Portfolio Repository](https://github.com/sahilmak1602/WDF_24IT045_SAHIL) · [Report an Issue](https://github.com/sahilmak1602/Task-Manager-Portfolio-24IT045/issues)

---

## Table of Contents

- [Project Repositories](#project-repositories)
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Practical 1–13: Work Completed](#practical-113-work-completed)
- [Main Features](#main-features)
- [Project Structure](#project-structure)
- [Run with Docker Compose](#run-with-docker-compose)
- [Configure Environment Variables](#configure-environment-variables)
- [Run Without Docker](#run-without-docker)
- [API Overview](#api-overview)
- [Testing and CI](#testing-and-ci)
- [AI Feature and Responsible Use](#ai-feature-and-responsible-use)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Learning Outcomes](#learning-outcomes)
- [Author](#author)

## Project Repositories

| Repository | Purpose | Status |
|---|---|---|
| [Task-Manager-Portfolio-24IT045](https://github.com/sahilmak1602/Task-Manager-Portfolio-24IT045) | Main repository for the integrated ITUE301 portfolio and Task Manager project, including the Practical 1–13 development history. | Current main project |
| [WDF_24IT045_SAHIL](https://github.com/sahilmak1602/WDF_24IT045_SAHIL) | Additional repository where the complete portfolio source will also be uploaded. | Intended additional copy; contents should be pushed separately |

Both links point to Sahil Makwana's project repositories. The additional repository is listed for convenience; adding its link here does not automatically copy files or synchronize the two repositories.

## Project Overview

This repository combines a React-based student portfolio with a task-management application backed by a Node.js/Express API and MongoDB. It is built in stages across **13 practicals** for ITUE301. The portfolio provides navigation and pages for presenting information, while the task manager demonstrates persistent CRUD operations, validation, authentication, performance improvements, background event notifications, containerization, CI automation, and an AI-powered description suggestion.

The AI feature sends the task title from the authenticated backend to Groq and returns an editable description suggestion. The user reviews the suggestion and explicitly saves the task.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router, JavaScript, CSS |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Performance | React lazy loading/code splitting, node-cache |
| Event handling | Node.js `EventEmitter` |
| AI integration | Groq API, OpenAI-compatible Chat Completions endpoint, `openai/gpt-oss-20b` model |
| Containers | Docker, Docker Compose |
| Automation | GitHub Actions, automated backend tests with Jest/Supertest |
| Development tools | npm, Git, GitHub, browser developer tools; Postman/Thunder Client can be used for API testing |

## Practical 1–13: Work Completed

| Practical | Topic | Implementation / learning outcome |
|---:|---|---|
| **1** | Introduction to React and component architecture | Created the student portfolio UI using reusable components such as Header, About, Skills, and Footer. |
| **2** | State management and routing in React | Added navigation and page/section routing for areas such as Home, Projects, and Contact, along with interactive state and form input handling. |
| **3** | API integration and data rendering in React | Practised consuming REST API data and handling asynchronous loading, success, and error states in the UI. |
| **4** | Building a RESTful API with Node.js and Express | Built the task-management backend with create, read, update, and delete routes, request logging, and global error handling. |
| **5** | MongoDB integration and schema design with Mongoose | Connected the API to MongoDB and defined database models and validation for persistent task records. |
| **6** | Full-stack integration — React, Node.js, and MongoDB | Connected the React interface to backend API endpoints so task operations persist in MongoDB. |
| **7** | Authentication and middleware pipeline | Added user registration/login, password hashing, JWT token generation and verification, protected task routes, and server-side input validation. |
| **8** | Performance optimization and lazy loading | Applied React lazy loading/code splitting to reduce the work required to load route-level UI. |
| **9** | In-memory caching and query optimization | Cached the GET-all-tasks response with `node-cache` and invalidated cached task data after write operations. |
| **10** | Asynchronous processing with event-driven architecture | Used Node.js `EventEmitter` for task-created/task-deleted notifications and timestamped server-side logs. |
| **11** | Containerization with Docker and Docker Compose | Added Docker configuration for frontend and backend and orchestrated the frontend, backend, and MongoDB services together. |
| **12** | CI/CD pipeline with GitHub Actions | Configured a workflow to install dependencies and run automated tests on pushes/pull requests; verified both a failing test run and a successful run after fixing it. |
| **13** | AI API integration into a web application | Added an authenticated backend endpoint and React UI action that generates a task description using Groq, displays it as editable text, shows a loading state and disclaimer, and falls back gracefully when the provider request fails. |

> Practicals are integrated into one evolving project; they are not necessarily stored as 13 separate folders.

## Main Features

- **Portfolio pages:** navigation and sections for presenting the student profile, skills, projects, and contact information.
- **Task CRUD:** create, list, view, update, and delete task records stored in MongoDB.
- **Input validation:** server-side checks for task titles, descriptions, completion state, priority, email, and password.
- **Authentication:** registration/login, bcrypt password hashing, signed JWTs, and authentication middleware for protected endpoints.
- **Caching:** in-memory caching for the task list with invalidation on create/update/delete.
- **Event notifications:** event-driven logs for task changes without making the main API dependent on notification work.
- **AI task descriptions:** request an AI-generated suggestion from a task title, review/edit it, then save the task normally.
- **Graceful fallback:** an AI provider error or timeout should not stop core task CRUD functionality.
- **Containerized services:** start the frontend, backend, and database using Docker Compose.
- **Automated checks:** GitHub Actions CI for backend tests.

## Project Structure

```text
Task-Manager-Portfolio-24IT045/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow
├── student-portfolio/             # React + Vite frontend
│   └── src/
│       ├── api.js                 # Frontend API helper functions
│       └── pages/
│           └── TaskManager.jsx    # Task manager UI and AI button
├── task-manager-api-24IT045/      # Express + MongoDB backend
│   ├── models/                    # Mongoose models
│   ├── server.js                  # REST API, auth, task and AI routes
│   ├── listeners.js               # Event-driven notifications
│   ├── cache.js                   # In-memory cache
│   ├── package.json
│   └── .env                       # Local secrets; do not commit
├── docker-compose.yml             # Frontend, backend and MongoDB services
└── README.md
```

The exact set of source files may evolve as the practicals are extended.

## Run with Docker Compose

### Prerequisites

- Git
- Docker Desktop (running)
- A MongoDB connection string if using a cloud database
- A Groq API key for the AI description feature (optional for the rest of the app)

### 1. Clone the repository

```bash
git clone https://github.com/sahilmak1602/Task-Manager-Portfolio-24IT045.git
cd Task-Manager-Portfolio-24IT045
```

### 2. Configure the backend environment

Create `task-manager-api-24IT045/.env` using the template below. Keep real secrets only in this local file.

```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/task_manager
JWT_SECRET=replace_with_a_long_random_secret
GROQ_API_KEY=replace_with_your_groq_api_key
```

Use the MongoDB URI required by your own setup. The URI shown above assumes the Compose MongoDB service is named `mongodb` and is reachable by that service name from the backend container. If your Compose configuration uses a different database name or cloud MongoDB, adjust `MONGODB_URI` accordingly. Do not surround values with quotes unless your setup requires it.

Generate a strong, unique `JWT_SECRET`. Never place real API keys, passwords, database credentials, or tokens in this README or in source code.

### 3. Build and start all services

From the repository root (the folder containing `docker-compose.yml`):

```bash
docker compose up --build -d
```

### 4. Open the application

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5000>

Register or log in, open Task Manager, create a task, and test the CRUD actions. For the AI feature, enter a short task title and click **Generate description with AI**. Review or edit the suggested text, then click **Create Task** to save it.

### Useful Docker commands

```bash
# Check service status
docker compose ps

# Follow backend logs
docker compose logs -f backend

# Follow all service logs
docker compose logs -f

# Rebuild and restart the backend after code or environment changes
docker compose up --build -d --force-recreate backend

# Stop services (named database volume is retained)
docker compose down
```

To delete the database volume as well, `docker compose down -v` may be used, but this permanently deletes the data stored in that volume. Do not run it unless you intend to remove that data.

## Configure Environment Variables

The backend reads environment variables from `task-manager-api-24IT045/.env` in the local setup used for this project and Docker Compose passes that file into the backend container.

| Variable | Required? | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign/verify authentication tokens. |
| `GROQ_API_KEY` | Only for AI | Server-side Groq API key used by the AI description endpoint. |
| `PORT` | Optional | Backend port; defaults to `5000`. |

**Never commit `.env`.** Confirm that `.env`, `.env.*`, and `node_modules/` are excluded by `.gitignore`. A public `.env.example` may include placeholders only, never real credentials.

## Run Without Docker

Running services directly requires a reachable MongoDB database and the environment variables above.

### Backend

```bash
cd task-manager-api-24IT045
npm install
node server.js
```

The API normally listens on port `5000`.

### Frontend

In a separate terminal:

```bash
cd student-portfolio
npm install
npm run dev
```

Open the local URL printed by Vite (commonly <http://localhost:5173>). Ensure the frontend API helper points to the backend URL for your local setup.

## API Overview

The API's task endpoints require a valid JWT in the `Authorization: Bearer <token>` header. The AI endpoint is also protected by authentication.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/register` | Register a user and hash the password. |
| `POST` | `/login` | Verify credentials and return a JWT. |
| `GET` | `/me` | Return the current authenticated user's profile. |
| `GET` | `/tasks` | List tasks (cached when available). |
| `GET` | `/tasks/:id` | Retrieve one task by ID. |
| `POST` | `/tasks` | Create a task. |
| `PUT` | `/tasks/:id` | Update a task. |
| `DELETE` | `/tasks/:id` | Delete a task. |
| `POST` | `/api/ai/generate-description` | Generate a task description suggestion through Groq. |

For JSON request bodies, set `Content-Type: application/json`. The backend validates inputs and returns suitable HTTP error responses for invalid requests, authentication failures, missing records, and provider failures.

## Testing and CI

- Run the existing GitHub Actions workflow from **Actions** in the repository to inspect automated test results.
- The CI workflow was configured during Practical 12 to install dependencies and run the backend test suite on pushes/pull requests.
- After changes, use `git status` to inspect modified files before staging and committing them.
- For local API checks, use Postman or Thunder Client with a valid JWT for protected endpoints.
- To diagnose Dockerized backend issues:

```bash
docker compose logs --tail=60 backend
```

Successful API responses should be verified in the browser or API client, not inferred solely from the fact that the backend logged an incoming request.

## AI Feature and Responsible Use

The AI feature sends the task title to the Groq API from the backend and displays the generated description as an editable suggestion. The API key is stored on the server in `GROQ_API_KEY` and must never be exposed in frontend code.

- Review and edit AI suggestions before saving them.
- Do not send passwords, personal data, private records, confidential information, or secrets in task titles.
- Provider availability, model access, and rate limits can change; the AI feature may return a fallback message if the provider is unavailable or usage limits are reached.
- The core task-management API should remain usable when AI generation fails.

## Security Notes

- Do not commit `.env`, API keys, passwords, JWT secrets, or database credentials.
- If a secret is accidentally shared or committed, revoke/rotate it immediately; deleting it from the latest commit alone may not remove it from Git history.
- Use HTTPS and appropriate CORS restrictions before exposing this project publicly.
- Use a strong JWT secret and keep dependencies updated.
- Do not use production or sensitive personal data for classroom tests.

## Troubleshooting

| Symptom | Checks |
|---|---|
| Backend does not start | Check `docker compose ps` and `docker compose logs --tail=60 backend`; verify `MONGODB_URI` and `JWT_SECRET`. |
| MongoDB connection fails | Confirm MongoDB is healthy and the URI host matches the configured database service. |
| `401` on task routes | Log in again and confirm the frontend sends the current JWT as a Bearer token. |
| AI returns a fallback | Confirm `GROQ_API_KEY` is present in the backend container and inspect backend logs for the provider's status/error. Check Groq model access and usage limits. |
| Frontend cannot reach API | Confirm backend port `5000` is available and check the API base URL in `student-portfolio/src/api.js`. |
| Port already in use | Stop the conflicting process or change the port mapping and corresponding frontend API URL. |

## Learning Outcomes

By completing the 13 practicals, this project demonstrates work with component-based React development, routing and state, external API rendering, REST design, database modeling, full-stack integration, JWT authentication, lazy loading, caching, asynchronous events, containers, CI automation, and responsible third-party AI integration.

## Author

**Sahil Makwana**  
Student ID: `24IT045`  
Course: Advanced Web Development Frameworks (ITUE301)  
Institution: CHARUSAT — Faculty of Technology and Engineering

- GitHub: [@sahilmak1602](https://github.com/sahilmak1602)
- Repository: [Task-Manager-Portfolio-24IT045](https://github.com/sahilmak1602/Task-Manager-Portfolio-24IT045)

---

*Built as an ITUE301 learning project — from React components to a full-stack, containerized application with AI assistance.*
