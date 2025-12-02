-- Migration: Fix RLS policies for lead_submissions table
-- Date: 2025-12-02
-- Description: Allow anonymous users to insert leads from the website form

-- Enable RLS on lead_submissions if not already enabled
ALTER TABLE IF EXISTS public.lead_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous insert leads" ON public.lead_submissions;
DROP POLICY IF EXISTS "Allow service role full access" ON public.lead_submissions;

-- Policy 1: Allow anonymous users to INSERT leads
-- This is needed for the public website form to work
CREATE POLICY "Allow anonymous insert leads"
ON public.lead_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow authenticated service role to SELECT all leads
-- This is for admin dashboard and backend operations
CREATE POLICY "Allow service role full access"
ON public.lead_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON public.lead_submissions TO anon;

-- Grant full permissions to service_role
GRANT ALL ON public.lead_submissions TO service_role;

-- Comment for documentation
COMMENT ON POLICY "Allow anonymous insert leads" ON public.lead_submissions IS
'Allows anonymous users to submit leads through the website form';

COMMENT ON POLICY "Allow service role full access" ON public.lead_submissions IS
'Allows backend/admin access to read and manage all leads';
