const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();

// Enable CORS middleware
app.use(cors());

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
  },
});

// Create multer instance with storage configuration
const upload = multer({ storage: storage });

// Endpoint to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  // Access uploaded file information via req.file
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Construct the URL to access the uploaded file
  const fileUrl = `${req.protocol}://${req.get("host")}/public/uploads/${
    req.file.filename
  }`;

  // Send JSON response with file URL and filename
  res.json({ url: fileUrl, filename: req.file.filename });
});

app.get("/", (req, res) => {
  res.send("hello world!");
});

// Serve static files from the 'uploads' directory
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
