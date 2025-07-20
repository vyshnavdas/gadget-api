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
- ✅ **Reterive gadgets by their id
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
    "id": "67890",
    "name": "VR Headset",
    "codename": "Code-abc123",
    "status": "Available"
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
🔹 **Marks the gadget as "Destroyed" and returns a confirmation code.**

#### 📌 **Response**
```json
{
    "message": "Self-destruct sequence initiated",
    "confirmationCode": 123456
}
```

---

## 🛠️ **Setup & Installation**
### **1️⃣ Clone the Repository**
```sh
git clone {repo link}
cd IMF
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a **`.env`** file and add:
```ini
PORT=3000
DATABASE_URL=postgres://postgres:sike@localhost:5432/imf_gadgets
```

### **4️⃣ Run the API**
```sh
npm run dev
```
✅ Server will start at **`http://localhost:3000`**.

---

## 🏗️ **Tech Stack**
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Sequelize ORM
- **Hosting:** Render
- **API Documentation:** Postman

---


