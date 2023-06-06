const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const storage = new Storage();

const bucketName = 'scan-upload-image'; // Ganti dengan nama bucket Cloud Storage Anda

// Middleware untuk memproses pengunggahan file menggunakan Multer
const upload = multer({ storage: multer.memoryStorage() });

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Endpoint untuk mengunggah file
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const blob = storage.bucket(bucketName).file(file.originalname);

  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true,
    metadata: {
      contentType: file.mimetype
    }
  });

  blobStream.on('error', (err) => {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
    return res.status(200).json({ imageUrl: publicUrl });
  });

  blobStream.end(file.buffer);
});

// Menjalankan server di port tertentu (misalnya 3000)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
