const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const extractor = require('../lib/extractor');

(async () => {
  try {
    const sampleUrl = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
    const resp = await fetch(sampleUrl);
    if (!resp.ok) throw new Error('Failed to download sample image: ' + resp.status);

    const buf = await resp.buffer();
    const tmpPath = path.join(__dirname, 'sample.png');
    fs.writeFileSync(tmpPath, buf);

    console.log('Logging in to get JWT token...');
    const API_URL = process.env.API_URL || 'http://localhost:5001';
    const loginRes = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'inspector', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
      console.error('Login failed, no token received');
      process.exit(5);
    }

    console.log('Uploading sample image to local backend...');
    const ocrResp = await fetch(`${API_URL}/api/ocr`, {
      method: 'POST',
      body: form,
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    if (!ocrResp.ok) {
      console.error('OCR endpoint returned', ocrResp.status);
      process.exit(2);
    }
    const data = await ocrResp.json();
    console.log('OCR response:', data);

    if (!data.text || data.text.trim().length < 10) {
      console.error('OCR result too short — test failed');
      process.exit(3);
    }

    // Run extraction heuristics to ensure it doesn't crash
    const fields = extractor.parseAll(data.text);
    console.log('Extracted fields (expected nulls for generic text):', fields);

    console.log('Integration + extraction test passed.');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();
