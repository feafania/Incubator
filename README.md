# Blogs, Posts, Users & Comments REST API (h08 - JWT + Refresh Token)

## Description
REST API implemented according to Swagger (OpenAPI) documentation.  
This version introduces **full JWT authentication flow with refresh tokens stored in cookies**.

⚡ **Focus**: accessToken in body, refreshToken in cookie, token refresh, and logout functionality.

---

## Auth
- **POST** `/hometask_08/api/auth/login` — login user  
  - Returns `accessToken` in response body  
  - Sets `refreshToken` in **httpOnly cookie**  
  - Cookie lifetime and settings according to spec

- **POST** `/hometask_08/api/auth/refresh-token` — refresh token  
  - Client sends `refreshToken` cookie  
  - Returns new pair of `accessToken` + `refreshToken`  
  - Old refreshToken is revoked

- **POST** `/hometask_08/api/auth/logout` — logout user  
  - `refreshToken` in cookie is revoked  

- **POST** `/hometask_08/api/auth/registration` — register user  
- **POST** `/hometask_08/api/auth/registration-confirmation` — confirm registration  
- **POST** `/hometask_08/api/auth/registration-email-resending` — resend registration email  

- **GET** `/hometask_08/api/auth/me` — get current user info (requires accessToken)

---

## Blogs
- **GET** `/hometask_08/api/blogs` — get blogs with pagination  
- **POST** `/hometask_08/api/blogs` — create blog  
- **GET** `/hometask_08/api/blogs/{blogId}/posts` — get posts for blog  
- **POST** `/hometask_08/api/blogs/{blogId}/posts` — create post for blog  
- **GET** `/hometask_08/api/blogs/{id}` — get blog by id  
- **PUT** `/hometask_08/api/blogs/{id}` — update blog  
- **DELETE** `/hometask_08/api/blogs/{id}` — delete blog

### Posts
- **GET** `/hometask_08/api/posts` — get all posts  
- **POST** `/hometask_08/api/posts` — create post  
- **GET** `/hometask_08/api/posts/{id}` — get post by id  
- **PUT** `/hometask_08/api/posts/{id}` — update post  
- **DELETE** `/hometask_08/api/posts/{id}` — delete post

### Comments
- **POST** `/hometask_08/api/posts/{postId}/comments` — create comment (requires JWT)  
- **GET** `/hometask_08/api/posts/{postId}/comments` — get comments for post  
- **GET** `/hometask_08/api/comments/{id}` — get comment by id  
- **PUT** `/hometask_08/api/comments/{commentId}` — update comment  
- **DELETE** `/hometask_08/api/comments/{commentId}` — delete comment

---

## Users
- **GET** `/hometask_08/api/users` — list users with pagination, sorting, search  
- **POST** `/hometask_08/api/users` — add new user  
- **DELETE** `/hometask_08/api/users/{id}` — delete user  

---

## Testing
- **DELETE** `/hometask_08/api/testing/all-data` — clear database

---

## Features
- JWT authentication with **accessToken + refreshToken**  
- `refreshToken` stored in **httpOnly cookie**  
- Refresh flow revokes old token  
- Logout revokes refreshToken  
- Full CRUD for Blogs, Posts, Comments, Users  
- Pagination, Sorting, and Search

---

## Models
- BlogInputModel / BlogPostInputModel / BlogViewModel (h03)  
- PostInputModel / PostViewModel (h03)  
- UserInputModel / UserViewModel (h05)  
- CommentInputModel / CommentViewModel / CommentatorInfo (h06)  
- LoginInputModel / LoginSuccessViewModel / MeViewModel  
- RegistrationConfirmationCodeModel / RegistrationEmailResending (h07)  
- APIErrorResult / FieldError  
- Paginator\<BlogViewModel\> / Paginator\<PostViewModel\> / Paginator\<UserViewModel\> / Paginator\<CommentViewModel\>  
- SortDirections (h04)

---

## Tech Stack
- Node.js  
- Express.js  
- MongoDB  
- JWT / Refresh Token in cookies  
- Services (BLL)  
- async/await  
- Swagger (OpenAPI)

---

## Purpose
Demonstrates implementing **JWT authentication with refresh tokens in cookies**, secure logout, and token rotation for maintaining session integrity in a scalable Express.js application.
