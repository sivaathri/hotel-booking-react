
-- Table structure for table `basic_info`
--
CREATE TABLE `basic_info` (
  `property_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `property_name` VARCHAR(255) NOT NULL,
  `property_type` ENUM('Hotel','Apartment','Hut House','Resort','Beach House','Villa') NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`property_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `facilities_amenities`
--

CREATE TABLE `facilities_amenities` (
  `property_id` int(11) NOT NULL  ,
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
  `banquet` tinyint(1) DEFAULT 0,
   PRIMARY KEY (`property_id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `location_details`
--

CREATE TABLE `location_details` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(5) NOT NULL ,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `property_details`
--
CREATE TABLE `property_details` (
  `property_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `description` TEXT,
  `nearest_beach_distance` DECIMAL(5,2) DEFAULT 0.00,
  `nearest_railway_station_distance` DECIMAL(5,2) DEFAULT 0.00,
  `nearest_airport_distance` DECIMAL(5,2) DEFAULT 0.00,
  `nearest_bus_stand_distance` DECIMAL(5,2) DEFAULT 0.00,
  `can_book_married_couples` TINYINT(1) DEFAULT 0,
  `can_book_families` TINYINT(1) DEFAULT 0,
  `can_book_solo_travelers` TINYINT(1) DEFAULT 0,
  `can_book_friends` TINYINT(1) DEFAULT 0,
  `instant_booking` TINYINT(1) DEFAULT 0,
  `manual_approval` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`property_id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `property_rules`
--

CREATE TABLE `property_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(5) NOT NULL  ,
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
  `rule_description` text DEFAULT NULL,
   PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`room_id`) REFERENCES `room_setup`(`room_id`) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `room_images`
--

CREATE TABLE `room_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(5) NOT NULL  ,
  `room_id` int(11) NOT NULL,
  `image_paths` varchar(555) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `room_pricing_availability`
--

CREATE TABLE `room_pricing_availability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL  ,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE,
  CHECK (JSON_VALID(`occupancy_price_adjustments`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `room_setup`
--

CREATE TABLE `room_setup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(5) NOT NULL ,
  `user_id` int(11) NOT NULL,
  `floor` varchar(50) NOT NULL,
  `room_type` varchar(100) NOT NULL,
  `number_of_rooms` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
CREATE TABLE `room_setup` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(5) NOT NULL,
  `user_id` int(11) NOT NULL,
  `floor` varchar(50) NOT NULL,
  `room_type` varchar(100) NOT NULL,
  `number_of_rooms` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`room_id`),
  FOREIGN KEY (`property_id`) REFERENCES `basic_info`(`property_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
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
  `state` varchar(50) DEFAULT NULL,
   PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Indexes for dumped tables
--

