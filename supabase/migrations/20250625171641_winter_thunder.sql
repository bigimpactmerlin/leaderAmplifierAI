/*
  # Create contents table

  1. New Tables
    - `contents`
      - `id` (bigint, primary key, auto-increment)
      - `created_at` (timestamp with timezone, default now())
      - `user_id` (bigint, foreign key to users)
      - `idea_id` (bigint, foreign key to ideas)
      - `platform` (text, nullable)
      - `type` (text, nullable)
      - `content_url` (text, nullable)
      - `status` (text, nullable, default 'draft')
      - `content` (text, nullable)

  2. Security
    - Enable RLS on `contents` table
    - Add policies for authenticated and anonymous users
*/

-- Create contents table
CREATE TABLE IF NOT EXISTS contents (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id bigint REFERENCES users(id),
  idea_id bigint REFERENCES ideas(id),
  platform text,
  type text,
  content_url text,
  status text DEFAULT 'draft',
  content text
);

-- Enable RLS
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view all contents"
  ON contents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert contents"
  ON contents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contents"
  ON contents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contents"
  ON contents
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for anonymous users
CREATE POLICY "Anonymous users can view all contents"
  ON contents
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert contents"
  ON contents
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update contents"
  ON contents
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete contents"
  ON contents
  FOR DELETE
  TO anon
  USING (true);