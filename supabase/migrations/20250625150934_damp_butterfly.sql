/*
  # Add RLS policies for users table

  1. Security
    - Add policy for anonymous users to insert new users
    - Add policy for anonymous users to select users
    - Add policy for anonymous users to update users
    - Add policy for anonymous users to delete users

  Note: These policies are permissive for development purposes.
  In production, you should implement more restrictive policies based on your authentication requirements.
*/

-- Policy for INSERT operations (allows anonymous users to create users)
CREATE POLICY "Allow anonymous insert on users"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for SELECT operations (allows anonymous users to read users)
CREATE POLICY "Allow anonymous select on users"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- Policy for UPDATE operations (allows anonymous users to update users)
CREATE POLICY "Allow anonymous update on users"
  ON users
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy for DELETE operations (allows anonymous users to delete users)
CREATE POLICY "Allow anonymous delete on users"
  ON users
  FOR DELETE
  TO anon
  USING (true);

-- Also add policies for authenticated users
CREATE POLICY "Allow authenticated insert on users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select on users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update on users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on users"
  ON users
  FOR DELETE
  TO authenticated
  USING (true);