-- ============================================
-- Kagarama Church Management System
-- MySQL Database Schema
-- ============================================

-- Create the database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS church_cms;
-- USE church_cms;

-- 1. Users table (Replaces Supabase Auth & Profiles)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY, -- We can still use UUIDs for IDs
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  role ENUM('pastor', 'manager', 'member') NOT NULL DEFAULT 'member',
  phone VARCHAR(50),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Church Members
DROP TABLE IF EXISTS members;
CREATE TABLE members (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  full_name VARCHAR(255) NOT NULL,
  national_id VARCHAR(50) UNIQUE,
  education_level VARCHAR(100),
  phone VARCHAR(50),
  home_location VARCHAR(255),
  hobbies TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Families
DROP TABLE IF EXISTS families;
CREATE TABLE families (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Family Members (junction table)
DROP TABLE IF EXISTS family_members;
CREATE TABLE family_members (
  id CHAR(36) PRIMARY KEY,
  family_id CHAR(36),
  member_id CHAR(36),
  role ENUM('parent', 'child') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(family_id, member_id),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 5. Events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location VARCHAR(255),
  image_url VARCHAR(255),
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Announcements
DROP TABLE IF EXISTS announcements;
CREATE TABLE announcements (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('normal', 'important', 'urgent') DEFAULT 'normal',
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Photo of the Day
DROP TABLE IF EXISTS photo_of_day;
CREATE TABLE photo_of_day (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  media_type ENUM('image', 'video') DEFAULT 'image',
  file_path VARCHAR(255) NOT NULL,
  image_url VARCHAR(255), -- Fallback or external
  caption TEXT,
  posted_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Prayer Requests
DROP TABLE IF EXISTS prayer_requests;
CREATE TABLE prayer_requests (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'praying', 'reviewed') DEFAULT 'pending',
  pastor_note TEXT,
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Appointments
DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  pastor_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Baptism / Kwakirwa Registrations
DROP TABLE IF EXISTS baptism_registrations;
CREATE TABLE baptism_registrations (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  full_name VARCHAR(255) NOT NULL,
  national_id VARCHAR(50),
  family_details TEXT,
  registration_type ENUM('baptism', 'kwakirwa') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  pastor_note TEXT,
  ceremony_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. Marriage Registrations
DROP TABLE IF EXISTS marriage_registrations;
CREATE TABLE marriage_registrations (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  spouse1_name VARCHAR(255) NOT NULL,
  spouse1_id VARCHAR(50),
  spouse2_name VARCHAR(255) NOT NULL,
  spouse2_id VARCHAR(50),
  marriage_date DATE NOT NULL,
  recommendation_url VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  pastor_note TEXT,
  family_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL
);

-- 12. Deletion Requests
DROP TABLE IF EXISTS deletion_requests;
CREATE TABLE deletion_requests (
  id CHAR(36) PRIMARY KEY,
  requested_by CHAR(36),
  child_member_id CHAR(36),
  family_id CHAR(36),
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (child_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);
