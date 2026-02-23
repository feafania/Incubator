# Blogs, Posts, Users & Comments REST API (h10 - Classes & DI)

## Description
REST API implemented according to Swagger (OpenAPI) documentation.  

This version introduces **TypeScript classes** and **Dependency Injection (DI)** for better structure, testability, and maintainability.

> Two main branches:
> 1. **Classes** - refactoring the codebase to TypeScript classes 

---

## Auth Features
- **POST** `/hometask_10/api/auth/login` — login user (JWT + refreshToken)  
- **POST** `/hometask_10/api/auth/password-recovery` — password recovery via email  
  - Email contains `recoveryCode` link  
  - Example:  
    ```html
    <h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
       <a href='https://somesite.com/password-recovery?recoveryCode=your_recovery_code'>recovery password</a>
    </p>
    ```
- **POST** `/hometask_10/api/auth/new-password` — confirm password recovery  
- **POST** `/hometask_10/api/auth/refresh-token` — refresh JWT tokens, update device LastActiveDate  
- **POST** `/hometask_10/api/auth/registration` — register user (email confirmation)  
- **POST** `/hometask_10/api/auth/registration-confirmation` — confirm registration  
- **POST** `/hometask_10/api/auth/registration-email-resending` — resend confirmation email  
- **POST** `/hometask_10/api/auth/logout` — logout user  
- **GET** `/hometask_10/api/auth/me` — get info about current user  

### Security Devices
- **GET** `/hometask_10/api/security/devices` — list active sessions  
- **DELETE** `/hometask_10/api/security/devices` — terminate all other sessions  
- **DELETE** `/hometask_10/api/security/devices/{deviceId}` — terminate specific session  

---

## Blogs
- GET / POST / PUT / DELETE / posts per blog — standard CRUD operations with pagination and sorting  

### Posts & Comments
- CRUD operations for posts and comments  
- Comments are protected with JWT (Bearer auth)

---

## Users
- GET / POST / DELETE — user management  
- Pagination, sorting, search (login/email)  

---

## Classes Branch (branch: `h10-classes`)
- Refactored project using **TypeScript classes**  
- Services, controllers, repositories are implemented as classes  
- Promotes **single responsibility principle**  
- Easier unit testing and code reuse

### Example
```ts
class UserService {
  constructor(private userRepository: UserRepository) {}
  async createUser(input: UserInputModel) { ... }
}
