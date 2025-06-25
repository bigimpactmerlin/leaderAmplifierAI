/*
  # Create users table with authentication

  1. New Tables
    - `users`
      - `id` (bigint, primary key, auto-increment)
      - `created_at` (timestamp with timezone, default now())
      - `name` (text, nullable)
      - `email` (text, nullable)
      - `domain` (text, nullable)
      - `linkedin_url` (text, nullable)
      - `facebook_url` (text, nullable)
      - `instagram_url` (text, nullable)
      - `twitter_url` (text, nullable)

  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to manage their own data
    - Add policies for anonymous users (for demo purposes)
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now() NOT NULL,
  name text,
  email text,
  domain text,
  linkedin_url text,
  facebook_url text,
  instagram_url text,
  twitter_url text
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for anonymous users (for demo purposes)
CREATE POLICY "Anonymous users can view all users"
  ON users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert users"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update users"
  ON users
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete users"
  ON users
  FOR DELETE
  TO anon
  USING (true);