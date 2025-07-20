#  IMF Gadget API

The **IMF Gadget API** is a RESTful service that allows managing and tracking high-tech gadgets. It supports operations such as listing, creating, updating, and decommissioning gadgets, along with a **mission success probability** feature.

---

##  Live API
🔗 **Base URL:** [IMF Gadget API on Render](https://gadget-api-pf2a.onrender.com/)

---

## 📖 API Documentation
🔗 **Swagger Documentation:** [View API Docs](https://gadget-api-pf2a.onrender.com/docs/)  

---

## ⚙️ Features
- ✅ **Filter gadgets by status (`Available`, `Destroyed`, `Deployed`, `Decommissioned`)**
- ✅ **Reterive gadgets by their id**
- ✅ **Add new gadgets**
- ✅ **Update gadget status**
- ✅ **Decommission gadgets instead of deleting them**
- ✅ **Trigger self-destruct sequence**

---

## 🔥 API Endpoints

### 📌 ** Get All Gadgets**
```http
GET /gadgets
```
🔹 Retrieves all gadgets with a **random mission success probability**.  
✅ **Supports filtering by status**:  
```http
GET /gadgets?status=Available
```

#### 📌 **Response Example**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "codeName": "string",
    "status": "string",
    "successRate": "85.30%",
    "decommissionedAt": "2025-07-20T10:53:55.613Z",
    "user": {
      "id": "string",
      "email": "string"
    }
  }
]
```

---

### 📌 ** Create a New Gadget**
```http
POST /gadgets
```
#### 📌 **Request Body**
```json
{
    "name": "VR Headset"
}
```
#### 📌 **Response**
```json
{
  "message": "Gadget created",
  "gadget": {
    "id": "b00a96ca-73c5-45d2-9a8b-64cac075965c",
    "name": "VR Headset",
    "codeName": "The Merciless",
    "status": "Available",
    "decommissionedAt": null,
    "userId": "97ba4038-7c9c-44c5-8de5-f0836e07e353",
    "successRate": 71.67
  }
}
```

---

### 📌 ** Update Gadget Status**
```http
PATCH /gadgets/{id}
```
#### 📌 **Request Body**
```json
{
    "status": "Destroyed"
}
```
#### 📌 **Response**
```json
{
    "message": "Gadget updated successfully",
    "gadget": {
        "id": "67890",
        "name": "VR Headset",
        "status": "Destroyed"
    }
}
```

---

### 📌 ** Decommission a Gadget**
```http
DELETE /gadgets/{id}
```
🔹 Instead of deleting, this **marks the gadget as "Decommissioned"** and adds a timestamp.

#### 📌 **Response**
```json
{
    "message": "Gadget decommissioned",
    "gadget": {
        "id": "67890",
        "status": "Decommissioned",
        "decommissionedAt": "2025-01-30T00:45:50.654Z"
    }
}
```

---

### 📌 **5️ Trigger Self-Destruct Sequence**
```http
POST /gadgets/{id}/self-destruct
```
#### 📌 **Response**
🔹 **Returns a confirmation code.**
```json
{
  "message": "Confirmation code generated. Re-send the same request with ?code=XXXX",
  "code": "637756"
}
```
```http
POST /gadgets/{id}/self-destruct?code=637756
```
🔹 **Marks the gadget as "Destroyed".**
#### 📌 **Response**
```json
{
  "message": "Gadget successfully Destroyed",
  "gadget": {
    "id": "b00a96ca-73c5-45d2-9a8b-64cac075965c",
    "name": "VR Headset",
    "codeName": "The Merciless",
    "status": "Destroyed",
    "decommissionedAt": "2025-07-20T12:53:30.739Z",
    "userId": "97ba4038-7c9c-44c5-8de5-f0836e07e353",
    "successRate": 71.67
  }
}
```

---

## 🛠️ Project Setup & Installation Guide

### 📦 Prerequisites

Make sure the following tools are installed on your system:

- **Node.js** (v16+ recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (Ensure it's running and accessible)
- **Git**

---

### 🔄 Clone the Repository

```bash
git clone https://github.com/vyshnavdas/gadget-api.git
cd gadget-api
```

---

### 📁 Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add the following (replace with your own credentials):

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/gadgetdb
JWT_SECRET=your_super_secret_key
```

---

### 📦 Install Dependencies

Install both `dependencies` and `devDependencies`:

```bash
npm install
```

---

### 🔧 Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

To apply migrations without creating a new one (e.g., in production):

```bash
npx prisma migrate deploy
```

---

### 🧪 Development

For TypeScript development with live reload (optional):

```bash
npx ts-node-dev src/index.ts
```

---

### 🚀 Build & Start (Production)

#### 1. Compile TypeScript:

```bash
npm run build
```

#### 2. Start the server:

```bash
npm start
```

This runs `dist/index.js` (compiled output).

---

### 📚 API Docs (Swagger)

Once the server is running, access the Swagger UI at:

```
http://localhost:3000/api-docs
```

It includes:

- All endpoints
- Auth headers
- Sample requests/responses

