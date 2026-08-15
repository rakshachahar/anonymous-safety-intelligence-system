-- SafeVoice production security policies

-- SOS must support anonymous events without fake coordinates.
ALTER TABLE public.sos_events
  ALTER COLUMN latitude DROP NOT NULL;

ALTER TABLE public.sos_events
  ALTER COLUMN longitude DROP NOT NULL;

-- Remove the old authenticated-only SOS insert policy.
DROP POLICY IF EXISTS "Users can create SOS events"
ON public.sos_events;

-- Allow anonymous users to create SOS events without attaching identity.
CREATE POLICY "Anonymous users can create SOS events"
ON public.sos_events
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Admin report moderation.
DROP POLICY IF EXISTS "Admin can update safety reports"
ON public.safety_reports;

CREATE POLICY "Admin can update safety reports"
ON public.safety_reports
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'admin.safevoice@gmail.com'
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin.safevoice@gmail.com'
);

-- Replace unrestricted alert modification with admin-only modification.
DROP POLICY IF EXISTS "Authenticated can create alerts"
ON public.alerts;

DROP POLICY IF EXISTS "Authenticated can update alerts"
ON public.alerts;

CREATE POLICY "Admin can create alerts"
ON public.alerts
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin.safevoice@gmail.com'
);

CREATE POLICY "Admin can update alerts"
ON public.alerts
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'admin.safevoice@gmail.com'
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin.safevoice@gmail.com'
);
