/*
  # Add phone number field to users table

  1. Changes
    - Add `phone` column to `users` table
    - Column is optional (nullable)
    - Add index for phone number lookups

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
*/

-- Add phone column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;
END $$;

-- Add index for phone number lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- Add index for email lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;