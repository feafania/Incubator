# Blogs, Posts, Users & Comments REST API (h09 - Sessions / Security Devices)

## Description
REST API implemented according to Swagger (OpenAPI) documentation.  
This version introduces **multi-device sessions (Security Devices)** and session management for logged-in users.

⚡ **Focus**: device-aware JWT refresh tokens, session tracking, logout from other sessions, and limiting login attempts.

---

## Auth
- **POST** `/hometask_09/api/auth/login` — login user  
  - Returns `accessToken` in response body  
  - Sets `refreshToken` in **httpOnly cookie**  
  - Stores `deviceId` and `user-agent` in refreshToken payload  
  - Updates `LastActiveDate` for device on refresh

- **POST** `/hometask_09/api/auth/refresh-token` — refresh token  
  - Client sends `refreshToken` cookie  
  - Returns new accessToken + refreshToken  
  - Old refreshToken is revoked  
  - Updates device `LastActiveDate`

- **POST** `/hometask_09/api/auth/logout` — logout user  
  - `refreshToken` cookie is revoked  

- **GET** `/hometask_09/api/auth/me` — get current user info  

- **POST** `/hometask_09/api/auth/registration` — register user (email confirmation)  
- **POST** `/hometask_09/api/auth/registration-confirmation` — confirm registration  
- **POST** `/hometask_09/api/auth/registration-email-resending` — resend confirmation email  

### Security Devices Endpoints
- **GET** `/hometask_09/api/security/devices` — get all active sessions for current user  
- **DELETE** `/hometask_09/api/security/devices` — terminate all other sessions except current  
- **DELETE** `/hometask_09/api/security/devices/{deviceId}` — terminate specific session  

**Note:**  
- `deviceId` is stored in refreshToken payload  
- Session title is taken from `user-agent` on login  
- Expired refreshTokens are periodically cleaned from database  
- Rate limiting applied on auth endpoints (HTTP 429)

---

## Blogs
- **GET** `/hometask_09/api/blogs` — get blogs with pagination  
- **POST** `/hometask_09/api/blogs` — create blog  
- **GET** `/hometask_09/api/blogs/{blogId}/posts` — get posts for blog  
- **POST** `/hometask_09/api/blogs/{blogId}/posts` — create post for blog  
- **GET** `/hometask_09/api/blogs/{id}` — get blog by id  
- **PUT** `/hometask_09/api/blogs/{id}` — update blog  
- **DELETE** `/hometask_09/api/blogs/{id}` — delete blog

### Posts
- **GET** `/hometask_09/api/posts` — get all posts  
- **POST** `/hometask_09/api/posts` — create post  
- **GET** `/hometask_09/api/posts/{id}` — get post by id  
- **PUT** `/hometask_09/api/posts/{id}` — update post  
- **DELETE** `/hometask_09/api/posts/{id}` — delete post

### Comments
- **POST** `/hometask_09/api/posts/{postId}/comments` — create comment (JWT protected)  
- **GET** `/hometask_09/api/posts/{postId}/comments` — get comments for post  
- **GET** `/hometask_09/api/comments/{id}` — get comment by id  
- **PUT** `/hometask_09/api/comments/{commentId}` — update comment  
- **DELETE** `/hometask_09/api/comments/{commentId}` — delete comment

---

## Users
- **GET** `/hometask_09/api/users` — list users with pagination, sorting, search  
- **POST** `/hometask_09/api/users` — add new user  
- **DELETE** `/hometask_09/api/users/{id}` — delete user  

---

## Testing
- **DELETE** `/hometask_09/api/testing/all-data` — clear database

---

## Features
- Multi-device sessions (Security Devices)  
- JWT refresh tokens linked to deviceId and user-agent  
- List active sessions, terminate one or all other sessions  
- Rate limiting on login (HTTP 429)  
- Full CRUD for Blogs, Posts, Comments, Users  
- Email-confirmation for registration  
- Pagination, Sorting, and Search  

---

## Models
- DeviceViewModel (h09)  
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
- JWT + RefreshToken per device  
- Services (BLL)  
- Rate limiting  
- async/await  
- Swagger (OpenAPI)

---

## Purpose
Implements **multi-device session management** with JWT refresh tokens per device, session listing, selective logout, and rate-limiting for authentication in a scalable Express.js backend.
