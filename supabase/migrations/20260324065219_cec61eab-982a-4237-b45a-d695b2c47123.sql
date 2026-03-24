
-- Add expires_in_days to coupons (nullable = no expiry / unlimited)
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS expires_in_days integer DEFAULT NULL;

-- Add expires_at to user_plans (nullable = no expiry)
ALTER TABLE public.user_plans ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT NULL;
