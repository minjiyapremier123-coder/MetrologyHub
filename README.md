# Legal Metrology OCR — PoC

This repository contains a minimal proof-of-concept that accepts an image of a packaged commodity label and returns OCR text.

Structure:
- backend/: Express server (POST /api/ocr) using tesseract.js
- frontend/: Minimal PWA that uploads an image and displays OCR results
- docker-compose.yml: brings up frontend (nginx) and backend
- .github/workflows/ci.yml: basic CI workflow

Quick start (local, requires Docker):

1. From repo root:
   docker-compose up --build

2. Open http://localhost:3000 and upload an image.

Notes:
- This is a PoC. For production, add authentication, validation, robust error handling, model caching, and proper traineddata management for tesseract.js.
- The backend currently removes uploaded images after OCR; change behavior if you need to keep evidence.

