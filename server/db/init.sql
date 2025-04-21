-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS hotel_booking;

-- Use the database
USE hotel_booking;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(15),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Insert sample data for hotels
INSERT INTO hotels (name, description, location, price_per_night, rating, image_url) VALUES
('Grand Hotel', 'Luxury hotel with ocean view', 'Beach Road, Miami', 299.99, 4.5, 'https://example.com/hotel1.jpg'),
('Mountain View Resort', 'Scenic mountain resort with spa', 'Mountain Valley, Colorado', 199.99, 4.2, 'https://example.com/hotel2.jpg'),
('City Center Hotel', 'Modern hotel in downtown', 'Main Street, New York', 249.99, 4.3, 'https://example.com/hotel3.jpg');

-- Insert sample data for rooms
INSERT INTO rooms (hotel_id, room_number, room_type, price, capacity) VALUES
(1, '101', 'Deluxe Room', 299.99, 2),
(1, '102', 'Suite', 399.99, 4),
(2, '201', 'Standard Room', 199.99, 2),
(2, '202', 'Family Room', 299.99, 4),
(3, '301', 'Executive Room', 249.99, 2),
(3, '302', 'Penthouse', 499.99, 4); 