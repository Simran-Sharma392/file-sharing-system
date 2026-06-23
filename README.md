# Secure File Sharing System

## Overview

A role-based secure file sharing application built using Node.js, Express, MySQL, and Vanilla JavaScript.

The system allows senders to upload files and share them through unique access keys. Receivers can access, preview, and download files while security mechanisms such as password protection, expiry validation, download limits, and file revocation are enforced.

---

## Features

### Authentication & Authorization
- User Registration
- User Login
- JWT Authentication
- Role-Based Access Control (Sender / Receiver)

### File Management
- Upload PDF, PNG, JPG, JPEG, and ZIP files
- Local file storage using Multer
- Unique file key generation using nanoid
- File metadata management

### Security Features
- Optional password protection using bcrypt
- Expiry-based file access
- Manual file revocation
- Download limits
- Access validation before serving files

### File Lifecycle
- ACTIVE
- EXPIRED
- REVOKED

### Receiver Features
- Access files using unique file keys
- File metadata retrieval
- Image preview before download
- Secure file download

### Monitoring & Logging
- Access logging
- Download count tracking
- Scheduled cleanup using node-cron

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Libraries Used
- Multer
- bcrypt
- jsonwebtoken
- nanoid
- node-cron
- cors

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/register | Register user |
| POST | /api/login | Login user |

### Files

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/files | Upload file |
| GET | /api/files | View all files (Receiver) |
| GET | /api/my-files | View sender uploads |
| GET | /api/file/:key | Access file metadata |
| GET | /api/download/:key | Download file |
| PATCH | /api/files/:id/revoke | Revoke file |

---

## Database Tables

### users

- id
- name
- email
- password
- role

### files

- id
- sender_id
- file_name
- description
- category
- expiry
- file_key
- status
- password_hash
- download_count
- max_downloads

### access_logs

- id
- file_id
- ip_address
- access_time

---

## How to Run

### Backend

```bash
npm install
node index.js
```

Server runs on:

```text
http://localhost:5000
```

### Frontend

Open the frontend folder using Live Server.

---

## Learning Outcomes

This project demonstrates:

- JWT Authentication
- Role-Based Authorization
- File Upload Handling with Multer
- Password Hashing with bcrypt
- Secure File Access Control
- File Lifecycle Management
- Audit Logging
- Download Tracking
- Scheduled Tasks using node-cron
- MySQL Database Integration