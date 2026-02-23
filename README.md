# Blogs, Posts & Users REST API (h05 - Query Repository Focus)

## Description
REST API implemented according to Swagger (OpenAPI) documentation.  
This version introduces **Users entity** with full CRUD operations, pagination, sorting, search, and password hashing flow.  

⚡ **Focus**: All user-related queries and business rules are handled in the **Query Repository / BLL layer**, separating business logic from HTTP controllers and middleware.

---

## Auth
- **POST** `/hometask_05/api/auth/login` — login user  
  - Returns `401` if credentials are invalid  
  - Returns `204` if credentials are valid  
- Passwords are hashed in BLL during user creation

---

## Blogs
- **GET** `/hometask_05/api/blogs` — get blogs with pagination  
- **POST** `/hometask_05/api/blogs` — create new blog  
- **GET** `/hometask_05/api/blogs/{blogId}/posts` — get posts for a specific blog  
- **POST** `/hometask_05/api/blogs/{blogId}/posts` — create post for a specific blog  
- **GET** `/hometask_05/api/blogs/{id}` — get blog by id  
- **PUT** `/hometask_05/api/blogs/{id}` — update blog  
- **DELETE** `/hometask_05/api/blogs/{id}` — delete blog

### Posts
- **GET** `/hometask_05/api/posts` — get all posts with pagination  
- **POST** `/hometask_05/api/posts` — create post  
- **GET** `/hometask_05/api/posts/{id}` — get post by id  
- **PUT** `/hometask_05/api/posts/{id}` — update post  
- **DELETE** `/hometask_05/api/posts/{id}` — delete post

---

## Users
- **GET** `/hometask_05/api/users` — list users with pagination, sorting, and search by login/email  
  - Search is **handled in Query Repository**, allowing flexible substring search (case-insensitive)
- **POST** `/hometask_05/api/users` — add new user  
  - `login` and `email` must be unique — **checked in BLL / Query Repository**, not in middleware  
  - Example error format for duplicate email:

```json
{
  "errorsMessages": [
    {"field": "email", "message": "email should be unique"}
  ]
}
