(function(){
  const imageInput = document.getElementById('imageInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const preview = document.getElementById('preview');
  const result = document.getElementById('result');
  const darkBtn = document.getElementById('darkBtn');

  let selectedFile = null;

  imageInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    selectedFile = f;
    const url = URL.createObjectURL(f);
    preview.src = url;
    preview.style.display = 'block';
  });

  uploadBtn.addEventListener('click', async ()=>{
    if (!selectedFile) { alert('Select an image first'); return; }
    uploadBtn.disabled = true;
    result.textContent = 'Uploading and running OCR...';

    const fd = new FormData();
    fd.append('image', selectedFile);

    try {
      const resp = await fetch('/api/ocr', { method: 'POST', body: fd });
      if (!resp.ok) {
        const err = await resp.json().catch(()=>({ error: 'Unknown' }));
        result.textContent = 'OCR failed: ' + (err.error || JSON.stringify(err));
      } else {
        const data = await resp.json();
        result.textContent = data.text || '(no text found)';
      }
    } catch (e) {
      result.textContent = 'Network or server error: ' + e.message;
    } finally {
      uploadBtn.disabled = false;
    }
  });

  darkBtn.addEventListener('click', ()=>{
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });
})();
