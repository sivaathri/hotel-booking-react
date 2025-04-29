const db = require("../../../config/db");

class UploadImagesModel {
    static async saveRoomImages(roomId, imagePaths) {
        try {
            const query = `
                INSERT INTO room_images (room_id, image_path)
                VALUES ?
            `;
            
            const values = imagePaths.map(path => [roomId, path]);
            
            const [result] = await db.query(query, [values]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getRoomImages(roomId) {
        try {
            const query = `
                SELECT image_path 
                FROM room_images 
                WHERE room_id = ?
            `;
            
            const [images] = await db.query(query, [roomId]);
            return images;
        } catch (error) {
            throw error;
        }
    }

    static async deleteRoomImage(imageId) {
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

    static async saveUserImages(userId, imagePaths) {
        try {
            console.log('Saving user images:', { userId, imagePaths });
            
            // Check if user_images table exists
            const checkTableQuery = `
                SELECT COUNT(*) as count FROM information_schema.tables 
                WHERE table_schema = DATABASE() AND table_name = 'user_images'
            `;
            const [tableCheck] = await db.query(checkTableQuery);
            
            if (tableCheck[0].count === 0) {
                console.log('Creating user_images table');
                const createTableQuery = `
                    CREATE TABLE user_images (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        image_path VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id)
                    )
                `;
                await db.query(createTableQuery);
            }

            const query = `
                INSERT INTO user_images (user_id, image_path)
                VALUES ?
            `;
            
            const values = imagePaths.map(path => [userId, path]);
            console.log('Inserting values:', values);
            
            const [result] = await db.query(query, [values]);
            console.log('Insert result:', result);
            
            return result;
        } catch (error) {
            console.error('Error in saveUserImages:', error);
            throw error;
        }
    }
}

module.exports = UploadImagesModel; 