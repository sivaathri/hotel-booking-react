CREATE TABLE room_bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- optional, if you have a user table
    property_id INT NOT NULL,
    room_type VARCHAR(255) NOT NULL,
    room_number INT,
    number_of_rooms_Book INT DEFAULT 1,
    adults INT NOT NULL,
    children INT DEFAULT 0,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
    payment_method VARCHAR(100),
    instant_payment BOOLEAN DEFAULT 0,
    free_cancellation BOOLEAN DEFAULT 0,

    -- New guest information fields
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    country VARCHAR(100),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (room_number) REFERENCES room_setup(room_id) ON DELETE CASCADE
);
