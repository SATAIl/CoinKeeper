# CoinKeeper – Backend Template (Lab 1)

## Overview

CoinKeeper is a minimal backend service used as a template for the **“Server-Side Software Technologies”** labs.  
It exposes a simple REST API with a `/healthcheck` endpoint and is containerized with Docker so it can be run locally or deployed to platforms like Render.com.

Although the original methodical guidelines use Python + Flask, this implementation uses **Node.js + Express**, while keeping the same lab goals:

- Configure a typical backend environment.
- Implement a healthcheck endpoint.
- Prepare the project for deployment.
- Provide clear instructions for local startup and testing.

## Tech Stack

- **Runtime:** Node.js 18 (LTS)
- **Framework:** Express 5
- **Containerization:** Docker, Docker Compose

## Project Structure

```text
.
├── index.js             # Application entry point (Express server)
├── package.json         # NPM metadata and dependencies
├── package-lock.json    # Exact dependency tree
├── Dockerfile           # Image definition for the service
└── docker-compose.yml   # Local Docker Compose configuration
```

## Getting Started

### Prerequisites

To run the project locally you will need:

- **Node.js** v18.x (or compatible)
- **npm** (comes with Node)
- Optionally **Docker** and **Docker Compose** for containerized runs
- Any HTTP client for testing (e.g. **Insomnia**, Postman, curl)

### Local Run (without Docker)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the server**

   ```bash
   node index.js
   ```

3. **Check that the service is running**

   By default the application listens on:

   - `PORT` environment variable if it is set
   - otherwise on port `3000`

   So you can open in browser or via Insomnia:

   - `http://localhost:3000/` – welcome page
   - `http://localhost:3000/healthcheck` – healthcheck endpoint

### Running with Docker

You can also run the service in a container.

#### Using Docker directly

1. **Build the image**

   ```bash
   docker build -t coinkeeper .
   ```

2. **Run the container**

   ```bash
   docker run -p 8080:3000 -e PORT=3000 coinkeeper
   ```

   The service will be available at:

   - `http://localhost:8080/`  
   - `http://localhost:8080/healthcheck`

#### Using Docker Compose

The repository already contains a `docker-compose.yml`. To run via Docker Compose:

```bash
docker-compose up --build
```

After the containers start, the backend will be available at:

- `http://localhost:8080/`
- `http://localhost:8080/healthcheck`

## API

### `GET /healthcheck`

Healthcheck endpoint used for Render and local monitoring.

- **Method:** `GET`
- **Path:** `/healthcheck`
- **Response status:** `200 OK`
- **Response body (JSON):**

  ```json
  {
    "date": "2025-01-01T00:00:00.000Z",
    "status": "OK",
    "message": "Healthcheck passed"
  }
  ```

The `date` field is generated on each request with the current server time in ISO 8601 format.

### `GET /`

Simple welcome endpoint to verify that the service is reachable.

- **Method:** `GET`
- **Path:** `/`
- **Response status:** `200 OK`
- **Response body (text):**

  ```text
  Welcome to CoinKeeper!
  ```

## Deployment to Render.com

   - `https://coinkeeper-m784.onrender.com/healthcheck`  
   - `https://coinkeeper-m784.onrender.com`

## Lab 1 Checklist

How this project satisfies the Lab 1 requirements:

- ✅ **Backend environment configured** – Node.js + Express project with dependencies in `package.json`.
- ✅ **Healthcheck endpoint implemented** – `GET /healthcheck` returns JSON with status and timestamp.
- ✅ **Project under version control** – Git repository with separate commits for initial setup and Docker support.
- ✅ **Local startup instructions** – This `README.md` contains all steps to run the project locally (with and without Docker).
- ✅ **Ready for deployment** – The app reads `PORT` from environment and can be deployed to Render.com using the provided commands.
- ✅ **Manual API testing possible** – Endpoints can be tested with Insomnia/Postman/curl as required by the lab.

This repository can be used as the starting point for the next labs (REST API for expenses, validation, database, authentication, etc.).
