-- =====================================================
-- Ticket Tracker Database Schema
-- =====================================================
-- Run this script on your production database to create
-- all required tables for the Ticket Tracker application
-- =====================================================

-- Create database (if needed)
-- CREATE DATABASE IF NOT EXISTS ticket_tracker;
-- USE ticket_tracker;

-- =====================================================
-- Users Table
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tickets Table (Active Tickets)
-- =====================================================
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  problem TEXT,
  priority VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_client (client),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Complete Table (Completed Tickets)
-- =====================================================
CREATE TABLE IF NOT EXISTS complete (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  problem TEXT,
  solution TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_client (client),
  INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Points Table (Total Points Tracker)
-- =====================================================
CREATE TABLE IF NOT EXISTS points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  point INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Initialize Points Table
-- =====================================================
-- Insert initial point record if table is empty
INSERT INTO points (point) 
SELECT 0 
WHERE NOT EXISTS (SELECT 1 FROM points LIMIT 1);

-- =====================================================
-- Verification Queries
-- =====================================================
-- Run these to verify your setup

-- Check if all tables exist
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME
FROM 
    information_schema.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN ('users', 'tickets', 'complete', 'points');

-- Check points initialization
SELECT * FROM points;

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================
-- Uncomment to insert sample data for testing

-- Sample admin user (password: admin123)
-- INSERT INTO users (username, password) 
-- VALUES ('admin', '$2b$10$rKvVJKxZ8YqN8YqN8YqN8OqN8YqN8YqN8YqN8YqN8YqN8YqN8YqN8');

-- Sample ticket
-- INSERT INTO tickets (id, name, client, points, problem, priority)
-- VALUES ('TICKET-001', 'John Doe', 'Acme Corp', 10, 'Login issue', 'High');

-- Sample completed ticket
-- INSERT INTO complete (id, name, client, points, problem, solution)
-- VALUES ('TICKET-002', 'Jane Smith', 'Tech Inc', 15, 'Database error', 'Fixed connection pool');

-- =====================================================
-- Maintenance Queries
-- =====================================================

-- Clear all tickets (use with caution!)
-- DELETE FROM tickets;

-- Clear all completed tickets (use with caution!)
-- DELETE FROM complete;

-- Reset points to zero (use with caution!)
-- UPDATE points SET point = 0;

-- Drop all tables (use with extreme caution!)
-- DROP TABLE IF EXISTS users, tickets, complete, points;
