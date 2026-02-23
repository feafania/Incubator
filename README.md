# Blogs & Posts REST API (h04 - Business Logic & Pagination)

## Description
REST API with **Business Logic Layer (Services)**, Pagination, Sorting, and Search functionality.  
Implemented according to Swagger (OpenAPI) documentation.

This version introduces:
- **BLL (Services layer)** for clean separation of business logic from HTTP controllers  
- **Pagination with sorting** for blogs and posts  
- **SearchNameTerm**: case-insensitive search by substring for blogs  
- **New endpoints** for creating and fetching posts for a specific blog

---

## Endpoints

### Blogs
- **GET** `/hometask_04/api/blogs` — get blogs with pagination, sorting, and optional search (`SearchNameTerm`)  
- **POST** `/hometask_04/api/blogs` — create a new blog  
- **GET** `/hometask_04/api/blogs/{id}` — get blog by id  
- **PUT** `/hometask_04/api/blogs/{id}` — update blog by id  
- **DELETE** `/hometask_04/api/blogs/{id}` — delete blog by id  

### Posts for a specific blog
- **GET** `/hometask_04/api/blogs/{blogId}/posts` — get posts for a specific blog with pagination  
- **POST** `/hometask_04/api/blogs/{blogId}/posts` — create a post for a specific blog  

### Posts
- **GET** `/hometask_04/api/posts` — get all posts with pagination  
- **POST** `/hometask_04/api/posts` — create a new post  
- **GET** `/hometask_04/api/posts/{id}` — get post by id  
- **PUT** `/hometask_04/api/posts/{id}` — update post by id  
- **DELETE** `/hometask_04/api/posts/{id}` — delete post by id  

### Testing
- **DELETE** `/hometask_04/api/testing/all-data` — clear all data

---

## Features

### Business Logic Layer (Services)
- Handles data processing, database interaction, and API logic  
- Keeps controllers clean and focused on HTTP requests  
- Located in `application/` folder per feature for scalability  

### Pagination & Sorting
- Return paged results for blogs and posts  
- Sort by name, createdAt, or other fields  
- Meta info includes total count, page size, and current page

### Search
- `SearchNameTerm` allows case-insensitive substring search for blogs  
- Example: `SearchNameTerm=va` returns blogs "Ivan", "DiVan", "JanClod Vandam"

---

## Models
- BlogInputModel / BlogPostInputModel  
- PostInputModel  
- BlogViewModel / PostViewModel (h03)  
- Paginator\<BlogViewModel\> / Paginator\<PostViewModel\>  
- APIErrorResult / FieldError  
- SortDirections (h04)

---

## Tech Stack
- Node.js  
- Express.js  
- MongoDB  
- Services (BLL)  
- async/await  
- Swagger (OpenAPI)

---

## Purpose
Practice building **scalable backend architecture** using services, implement **pagination, sorting, search**, and enhance API for blog-post relationships.
