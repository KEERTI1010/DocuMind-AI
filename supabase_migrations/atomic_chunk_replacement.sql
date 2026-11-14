-- Atomic chunk replacement RPC function (final corrected version)
-- Run this in Supabase SQL Editor

-- 1. Drop existing function if exists
DROP FUNCTION IF EXISTS replace_document_chunks(uuid, jsonb);

-- 2. Create the atomic replacement function with security fixes
CREATE OR REPLACE FUNCTION replace_document_chunks(
  p_document_id uuid,
  p_chunks jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_chunk jsonb;
  v_count int;
  v_chunk_index int;
  v_page_number int;
BEGIN
  -- Validate inputs
  IF p_document_id IS NULL THEN
    RAISE EXCEPTION 'document_id is required';
  END IF;

  IF p_chunks IS NULL OR jsonb_typeof(p_chunks) <> 'array' THEN
    RAISE EXCEPTION 'chunks must be a JSON array';
  END IF;

  SELECT jsonb_array_length(p_chunks) INTO v_count;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'chunks array cannot be empty';
  END IF;

  -- Validate each chunk has required fields and valid integer values
  FOR v_chunk IN SELECT * FROM jsonb_array_elements(p_chunks)
  LOOP
    IF v_chunk->>'content' IS NULL OR trim(v_chunk->>'content') = '' THEN
      RAISE EXCEPTION 'chunk content is required and cannot be empty';
    END IF;

    -- Validate chunk_index as non-negative integer
    IF v_chunk->>'chunk_index' IS NULL THEN
      RAISE EXCEPTION 'chunk_index is required';
    END IF;
    v_chunk_index := (v_chunk->>'chunk_index')::int;
    IF v_chunk_index < 0 THEN
      RAISE EXCEPTION 'chunk_index must be non-negative';
    END IF;

    -- Validate page_number as positive integer (null allowed for pages without page number)
    IF v_chunk->>'page_number' IS NOT NULL THEN
      v_page_number := (v_chunk->>'page_number')::int;
      IF v_page_number <= 0 THEN
        RAISE EXCEPTION 'page_number must be positive when provided';
      END IF;
    END IF;
  END LOOP;

  -- Check for duplicate chunk_index in the input array BEFORE any mutation
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_chunks) AS elem
    GROUP BY (elem->>'chunk_index')::int
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate chunk_index values in input chunks';
  END IF;

  -- Check document exists and lock the parent row to prevent concurrent replacement
  PERFORM 1
  FROM public.documents
  WHERE id = p_document_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document not found: %', p_document_id;
  END IF;

  -- Atomic replacement: DELETE + INSERT in same transaction
  DELETE FROM public.document_chunks WHERE document_id = p_document_id;

  INSERT INTO public.document_chunks (document_id, chunk_index, page_number, content)
  SELECT
    p_document_id,
    (elem->>'chunk_index')::int,
    (elem->>'page_number')::int,
    elem->>'content'
  FROM jsonb_array_elements(p_chunks) AS elem;

  -- Verify insertion occurred
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No chunks were inserted';
  END IF;

  -- Verify no duplicate chunk_index after insertion (defense in depth)
  IF EXISTS (
    SELECT 1 FROM public.document_chunks
    WHERE document_id = p_document_id
    GROUP BY chunk_index
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate chunk_index values detected after insertion';
  END IF;

END;
$$;

-- 3. Security: Revoke all from PUBLIC, anon, authenticated; grant only to service_role
REVOKE ALL ON FUNCTION replace_document_chunks(uuid, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION replace_document_chunks(uuid, jsonb) FROM anon;
REVOKE ALL ON FUNCTION replace_document_chunks(uuid, jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION replace_document_chunks(uuid, jsonb) TO service_role;

-- 4. Verify the backend's supabaseAdmin client uses the service_role key (required)
-- The function is now only executable by service_role, which the backend uses via supabaseAdmin.