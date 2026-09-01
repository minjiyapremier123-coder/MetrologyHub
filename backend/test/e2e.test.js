const fetch = require('node-fetch');
const FormData = require('form-data');

(async () => {
  try {
    const fs = require('fs');
    const path = require('path');
    const samplePath = path.join(__dirname, 'assets', 'sample_label.png');

    const form = new FormData();
    let useImage = false;
    if (fs.existsSync(samplePath)) {
      console.log('Uploading committed sample image:', samplePath);
      form.append('image', fs.createReadStream(samplePath));
      useImage = true;
    } else {
      // fallback to test mode text injection
      const sampleText = `MRP: Rs. 99\nNet Weight: 100 g\nMfg. by: TestCo Pvt Ltd\nMfg Date: Jan 2022`;
      form.append('text', sampleText);
      console.log('Committed sample image not found; using TEST_MODE text injection');
    }

    const headers = {};
    if (!useImage) headers['X-Test-Mode'] = '1';

    console.log('Posting to /api/ocr for e2e test');
    const resp = await fetch('http://localhost:5000/api/ocr', { method: 'POST', body: form, headers });
    if (!resp.ok) {
      console.error('E2E POST failed:', resp.status);
      process.exit(2);
    }
    const data = await resp.json();
    console.log('E2E OCR response:', data);

    // Validate extracted fields
    if (!data.fields) {
      console.error('No fields returned');
      process.exit(3);
    }

    // If an expected JSON exists, use it for strict validation
    const expectedPath = path.join(__dirname, 'assets', 'sample_label.json');
    if (fs.existsSync(expectedPath)) {
      const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
      console.log('Comparing against expected JSON:', expectedPath);
      const diffs = [];
      if ((data.fields.mrp || '') !== (expected.mrp || '')) diffs.push(`mrp expected=${expected.mrp} actual=${data.fields.mrp}`);
      if ((data.fields.net_quantity || '').toLowerCase() !== (expected.net_quantity || '').toLowerCase()) diffs.push(`net_quantity expected=${expected.net_quantity} actual=${data.fields.net_quantity}`);
      if (!((data.fields.manufacturer||'').toLowerCase().includes((expected.manufacturer||'').toLowerCase()))) diffs.push(`manufacturer expected to include ${expected.manufacturer} actual=${data.fields.manufacturer}`);
      if (!((data.fields.month_year||'').toLowerCase().includes((expected.month_year||'').toLowerCase()))) diffs.push(`month_year expected=${expected.month_year} actual=${data.fields.month_year}`);
      if (diffs.length > 0) {
        console.error('E2E mismatches:\n', diffs.join('\n'));
        process.exit(8);
      }
      console.log('E2E test passed against expected JSON');
    } else {
      // fallback simple checks
      const { mrp, net_quantity, manufacturer, month_year } = data.fields;
      if (!mrp) { console.error('MRP not detected'); process.exit(4); }
      if (!net_quantity) { console.error('Net quantity not detected'); process.exit(5); }
      if (!manufacturer) { console.error('Manufacturer not detected'); process.exit(6); }
      if (!month_year) { console.error('Month/Year not detected'); process.exit(7); }
      console.log('E2E test passed (fallback checks)');
    }

    process.exit(0);
  } catch (err) {
    console.error('E2E test error:', err);
    process.exit(1);
  }
})();
