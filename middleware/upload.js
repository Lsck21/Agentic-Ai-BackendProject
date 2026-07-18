const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    console.log("Checking file:", file.originalname);

    const allowedTypes = [".jpg", ".jpeg", ".png"];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        console.log("✅ Allowed");
        cb(null, true);
    } else {
        console.log("❌ Rejected");
        cb(new Error("Only JPG, JPEG and PNG files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

module.exports = upload;