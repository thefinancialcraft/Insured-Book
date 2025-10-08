-- ===========================================
-- FULL DATABASE RESET SCRIPT (PostgreSQL/Supabase)
-- ===========================================

-- Step 1: Drop all triggers from all tables in 'public' schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT event_object_table AS table_name, trigger_name
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
  )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I CASCADE;', r.trigger_name, r.table_name);
  END LOOP;
END
$$;

-- Step 2: Drop all policies from all tables in 'public' schema
DO $$
DECLARE
  r RECORD;
  p RECORD;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  )
  LOOP
    FOR p IN (
      SELECT polname 
      FROM pg_policy 
      WHERE polrelid = (
        SELECT oid 
        FROM pg_class 
        WHERE relname = r.tablename AND relnamespace = (
          SELECT oid 
          FROM pg_namespace 
          WHERE nspname = 'public'
        )
      )
    )
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I CASCADE;', p.polname, r.tablename);
    END LOOP;
  END LOOP;
END
$$;

-- Step 3: Drop all views in 'public' schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT table_name
    FROM information_schema.views
    WHERE table_schema = 'public'
  )
  LOOP
    EXECUTE format('DROP VIEW IF EXISTS %I CASCADE;', r.table_name);
  END LOOP;
END
$$;

-- Step 4: Drop all functions in 'public' schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT routine_name, routine_schema
    FROM information_schema.routines
    WHERE routine_type = 'FUNCTION' AND routine_schema = 'public'
  )
  LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS public.%I CASCADE;', r.routine_name);
  END LOOP;
END
$$;

-- Step 5: Drop all tables in 'public' schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  )
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I CASCADE;', r.tablename);
  END LOOP;
END
$$;

-- Step 6: Drop all sequences in 'public' schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT sequence_name
    FROM information_schema.sequences
    WHERE sequence_schema = 'public'
  )
  LOOP
    EXECUTE format('DROP SEQUENCE IF EXISTS %I CASCADE;', r.sequence_name);
  END LOOP;
END
$$;

-- Step 7: Drop all user-defined types in 'public' schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT n.nspname as schema_name, t.typname as type_name
    FROM pg_type t
    LEFT JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_class c WHERE c.oid = t.typrelid))
      AND NOT EXISTS (SELECT 1 FROM pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
  )
  LOOP
    EXECUTE format('DROP TYPE IF EXISTS %I.%I CASCADE;', r.schema_name, r.type_name);
  END LOOP;

  -- Final notice (now inside the block)
  RAISE NOTICE 'Database reset complete. All tables, views, functions, triggers, policies, sequences, and types in public schema have been dropped.';
END
$$;