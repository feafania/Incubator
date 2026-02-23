# Blogs, Posts, Comments REST API (h11 - Mongoose & Likes for Comments)

## Description
Backend implemented according to Swagger (OpenAPI) documentation.  

Focus of this task:  
- **Mongoose models** for all entities (Blogs, Posts, Comments, Users, Devices)  
- **Likes/Dislikes for Comments**  
- Field `myStatus` tracks the current user's reaction to a comment  
- Proper JWT usage (accessToken lifetime 5-10 min for realistic scenarios)  

---

## Auth Features
- **POST** `/hometask_11/api/auth/login` — login user (JWT + refreshToken)  
- **POST** `/hometask_11/api/auth/password-recovery` — password recovery via email  
- **POST** `/hometask_11/api/auth/new-password` — confirm password recovery  
- **POST** `/hometask_11/api/auth/refresh-token` — refresh JWT tokens, update device LastActiveDate  
- **POST** `/hometask_11/api/auth/registration` — register user (email confirmation)  
- **POST** `/hometask_11/api/auth/registration-confirmation` — confirm registration  
- **POST** `/hometask_11/api/auth/registration-email-resending` — resend confirmation email  
- **POST** `/hometask_11/api/auth/logout` — logout user  
- **GET** `/hometask_11/api/auth/me` — get info about current user  

### Security Devices
- **GET** `/hometask_11/api/security/devices` — list active sessions  
- **DELETE** `/hometask_11/api/security/devices` — terminate all other sessions  
- **DELETE** `/hometask_11/api/security/devices/{deviceId}` — terminate specific session  

---

## Blogs & Posts
- CRUD operations with pagination, sorting, and search  
- Posts belong to blogs  
- Standard endpoints for GET, POST, PUT, DELETE  

---

## Comments & Likes
- **PUT** `/hometask_11/api/comments/{commentId}/like-status`  
  - Like/Unlike/Dislike/Undislike operations  
  - `myStatus` tracks the current user’s reaction  
  - If the user sets the same status as before, counts do not change  
- Comments are linked to posts  
- GET comments include `myStatus` for the requesting user (requires valid accessToken)

---

## Users
- GET / POST / DELETE — standard CRUD  
- Pagination, sorting, search (login/email)  

---

## Mongoose Models
Implemented via **Mongoose** with proper schemas:  

- BlogModel / BlogViewModel  
- PostModel / PostViewModel  
- CommentModel / CommentViewModel / CommentatorInfo  
- UserModel / UserViewModel / LoginInputModel / LoginSuccessViewModel / MeViewModel  
- DeviceModel / DeviceViewModel  
- PasswordRecoveryInputModel / NewPasswordRecoveryInputModel  
- LikeInputModel / LikeStatus / LikesInfoViewModel  

### Example Schema (Comment)
```ts
import { Schema, model, Types } from 'mongoose';

const CommentSchema = new Schema({
  content: { type: String, required: true },
  postId: { type: Types.ObjectId, ref: 'Post', required: true },
  commentatorInfo: {
    userId: { type: Types.ObjectId, required: true },
    userLogin: { type: String, required: true }
  },
  createdAt: { type: Date, default: () => new Date().toISOString() },
  likesInfo: {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    myStatus: { type: String, enum: ['None', 'Like', 'Dislike'], default: 'None' }
  }
});

export const CommentModel = model('Comment', CommentSchema);
