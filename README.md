# Blogs & Posts REST API (h03 - MongoDB Migration)

## Description
REST API migrated to **MongoDB** according to Swagger (OpenAPI) documentation.  
The project demonstrates working with asynchronous database operations and adapting the application to a real database.

---

## Migration to MongoDB
The application was refactored from in-memory storage to **MongoDB**.

Main MongoDB methods used:
- `find()`
- `findOne()`
- `insertOne()`
- `insertMany()`
- `updateOne()`
- `updateMany()`
- `deleteOne()`
- `deleteMany()`

All database operations are asynchronous and implemented using **async/await**.

---

## New Properties

### Blog
- `createdAt` — ISO string (`new Date().toISOString()`)
- `isMembership` — always `false` (reserved for future functionality)

### Post
- `createdAt` — ISO string

---

## Endpoints

### Blogs
- **GET** `/hometask_03/api/blogs`
- **POST** `/hometask_03/api/blogs`
- **GET** `/hometask_03/api/blogs/{id}`
- **PUT** `/hometask_03/api/blogs/{id}`
- **DELETE** `/hometask_03/api/blogs/{id}`

### Posts
- **GET** `/hometask_03/api/posts`
- **POST** `/hometask_03/api/posts`
- **GET** `/hometask_03/api/posts/{id}`
- **PUT** `/hometask_03/api/posts/{id}`
- **DELETE** `/hometask_03/api/posts/{id}`

### Testing
- **DELETE** `/hometask_03/api/testing/all-data`

---

## Models
- BlogInputModel
- PostInputModel
- BlogViewModel (h03)
- PostViewModel (h03)
- APIErrorResult / FieldError

---

## Tech Stack
- Node.js
- Express.js
- MongoDB
- async/await
- Swagger (OpenAPI)

---

## Purpose
Practice migrating an API to MongoDB, working with asynchronous database methods, and adapting application architecture to a persistent data layer.
