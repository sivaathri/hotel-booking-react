const express = require("express");
const router = express.Router();
const UploadImagesController = require("./UploadImagesController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "../../../assets/hostroomimages");
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 20 // Maximum number of files
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            console.log('Invalid file type:', file.mimetype);
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    } else if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Routes
router.post("/user/:userId", upload.array('images', 20), handleUploadError, UploadImagesController.uploadRoomImages);
router.post("/room/:roomId", upload.array('images', 20), handleUploadError, UploadImagesController.uploadRoomImages);
router.get("/images/:roomId", UploadImagesController.getRoomImages);
router.delete("/:imageId", UploadImagesController.deleteRoomImage);

module.exports = router; 