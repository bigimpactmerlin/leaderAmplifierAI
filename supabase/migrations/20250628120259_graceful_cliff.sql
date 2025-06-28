/*
  # Add RLS policies for idea_generation_prompt table

  1. Security
    - Enable RLS on `idea_generation_prompt` table (if not already enabled)
    - Add policies for authenticated and anonymous users to manage prompts
*/

-- Enable RLS (if not already enabled)
ALTER TABLE idea_generation_prompt ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view all prompts"
  ON idea_generation_prompt
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert prompts"
  ON idea_generation_prompt
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update prompts"
  ON idea_generation_prompt
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete prompts"
  ON idea_generation_prompt
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for anonymous users (for demo purposes)
CREATE POLICY "Anonymous users can view all prompts"
  ON idea_generation_prompt
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert prompts"
  ON idea_generation_prompt
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update prompts"
  ON idea_generation_prompt
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete prompts"
  ON idea_generation_prompt
  FOR DELETE
  TO anon
  USING (true);