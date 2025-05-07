-- USERS
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(15) DEFAULT NULL,
  `role` ENUM('user','admin') DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_of_birth` DATE DEFAULT NULL,
  `gender` VARCHAR(15) DEFAULT NULL,
  `marital_status` VARCHAR(15) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `pincode` VARCHAR(10) DEFAULT NULL,
  `state` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- BASIC INFO
CREATE TABLE `basic_info` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `property_name` VARCHAR(255) NOT NULL,
  `property_type` ENUM('Hotel','Apartment','Hut House','Resort','Beach House','Villa') NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- LOCATION DETAILS
CREATE TABLE `location_details` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `address_line1` VARCHAR(255) NOT NULL,
  `address_line2` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state_province` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ROOM SETUP
CREATE TABLE `room_setup` (
  `room_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `floor` VARCHAR(50) NOT NULL,
  `room_type` VARCHAR(100) NOT NULL,
  `number_of_rooms` INT(11) NOT NULL,
  `capacity` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ROOM IMAGES
CREATE TABLE `room_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `room_id` INT(11) NOT NULL,
  `image_paths` VARCHAR(555) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`room_id`) REFERENCES `room_setup`(`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- PROPERTIES
CREATE TABLE `properties` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `check_in_time` TIME DEFAULT NULL,
  `check_out_time` TIME DEFAULT NULL,
  `min_guest_age` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ID PROOFS
CREATE TABLE `id_proofs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `proof_type` ENUM('Passport', 'Aadhar', 'Govt ID', 'Driving License') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

--guest_profile_rules 
CREATE TABLE guest_profile_rules (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  unmarried_couples_allowed BOOLEAN,
  male_only_groups_allowed BOOLEAN,
  scanty_baggage_allowed BOOLEAN,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

--smoking_alcohol_rules 
CREATE TABLE smoking_alcohol_rules (
   `id` INT(11) NOT NULL AUTO_INCREMENT,
   `user_id` INT(11) NOT NULL,
   `smoking_allowed` BOOLEAN,
   `alcohol_allowed` BOOLEAN,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);


--food_rules 
CREATE TABLE food_rules (
   `id` INT(11) NOT NULL AUTO_INCREMENT,
   `user_id` INT(11) NOT NULL,
    non_veg_allowed BOOLEAN,
    outside_food_allowed BOOLEAN,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

--food_delivery_options 
CREATE TABLE food_delivery_options (
   `id` INT(11) NOT NULL AUTO_INCREMENT,
   `user_id` INT(11) NOT NULL,
    service_name ENUM('Zomato', 'Swiggy', 'Local', 'UberEats'),
   PRIMARY KEY (`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

--accessibility_rules 
CREATE TABLE accessibility_rules (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
   `user_id` INT(11) NOT NULL,
    wheelchair_accessible BOOLEAN,
    wheelchair_provided BOOLEAN,
    PRIMARY KEY (`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

--pet_policy 
CREATE TABLE pet_policy (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
   `user_id` INT(11) NOT NULL,
    pets_allowed BOOLEAN,
    pets_on_property BOOLEAN,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

--extra_bed_policy 
CREATE TABLE extra_bed_policy (
   `id` INT(11) NOT NULL AUTO_INCREMENT,
   `user_id` INT(11) NOT NULL,
    mattress_cost_child DECIMAL(10, 2),
    mattress_cost_adult DECIMAL(10, 2),
    cot_cost DECIMAL(10, 2),
  PRIMARY KEY (`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

--additional_rules 
CREATE TABLE additional_rules (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
   `user_id` INT(11) NOT NULL,
    rule_description TEXT,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);









==========================================================================================









CREATE TABLE property_rules (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
 
  -- Check-in/out and guest age
  check_in_time TIME DEFAULT NULL,
  check_out_time TIME DEFAULT NULL,
  min_guest_age INT DEFAULT NULL,

  -- ID proof
  proof_type ENUM('Passport', 'Aadhar', 'Govt ID', 'Driving License'),

  -- Guest profile rules
  unmarried_couples_allowed BOOLEAN,
  male_only_groups_allowed BOOLEAN,
  scanty_baggage_allowed BOOLEAN,

  -- Smoking/alcohol rules
  smoking_allowed BOOLEAN,
  alcohol_allowed BOOLEAN,

  -- Food rules
  non_veg_allowed BOOLEAN,
  outside_food_allowed BOOLEAN,

  -- Food delivery options (if multiple are needed, normalize or use JSON/text)
  food_delivery_service ENUM('Zomato', 'Swiggy', 'Local', 'UberEats'),

  -- Accessibility
  wheelchair_accessible BOOLEAN,
  wheelchair_provided BOOLEAN,

  -- Pet policy
  pets_allowed BOOLEAN,
  pets_on_property BOOLEAN,

  -- Extra bed policy
  mattress_cost_child DECIMAL(10, 2),
  mattress_cost_adult DECIMAL(10, 2),
  cot_cost DECIMAL(10, 2),

  -- Additional rules
  rule_description TEXT,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;






=============================================================================================

CREATE TABLE hotel_facilities (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
    
    gym BOOLEAN DEFAULT FALSE,
    swimming_pool BOOLEAN DEFAULT FALSE,
    spa BOOLEAN DEFAULT FALSE,
    restaurant BOOLEAN DEFAULT FALSE,
    room_service_24hr BOOLEAN DEFAULT FALSE,
    lounge BOOLEAN DEFAULT FALSE,
    steam_and_sauna BOOLEAN DEFAULT FALSE,
    bar BOOLEAN DEFAULT FALSE,

   
    free_parking BOOLEAN DEFAULT FALSE,
    free_wifi BOOLEAN DEFAULT FALSE,
    refrigerator BOOLEAN DEFAULT FALSE,
    laundry_service BOOLEAN DEFAULT FALSE,
    housekeeping BOOLEAN DEFAULT FALSE,
    air_conditioning BOOLEAN DEFAULT FALSE,
    power_backup BOOLEAN DEFAULT FALSE,
    ev_charging BOOLEAN DEFAULT FALSE,
    smoke_detector BOOLEAN DEFAULT FALSE,
    umbrellas BOOLEAN DEFAULT FALSE,
    elevator BOOLEAN DEFAULT FALSE,
    paid_lan BOOLEAN DEFAULT FALSE,

 
    dining_area BOOLEAN DEFAULT FALSE,
    cafe_24hr BOOLEAN DEFAULT FALSE,
    barbeque BOOLEAN DEFAULT FALSE,
    bakery BOOLEAN DEFAULT FALSE,
    coffee_shop_24hr BOOLEAN DEFAULT FALSE,

   
    fire_extinguishers BOOLEAN DEFAULT FALSE,
    cctv BOOLEAN DEFAULT FALSE,
    security_alarms BOOLEAN DEFAULT FALSE,

   
    reflexology BOOLEAN DEFAULT FALSE,
    first_aid BOOLEAN DEFAULT FALSE,


    tv BOOLEAN DEFAULT FALSE,

   
    luggage_storage BOOLEAN DEFAULT FALSE,
    wakeup_call BOOLEAN DEFAULT FALSE,
    concierge BOOLEAN DEFAULT FALSE,
    doctor_on_call BOOLEAN DEFAULT FALSE,
    wheelchair BOOLEAN DEFAULT FALSE,
    luggage_assistance BOOLEAN DEFAULT FALSE,
    bellboy_service BOOLEAN DEFAULT FALSE,
    accessible_facilities BOOLEAN DEFAULT FALSE,
    pool_beach_towels BOOLEAN DEFAULT FALSE,
    multilingual_staff BOOLEAN DEFAULT FALSE,

    
    massage BOOLEAN DEFAULT FALSE,

  
    printer BOOLEAN DEFAULT FALSE,
    photocopying BOOLEAN DEFAULT FALSE,
    conference_room BOOLEAN DEFAULT FALSE,
    banquet BOOLEAN DEFAULT FALSE

PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);








