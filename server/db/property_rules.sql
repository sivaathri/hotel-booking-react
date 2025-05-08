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


















=============================================================================================



-- Table structure for table `basic_info`
--

CREATE TABLE `basic_info` (
  `property_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `property_name` varchar(255) NOT NULL,
  `property_type` enum('Hotel','Apartment','Hut House','Resort','Beach House','Villa') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `facilities_amenities`
--

CREATE TABLE `facilities_amenities` (
  `property_id` int(11) NOT NULL,
  `gym` tinyint(1) DEFAULT 0,
  `swimming_pool` tinyint(1) DEFAULT 0,
  `spa` tinyint(1) DEFAULT 0,
  `restaurant` tinyint(1) DEFAULT 0,
  `room_service_24hr` tinyint(1) DEFAULT 0,
  `lounge` tinyint(1) DEFAULT 0,
  `steam_sauna` tinyint(1) DEFAULT 0,
  `bar` tinyint(1) DEFAULT 0,
  `free_parking` tinyint(1) DEFAULT 0,
  `free_wifi` tinyint(1) DEFAULT 0,
  `refrigerator` tinyint(1) DEFAULT 0,
  `laundry_service` tinyint(1) DEFAULT 0,
  `housekeeping` tinyint(1) DEFAULT 0,
  `air_conditioning` tinyint(1) DEFAULT 0,
  `power_backup` tinyint(1) DEFAULT 0,
  `ev_charging` tinyint(1) DEFAULT 0,
  `smoke_detector` tinyint(1) DEFAULT 0,
  `umbrellas` tinyint(1) DEFAULT 0,
  `elevator` tinyint(1) DEFAULT 0,
  `paid_lan` tinyint(1) DEFAULT 0,
  `dining_area` tinyint(1) DEFAULT 0,
  `cafe_24hr` tinyint(1) DEFAULT 0,
  `barbeque` tinyint(1) DEFAULT 0,
  `bakery` tinyint(1) DEFAULT 0,
  `coffee_shop_24hr` tinyint(1) DEFAULT 0,
  `fire_extinguishers` tinyint(1) DEFAULT 0,
  `cctv` tinyint(1) DEFAULT 0,
  `security_alarms` tinyint(1) DEFAULT 0,
  `reflexology` tinyint(1) DEFAULT 0,
  `first_aid` tinyint(1) DEFAULT 0,
  `tv` tinyint(1) DEFAULT 0,
  `luggage_storage` tinyint(1) DEFAULT 0,
  `wake_up_call` tinyint(1) DEFAULT 0,
  `concierge` tinyint(1) DEFAULT 0,
  `doctor_on_call` tinyint(1) DEFAULT 0,
  `wheelchair` tinyint(1) DEFAULT 0,
  `luggage_assistance` tinyint(1) DEFAULT 0,
  `bellboy_service` tinyint(1) DEFAULT 0,
  `accessible_facilities` tinyint(1) DEFAULT 0,
  `pool_beach_towels` tinyint(1) DEFAULT 0,
  `multilingual_staff` tinyint(1) DEFAULT 0,
  `massage` tinyint(1) DEFAULT 0,
  `printer` tinyint(1) DEFAULT 0,
  `photocopying` tinyint(1) DEFAULT 0,
  `conference_room` tinyint(1) DEFAULT 0,
  `banquet` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `location_details`
--

CREATE TABLE `location_details` (
  `id` int(11) NOT NULL,
  `property_id` int(5) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state_province` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `property_details`
--

CREATE TABLE `property_details` (
  `property_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `nearest_beach_distance` decimal(5,2) DEFAULT 0.00,
  `nearest_railway_station_distance` decimal(5,2) DEFAULT 0.00,
  `nearest_airport_distance` decimal(5,2) DEFAULT 0.00,
  `nearest_bus_stand_distance` decimal(5,2) DEFAULT 0.00,
  `can_book_married_couples` tinyint(1) DEFAULT 0,
  `can_book_families` tinyint(1) DEFAULT 0,
  `can_book_solo_travelers` tinyint(1) DEFAULT 0,
  `can_book_friends` tinyint(1) DEFAULT 0,
  `instant_booking` tinyint(1) DEFAULT 0,
  `manual_approval` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `property_rules`
--

CREATE TABLE `property_rules` (
  `id` int(11) NOT NULL,
  `property_id` int(5) NOT NULL,
  `user_id` int(11) NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `min_guest_age` int(11) DEFAULT NULL,
  `proof_type` enum('Passport','Aadhar','Govt ID','Driving License') DEFAULT NULL,
  `unmarried_couples_allowed` tinyint(1) DEFAULT NULL,
  `male_only_groups_allowed` tinyint(1) DEFAULT NULL,
  `scanty_baggage_allowed` tinyint(1) DEFAULT NULL,
  `smoking_allowed` tinyint(1) DEFAULT NULL,
  `alcohol_allowed` tinyint(1) DEFAULT NULL,
  `non_veg_allowed` tinyint(1) DEFAULT NULL,
  `outside_food_allowed` tinyint(1) DEFAULT NULL,
  `food_delivery_service` enum('Zomato','Swiggy','Local','UberEats') DEFAULT NULL,
  `wheelchair_accessible` tinyint(1) DEFAULT NULL,
  `wheelchair_provided` tinyint(1) DEFAULT NULL,
  `pets_allowed` tinyint(1) DEFAULT NULL,
  `pets_on_property` tinyint(1) DEFAULT NULL,
  `mattress_cost_child` decimal(10,2) DEFAULT NULL,
  `mattress_cost_adult` decimal(10,2) DEFAULT NULL,
  `cot_cost` decimal(10,2) DEFAULT NULL,
  `rule_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `room_images`
--

CREATE TABLE `room_images` (
  `id` int(11) NOT NULL,
  `property_id` int(5) NOT NULL,
  `room_id` int(11) NOT NULL,
  `image_paths` varchar(555) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `room_pricing_availability`
--

CREATE TABLE `room_pricing_availability` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `floor` varchar(50) DEFAULT NULL,
  `room_type` varchar(50) DEFAULT NULL,
  `number_of_rooms` int(11) DEFAULT NULL,
  `total_capacity` int(11) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `occupancy_price_adjustments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`occupancy_price_adjustments`)),
  `instant_payment_enabled` tinyint(1) DEFAULT 0,
  `free_cancellation_enabled` tinyint(1) DEFAULT 0,
  `refundable1` tinyint(1) DEFAULT 0,
  `days_before1` int(11) DEFAULT NULL,
  `refund_percent1` int(11) DEFAULT NULL,
  `refundable2` tinyint(1) DEFAULT 0,
  `days_before2` int(11) DEFAULT NULL,
  `refund_percent2` int(11) DEFAULT NULL,
  `refundable3` tinyint(1) DEFAULT 0,
  `days_before3` int(11) DEFAULT NULL,
  `refund_percent3` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `room_setup`
--

CREATE TABLE `room_setup` (
  `room_id` int(11) NOT NULL,
  `property_id` int(5) NOT NULL,
  `user_id` int(11) NOT NULL,
  `floor` varchar(50) NOT NULL,
  `room_type` varchar(100) NOT NULL,
  `number_of_rooms` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `marital_status` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Indexes for dumped tables
--


