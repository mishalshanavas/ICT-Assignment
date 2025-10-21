# Employee App Backend (Assignment 3)

This folder contains the backend implementation for the Employee App. Frontend build is served from `dist/FrontEnd` (do not modify).

## Setup

1. Create a `.env` file in this folder with your MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=3000
```

2. Install dependencies (already done if using the prepared workspace):

```
npm install
```

3. Run the server:

```
npm start
```

The server starts on `http://localhost:3000`.

## REST APIs

- GET `/api/employeelist` — list all employees
- GET `/api/employeelist/:id` — get a single employee by Mongo `_id`
- POST `/api/employeelist` — create a new employee
  - Body: `{ name: string, location?: string, position?: string, salary?: number }`
- DELETE `/api/employeelist/:id` — delete employee by `_id`
- PUT `/api/employeelist` — update an employee (expects `_id` in body)
  - Body: `{ _id: string, name?: string, location?: string, position?: string, salary?: number }`

## Notes

- Express v4 is used to support the wildcard route `/*` required by the given code.
- If `dist/FrontEnd` is not present, the backend will run but static file requests will 404.
