/*
  # Add phone field to users table

  1. Changes
    - Add phone column to users table
    - Phone is optional (nullable)
    - Add index for phone lookups if needed

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;
END $$;