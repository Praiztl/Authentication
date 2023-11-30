## ShynTech Authentication API

Welcome to the ShynTech Authentication API! This API facilitates user authentication using JSON Web Tokens (JWTs) and ensures a secure authentication process. This readme file will guide you through the setup, installation, running the API, and provide examples of various requests and responses.

### Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the API](#running-the-api)
- [Usage](#usage)
- [Example Requests](#example-requests)
- [Example Responses](#example-responses)

### Prerequisites

Before you start, make sure you have the following prerequisites:

- Node.js (version 14.17.6)
- npm (version 6.14.15)
- MongoDB installed and running locally
- Git (optional, for cloning the repository)

### Installation

Follow these steps to set up the project:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shyntech-api-authentications
   ```

2. Install dependencies:
   ```bash
   npm install
   ```


### Running the API

Start the server by running the following command:

```bash
npm start
```

The server will be running at `http://localhost:3000`.

### Usage

The API provides the following endpoints:

- **POST /auth/login:** Authenticate users and generate a JSON Web Token (JWT).
  - Request Body:
    ```json
    {
      "username": "exampleUser",
      "password": "securePassword"
    }
    ```

### Example Requests and Responses

1. **Successful authentication response:**
   - Request:
     ```bash
     curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "exampleUser", "password": "securePassword"}'
     ```
   - Response:
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGMwZDQ2NTgzOWM1MTQ2ODZjYzZiYTAiLCJpYXQiOjE2MTkxMzcyNjAsImV4cCI6MTYxOTE0MDg2MH0.wJGkkTz27e_vyaxf1M85rMUPtNvXo25ntGtJgdy-aNk"
     }
     ```

2. **Incorrect username response:**
   - Request:
     ```bash
     curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "nonexistentUser", "password": "securePassword"}'
     ```
   - Response:
     ```json
     {
       "message": "User not found"
     }
     ```

3. **Incorrect password response:**
   - Request:
     ```bash
     curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "exampleUser", "password": "wrongPassword"}'
     ```
   - Response:
     ```json
     {
       "message": "Incorrect password"
     }
     ```

4. **Missing username in request response:**
   - Request:
     ```bash
     curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"password": "securePassword"}'
     ```
   - Response:
     ```json
     {
       "message": "Username is required"
     }
     ```

5. **Missing password in request response:**
   - Request:
     ```bash
     curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "exampleUser"}'
     ```
   - Response:
     ```json
     {
       "message": "Password is required"
     }
     ```

