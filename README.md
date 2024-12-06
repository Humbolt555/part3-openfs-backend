
# Phonebook Backend API

This is a simple backend API for managing a phonebook. It provides endpoints to perform CRUD operations for phonebook entries. The server is built using **Express.js** and includes basic logging, CORS support, and error handling.

## Features

- Fetch all phonebook entries
- Fetch a single phonebook entry by ID
- Add a new phonebook entry
- Delete an existing phonebook entry
- View general info about the phonebook
- Basic validation for data integrity

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend (if applicable) and place it in the `dist` directory.

---

## Running the Server

1. Start the development server:
   ```bash
   npm start
   ```

2. The server will run on [http://localhost:3001](http://localhost:3001) by default.

3. To use a custom port, set the `PORT` environment variable:
   ```bash
   PORT=4000 npm start
   ```

---

## Endpoints

### 1. `GET /`
Returns a simple "Hello World" message.

**Example Response**:
```html
<h1>Hello World!</h1>
```

---

### 2. `GET /info`
Provides information about the phonebook, including the total number of entries and the current server time.

**Example Response**:
```html
<p>Phonebook has info for 4 people</p>
<p>Sat Nov 17 2024 14:38:56 GMT+0200 (Eastern European Standard Time)</p>
```

---

### 3. `GET /api/persons`
Fetches all phonebook entries.

**Example Response**:
```json
[
  { "id": "1", "name": "Arto Hellas", "number": "040-123456" },
  { "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" }
]
```

---

### 4. `GET /api/persons/:id`
Fetches a single phonebook entry by ID.

**Example Response**:
```json
{ "id": "1", "name": "Arto Hellas", "number": "040-123456" }
```

If the ID does not exist, returns:
```json
{ "error": "Person not found" }
```

---

### 5. `POST /api/persons`
Adds a new phonebook entry.

**Request Body**:
```json
{
  "name": "John Doe",
  "number": "123-4567890"
}
```

**Example Response**:
```json
{
  "id": "123456",
  "name": "John Doe",
  "number": "123-4567890"
}
```

**Validation Errors**:
- Missing name or number:
  ```json
  { "error": "Name or number is missing" }
  ```
- Duplicate name:
  ```json
  { "error": "Name must be unique" }
  ```

---

### 6. `DELETE /api/persons/:id`
Deletes a phonebook entry by ID.

**Response**:
- Success: `204 No Content`
- If the ID does not exist:
  ```json
  { "error": "Person not found" }
  ```

---

## Middleware

### 1. **Morgan**
Logs all POST requests with the request body.

### 2. **CORS**
Allows cross-origin requests.

### 3. **Unknown Endpoint Handler**
Returns a `404` error for invalid routes.

---

## Customization

### Change Logging Format
The server uses Morgan with a custom format for POST requests. Modify this section to log other request types or adjust the log format:
```js
morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (req) => req.method !== 'POST',
});
```

---

## Future Enhancements

- Add database integration for persistent storage
- Implement pagination for large datasets
- Add PUT/PATCH routes for updating existing entries
- Integrate better error handling and validation libraries (e.g., `Joi`)

---

## License

This project is licensed under the MIT License. Feel free to modify and use it for your own projects! 🎉
