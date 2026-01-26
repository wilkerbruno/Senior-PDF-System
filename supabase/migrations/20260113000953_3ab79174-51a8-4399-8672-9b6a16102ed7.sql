-- Fix the permissive INSERT policy for notifications - restrict to authenticated users or triggers
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

CREATE POLICY "Triggers and authenticated users can insert notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL OR auth.uid() = user_id);