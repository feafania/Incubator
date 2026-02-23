# Blogs, Posts, Users & Comments REST API (h07 - Email Confirmation)

## Description
REST API implemented according to Swagger (OpenAPI) documentation.  
This version adds **email confirmation for user registration**.

⚡ **Focus**: registration flow with confirmation code sent by email, confirmation link, and email resending functionality.

---

## Auth / Registration
- **POST** `/hometask_07/api/auth/registration` — register new user  
  - Sends email with **confirmation code** (`confirmationCode`) and expiration date (`confirmationCodeExpirationDate`)  
  - HTML email contains `<a>` link with `code` query parameter  

- **POST** `/hometask_07/api/auth/registration-confirmation` — confirm registration using code from email  

- **POST** `/hometask_07/api/auth/registration-email-resending` — resend confirmation email  

- **POST** `/hometask_07/api/auth/login` — login user  

- **GET** `/hometask_07/api/auth/me` — get info about current user from JWT / session  

**Note:** Users created by Super Admin (`POST /users`) do **not** require email confirmation; they can log in immediately.

---

## Blogs
- **GET** `/hometask_07/api/blogs` — get blogs with pagination  
- **POST** `/hometask_07/api/blogs` — create blog  
- **GET** `/hometask_07/api/blogs/{blogId}/posts` — get posts for specific blog  
- **POST** `/hometask_07/api/blogs/{blogId}/posts` — create post for blog  
- **GET** `/hometask_07/api/blogs/{id}` — get blog by id  
- **PUT** `/hometask_07/api/blogs/{id}` — update blog  
- **DELETE** `/hometask_07/api/blogs/{id}` — delete blog

### Posts
- **GET** `/hometask_07/api/posts` — get all posts  
- **POST** `/hometask_07/api/posts` — create post  
- **GET** `/hometask_07/api/posts/{id}` — get post by id  
- **PUT** `/hometask_07/api/posts/{id}` — update post  
- **DELETE** `/hometask_07/api/posts/{id}` — delete post

### Comments
- **POST** `/hometask_07/api/posts/{postId}/comments` — create comment  
- **GET** `/hometask_07/api/posts/{postId}/comments` — get comments for post  
- **GET** `/hometask_07/api/comments/{id}` — get comment by id  
- **PUT** `/hometask_07/api/comments/{commentId}` — update comment  
- **DELETE** `/hometask_07/api/comments/{commentId}` — delete comment

---

## Users
- **GET** `/hometask_07/api/users` — list users with pagination, sorting, search  
- **POST** `/hometask_07/api/users` — create user (Super Admin bypasses email confirmation)  
- **DELETE** `/hometask_07/api/users/{id}` — delete user  

---

## Testing
- **DELETE** `/hometask_07/api/testing/all-data` — clear all database data

---

## Features
- Email confirmation for registration with **confirmationCode** and expiration date  
- HTML email with clickable link (`<a href="...?code=...">`)  
- Resend confirmation email functionality  
- Full CRUD for Blogs, Posts, Comments, and Users  
- Super Admin can create users without confirmation  
- JWT-based auth for protected endpoints

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
- Services (BLL)  
- JWT / Bearer Auth  
- Email sending (nodemailer)  
- async/await  
- Swagger (OpenAPI)

---

## Purpose
Demonstrates implementing **email confirmation flow** for user registration in Express.js, handling **confirmation codes**, **resending emails**, and integrating this with JWT authentication for protected resources.
