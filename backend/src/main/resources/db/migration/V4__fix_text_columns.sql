DO $$
BEGIN
  -- name
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='users' AND column_name='name' AND udt_name='bytea'
  ) THEN
    ALTER TABLE users
      ALTER COLUMN name TYPE VARCHAR(150)
      USING convert_from(name, 'UTF8');
  END IF;

  -- email
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='users' AND column_name='email' AND udt_name='bytea'
  ) THEN
    ALTER TABLE users
      ALTER COLUMN email TYPE VARCHAR(200)
      USING convert_from(email, 'UTF8');
  END IF;

  -- job_title
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='users' AND column_name='job_title' AND udt_name='bytea'
  ) THEN
    ALTER TABLE users
      ALTER COLUMN job_title TYPE VARCHAR(80)
      USING convert_from(job_title, 'UTF8');
  END IF;

  -- system_role
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='users' AND column_name='system_role' AND udt_name='bytea'
  ) THEN
    ALTER TABLE users
      ALTER COLUMN system_role TYPE VARCHAR(20)
      USING convert_from(system_role, 'UTF8');
  END IF;
END $$;
