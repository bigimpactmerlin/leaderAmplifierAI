/*
  # Create ideas table

  1. New Tables
    - `ideas`
      - `id` (bigint, primary key, auto-increment)
      - `created_at` (timestamp with timezone, default now())
      - `user_id` (bigint, foreign key to users)
      - `content` (text, nullable)
      - `priority_score` (real, nullable, default 0.5)
      - `used_at` (timestamp without timezone, nullable)
      - `status` (text, nullable, default 'new')

  2. Security
    - Enable RLS on `ideas` table
    - Add policies for authenticated and anonymous users
*/

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id bigint REFERENCES users(id),
  content text,
  priority_score real DEFAULT 0.5,
  used_at timestamp,
  status text DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view all ideas"
  ON ideas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ideas"
  ON ideas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ideas"
  ON ideas
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ideas"
  ON ideas
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for anonymous users
CREATE POLICY "Anonymous users can view all ideas"
  ON ideas
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert ideas"
  ON ideas
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update ideas"
  ON ideas
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete ideas"
  ON ideas
  FOR DELETE
  TO anon
  USING (true);