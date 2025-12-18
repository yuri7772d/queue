# Queue — Room Queue Management System

## Overview
ระบบจัดการคิวสำหรับการใช้งานห้อง  
รองรับการสร้างคิว เรียกคิว จัดการสถานะ และแนบไฟล์  
ออกแบบโดยเน้น **Scalability, Maintainability และ Clean Architecture**

---

## Tech Stack
- **Backend:** Node.js
- **Frontend:** Nuxt.js
- **Architecture:** Clean Architecture
- **Container:** Docker
- **CI/CD:** CI Pipeline
- **Testing:** Unit Test
- **Features:** Queue Management, File Upload

---

## Key Features
- ระบบคิวใช้งานห้อง
- แนบไฟล์ประกอบคิว
- โครงสร้างแบบ Clean Architecture
- มี Unit Test สำหรับ core logic
- รองรับ CI/CD และ Docker สำหรับ production

---

## How to Run

### Run on Docker
```bash
# phpmyadim + mysql
docker compose up -d

# phpmyadim + mysql + backend
docker compose up -d --profile backend

# phpmyadim + mysql + backend + frontend
docker compose up -d --profile production
```
### Run test
```bash

cd backend

npm run dev
```
---
## How to create project
หัวข้อนี้จัดทำขึ้นเพื่อให้ผู้ที่สนใจสามารถ
**สร้างโปรเจกต์ลักษณะเดียวกันได้ด้วยตนเอง**
### Backend Setup (Node.js + Express)
```bash
npm init -y

npm install express
npm install express-validator
npm install cookie-parser
npm install jsonwebtoken
npm install mysql2
npm install multer
npm install dotenv

# Development tools
npm install -D nodemon

```
### Frontend Setup (Nuxt.js)
```bash
npm create nuxt@latest frontend
cd frontend

# Add Tailwind CSS with auto config
npx nuxi module add tailwindcss

```

