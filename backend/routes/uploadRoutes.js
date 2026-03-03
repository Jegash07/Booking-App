const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Define storage for the images using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Files are uploaded into the 'public/uploads' folder natively mapped onto backend domain
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        // Creating unique filename logically using date abstract
        cb(null, `poster-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Defining filter abstractions ensuring only accepted images pass natively
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Images only!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB Upload max
});

// @desc    Upload movie poster
// @route   POST /api/upload
// @access  Public / Configured for Admin
router.post('/', upload.single('image'), (req, res) => {
    if (req.file) {
        // Generate native URL for the local hosted file
        res.json({
            message: 'Image Uploaded successfully!',
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        });
    } else {
        res.status(400).json({ message: 'No image uploaded natively' });
    }
});

module.exports = router;
