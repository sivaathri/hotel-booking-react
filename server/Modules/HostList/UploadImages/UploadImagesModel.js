const db = require("../../../config/db");

class UploadImagesModel {
    static async saveImage(roomId, imagePath) {
        try {
            const query = `
                INSERT INTO room_images (room_id, image_path)
                VALUES (?, ?)
            `;
            
            const [result] = await db.query(query, [roomId, imagePath]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getAllImages() {
        try {
            const query = `
                SELECT * FROM room_images
                ORDER BY created_at DESC
            `;
            
            const [images] = await db.query(query);
            return images;
        } catch (error) {
            throw error;
        }
    }
 
    static async getImagesByRoomId(roomId) {
        try {
            
            const query = `
                SELECT * FROM room_images 
                WHERE room_id = ?
                ORDER BY created_at DESC
            `;
            
            const [images] = await db.query(query, [roomId]);
            return images;
        } catch (error) {
            throw error;
        }
    }

    static async getImageById(imageId) {
        try {
            const query = `
                SELECT * FROM room_images 
                WHERE id = ?
            `;
            
            const [image] = await db.query(query, [imageId]);
            return image[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteImage(imageId) {
        try {
            const query = `
                DELETE FROM room_images 
                WHERE id = ?
            `;
            
            const [result] = await db.query(query, [imageId]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UploadImagesModel; 