# Blogs & Posts REST API (h02)

## Description
REST API implemented according to Swagger (OpenAPI) documentation.  
The API provides CRUD operations for **Blogs** and **Posts**, secured with **Basic Authentication**, and uses `express-validator` for input validation.

---

## Authentication
- **Basic Auth**
- Login: `admin`
- Password: `qwerty`
- Required for all CRUD operations except `GET` requests

---

## Endpoints

### Blogs
- **GET** `/ht_02/api/blogs` — get all blogs  
- **POST** `/ht_02/api/blogs` — create a new blog  
- **GET** `/ht_02/api/blogs/{id}` — get blog by id  
- **PUT** `/ht_02/api/blogs/{id}` — update blog by id  
- **DELETE** `/ht_02/api/blogs/{id}` — delete blog by id  

### Posts
- **GET** `/ht_02/api/posts` — get all posts  
- **POST** `/ht_02/api/posts` — create a new post  
- **GET** `/ht_02/api/posts/{id}` — get post by id  
- **PUT** `/ht_02/api/posts/{id}` — update post by id  
- **DELETE** `/ht_02/api/posts/{id}` — delete post by id  

### Testing
- **DELETE** `/ht_02/api/testing/all-data` — clear all data

---

## Validation
- Input validation implemented using **express-validator**
- Validation errors are returned in a unified format
- Each invalid field appears **only once** in `errorsMessages`
  - Using `onlyFirstError: true`
  - Or manual filtering of validation results

Example error response:
```json
{
  "errorsMessages": [
    { "message": "website url is too long", "field": "websiteUrl" },
    { "message": "name is too long", "field": "name" }
  ]
}
