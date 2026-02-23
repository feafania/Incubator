# Videos REST API

## Description
REST API for managing video resources, implemented according to Swagger (OpenAPI) documentation.  
The project demonstrates basic backend development concepts, including CRUD operations and manual input validation.

---

## Endpoints

### Videos
- **GET** `/hometask_01/api/videos` — get all videos  
- **POST** `/hometask_01/api/videos` — create a new video  
- **GET** `/hometask_01/api/videos/{id}` — get video by id  
- **PUT** `/hometask_01/api/videos/{id}` — update video by id  
- **DELETE** `/hometask_01/api/videos/{id}` — delete video by id  

### Testing
- **DELETE** `/hometask_01/api/testing/all-data` — clear all data

---

## Validation
- Manual input validation (no external libraries)
- ISO date format (`new Date().toISOString()`)
- `availableResolutions` must be an array of allowed values:

```text
P144, P240, P360, P480, P720, P1080, P1440, P2160
