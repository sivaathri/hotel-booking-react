const UploadImagesModel = require("./UploadImagesModel");
const path = require("path");
const fs = require("fs");

class UploadImagesController {
    static async uploadRoomImages(req, res) {
        try {
            const { userId, roomId } = req.params;
            const files = req.files;
            
            console.log('Upload request received:', {
                userId,
                roomId,
                filesCount: files ? files.length : 0
            });

            if (!files || files.length === 0) {
                console.log('No files received in request');
                return res.status(400).json({ 
                    success: false,
                    message: "No files uploaded" 
                });
            }

            const imagePaths = [];
            
            for (const file of files) {
                try {
                    console.log('Processing file:', file.originalname);
                    // The file is already saved by multer, we just need to get its path
                    const relativePath = `hostroomimages/${file.filename}`;
                    imagePaths.push(relativePath);
                    console.log('File processed successfully:', relativePath);
                } catch (fileError) {
                    console.error('Error processing file:', fileError);
                    throw new Error(`Failed to process file ${file.originalname}: ${fileError.message}`);
                }
            }

            // Save image paths to database
            if (roomId) {
                console.log('Saving room images for roomId:', roomId);
                await UploadImagesModel.saveRoomImages(roomId, imagePaths);
            } else if (userId) {
                console.log('Saving user images for userId:', userId);
                await UploadImagesModel.saveUserImages(userId, imagePaths);
            }

            res.status(200).json({
                success: true,
                message: "Images uploaded successfully",
                imagePaths
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            res.status(500).json({ 
                success: false,
                message: error.message || "Failed to upload images",
                error: error.message 
            });
        }
    }

    static async getRoomImages(req, res) {
        try {
            const { roomId } = req.params;
            const images = await UploadImagesModel.getRoomImages(roomId);
            res.status(200).json(images);
        } catch (error) {
            console.error("Error fetching room images:", error);
            res.status(500).json({ error: "Failed to fetch room images" });
        }
    }

    static async deleteRoomImage(req, res) {
        try {
            const { imageId } = req.params;
            const image = await UploadImagesModel.getRoomImages(imageId);
            
            if (!image) {
                return res.status(404).json({ error: "Image not found" });
            }

            // Delete file from server
            const filePath = path.join(__dirname, "../../../assets", image.image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Delete from database
            await UploadImagesModel.deleteRoomImage(imageId);

            res.status(200).json({ message: "Image deleted successfully" });
        } catch (error) {
            console.error("Error deleting image:", error);
            res.status(500).json({ error: "Failed to delete image" });
        }
    }
}

module.exports = UploadImagesController; 