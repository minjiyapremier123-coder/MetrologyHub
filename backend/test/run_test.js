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

    const form = new FormData();
    form.append('image', fs.createReadStream(tmpPath));

    console.log('Uploading sample image to local backend...');
    const ocrResp = await fetch('http://localhost:5000/api/ocr', { method: 'POST', body: form });
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

    // Run extraction heuristics and assert at least one field found
    const fields = extractor.parseAll(data.text);
    console.log('Extracted fields:', fields);
    const found = Object.values(fields).some(v => v !== null && v !== undefined);
    if (!found) {
      console.error('No fields extracted — test failed');
      process.exit(4);
    }

    console.log('Integration + extraction test passed.');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();
