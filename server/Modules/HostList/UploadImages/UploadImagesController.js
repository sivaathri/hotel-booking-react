const UploadImagesModel = require("./UploadImagesModel");
const path = require("path");
const fs = require("fs");

class UploadImagesController {
    static async uploadImage(req, res) {
        try {
            const { roomId } = req.params;
            const file = req.file;
            
            if (!file) {
                return res.status(400).json({ 
                    success: false,
                    message: "No file uploaded" 
                });
            }

            const imagePath = `hostroomimages/${file.filename}`;
            
            // Save to database
            await UploadImagesModel.saveImage(roomId, imagePath);

            res.status(200).json({
                success: true,
                message: "Image uploaded successfully",
                data: {
                    imagePath,
                    roomId
                }
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({ 
                success: false,
                message: error.message || "Failed to upload image"
            });
        }
    }

    static async getAllImages(req, res) {
        try {
            const images = await UploadImagesModel.getAllImages();
            
            if (!images || images.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: "No images found" 
                });
            }

            res.status(200).json({
                success: true,
                data: images
            });
        } catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).json({ 
                success: false,
                message: "Failed to fetch images" 
            });
        }
    }

    static async getImagesByRoomId(req, res) {
        try {
            const { roomId } = req.params;
            const images = await UploadImagesModel.getImagesByRoomId(roomId);
            
            if (!images || images.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: "No images found for this room" 
                });
            }

            res.status(200).json({
                success: true,
                data: images
            });
        } catch (error) {
            console.error("Error fetching room images:", error);
            res.status(500).json({ 
                success: false,
                message: "Failed to fetch room images" 
            });
        }
    }

    static async deleteImage(req, res) {
        try {
            const { imageId } = req.params;
            
            // Get image details before deletion
            const image = await UploadImagesModel.getImageById(imageId);
            
            if (!image) {
                return res.status(404).json({ 
                    success: false,
                    message: "Image not found" 
                });
            }

            // Delete file from server
            const filePath = path.join(__dirname, "../../../assets", image.image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Delete from database
            await UploadImagesModel.deleteImage(imageId);

            res.status(200).json({
                success: true,
                message: "Image deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting image:", error);
            res.status(500).json({ 
                success: false,
                message: "Failed to delete image" 
            });
        }
    }
}

module.exports = UploadImagesController; 