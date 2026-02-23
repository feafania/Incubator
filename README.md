# Blogs, Posts, Users & Comments REST API (h06 - JWT Authentication)

## Description
REST API implemented according to Swagger (OpenAPI) documentation.  
This version introduces **JWT-based authentication**, allowing users to log in, receive `accessToken`, and perform authorized actions on comments.

⚡ **Focus**: JWT auth, Bearer token for comment operations, and current user info endpoint.

---

## Auth
- **POST** `/hometask_06/api/auth/login` — login user and return JWT `accessToken`  
- **GET** `/hometask_06/api/auth/me` — get current user info from `accessToken`  

**JWT**:
- Standard: header.payload.signature  
- Used for Bearer auth in requests for creating/updating/deleting comments

---

## Blogs
- **GET** `/hometask_06/api/blogs` — get blogs with pagination  
- **POST** `/hometask_06/api/blogs` — create new blog  
- **GET** `/hometask_06/api/blogs/{blogId}/posts` — get posts for specific blog  
- **POST** `/hometask_06/api/blogs/{blogId}/posts` — create post for specific blog  
- **GET** `/hometask_06/api/blogs/{id}` — get blog by id  
- **PUT** `/hometask_06/api/blogs/{id}` — update blog  
- **DELETE** `/hometask_06/api/blogs/{id}` — delete blog

### Posts
- **GET** `/hometask_06/api/posts` — get all posts  
- **POST** `/hometask_06/api/posts` — create post  
- **GET** `/hometask_06/api/posts/{id}` — get post by id  
- **PUT** `/hometask_06/api/posts/{id}` — update post  
- **DELETE** `/hometask_06/api/posts/{id}` — delete post

### Comments (Bearer Auth required)
- **POST** `/hometask_06/api/posts/{postId}/comments` — create comment  
- **GET** `/hometask_06/api/posts/{postId}/comments` — get comments for a post  
- **GET** `/hometask_06/api/comments/{id}` — get comment by id  
- **PUT** `/hometask_06/api/comments/{commentId}` — update comment by id  
- **DELETE** `/hometask_06/api/comments/{commentId}` — delete comment by id

---

## Users
- **GET** `/hometask_06/api/users` — list users with pagination, sorting, and search  
- **POST** `/hometask_06/api/users` — add new user  
- **DELETE** `/hometask_06/api/users/{id}` — delete user by id

---

## Testing
- **DELETE** `/hometask_06/api/testing/all-data` — clear all database data

---

## Features
- JWT-based authentication for secure API access  
- `Bearer` token required for creating/updating/deleting comments  
- Endpoint `/auth/me` returns info about the current user  
- Full CRUD for Blogs, Posts, Users, and Comments  
- Pagination, Sorting, and Search functionality for all lists

---

## Models
- BlogInputModel / BlogPostInputModel / BlogViewModel (h03)  
- PostInputModel / PostViewModel (h03)  
- UserInputModel / UserViewModel (h05)  
- CommentInputModel / CommentViewModel / CommentatorInfo (h06)  
- LoginInputModel / LoginSuccessViewModel  
- MeViewModel  
- APIErrorResult / FieldError  
- Paginator\<BlogViewModel\> / Paginator\<PostViewModel\> / Paginator\<UserViewModel\> / Paginator\<CommentViewModel\>  
- SortDirections (h04)

---

## Tech Stack
- Node.js  
- Express.js  
- MongoDB  
- JWT (RFC 7519)  
- Services (BLL)  
- async/await  
- Swagger (OpenAPI)

---

## Purpose
Demonstrates implementing **JWT authentication** and **Bearer authorization** in Express.js for protected resources, alongside full CRUD operations and comment management.
