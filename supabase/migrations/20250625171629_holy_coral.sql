/*
  # Create sources table

  1. New Tables
    - `sources`
      - `id` (bigint, primary key, auto-increment)
      - `created_at` (timestamp with timezone, default now())
      - `user_id` (bigint, foreign key to users)
      - `source_type` (text, nullable)
      - `description` (text, nullable)
      - `url` (text, nullable)
      - `key` (text, nullable - for status like 'Active'/'Inactive')

  2. Security
    - Enable RLS on `sources` table
    - Add policies for authenticated and anonymous users
*/

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id bigint REFERENCES users(id),
  source_type text,
  description text,
  url text,
  key text DEFAULT 'Active'
);

-- Enable RLS
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view all sources"
  ON sources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sources"
  ON sources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sources"
  ON sources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sources"
  ON sources
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for anonymous users
CREATE POLICY "Anonymous users can view all sources"
  ON sources
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert sources"
  ON sources
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update sources"
  ON sources
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete sources"
  ON sources
  FOR DELETE
  TO anon
  USING (true);