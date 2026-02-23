# Blogs, Posts, Comments REST API (h12 - DDD & Likes for Posts)

## Description
Backend implemented according to Swagger (OpenAPI) documentation.  

Focus of this task:  
- **Domain-Driven Design (DDD)** approach: clear domain layer separation  
- **Likes/Dislikes for Posts**, including **last 3 likes** per post  
- Field `myStatus` tracks the current user's reaction to a post  
- AccessToken lifetime increased to 5–10 min for realistic testing  
- All previous features from h11 maintained: Blogs, Posts, Comments, Users, Devices  

---

## Auth Features
- **POST** `/hometask_12/api/auth/login` — login user (JWT + refreshToken)  
- **POST** `/hometask_12/api/auth/password-recovery` — password recovery via email  
- **POST** `/hometask_12/api/auth/new-password` — confirm password recovery  
- **POST** `/hometask_12/api/auth/refresh-token` — refresh JWT tokens, update device LastActiveDate  
- **POST** `/hometask_12/api/auth/registration` — register user (email confirmation)  
- **POST** `/hometask_12/api/auth/registration-confirmation` — confirm registration  
- **POST** `/hometask_12/api/auth/registration-email-resending` — resend confirmation email  
- **POST** `/hometask_12/api/auth/logout` — logout user  
- **GET** `/hometask_12/api/auth/me` — get info about current user  

### Security Devices
- **GET** `/hometask_12/api/security/devices` — list active sessions  
- **DELETE** `/hometask_12/api/security/devices` — terminate all other sessions  
- **DELETE** `/hometask_12/api/security/devices/{deviceId}` — terminate specific session  

---

## Blogs & Posts
- CRUD operations with pagination, sorting, and search  
- Posts belong to blogs  
- **PUT** `/hometask_12/api/posts/{postId}/like-status` — like/unlike/dislike/undislike posts  
- GET posts include `myStatus` and `extendedLikesInfo` (last 3 likes)  

### Example: Post Like Schema
```ts
interface LikeDetailsViewModel {
  addedAt: string;        // ISO date
  userId: string;
  login: string;
}

interface ExtendedLikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Like' | 'Dislike';
  newestLikes: LikeDetailsViewModel[]; // last 3 likes
}
