-- =============================================
-- Platform Database Schema Export
-- Generated: 2026-02-14
-- =============================================

-- =============
-- ENUMS
-- =============

CREATE TYPE public.admin_role AS ENUM (
  'super_admin',
  'operations_admin',
  'compliance_admin',
  'support_admin',
  'read_only_admin'
);

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TYPE public.kyc_document_type AS ENUM (
  'bvn', 'nin', 'passport', 'drivers_license',
  'national_id', 'utility_bill', 'bank_statement',
  'selfie', 'passport_photograph'
);

CREATE TYPE public.kyc_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE public.transaction_channel AS ENUM (
  'bank_transfer', 'internal_transfer', 'wallet_funding', 'withdrawal'
);

CREATE TYPE public.transaction_status AS ENUM ('pending', 'successful', 'failed', 'reversed');

CREATE TYPE public.transaction_type AS ENUM ('credit', 'debit');

CREATE TYPE public.user_tier AS ENUM ('tier_1', 'tier_2', 'tier_3');

CREATE TYPE public.verification_status AS ENUM ('pending', 'verified');


-- =============
-- TABLES
-- =============

CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  middle_name text,
  full_name text,
  phone text,
  gender text,
  date_of_birth date,
  bvn text,
  customer_id text,
  avatar_url text,
  transaction_pin_hash text,
  otp_code text,
  otp_expires_at timestamptz,
  verification_status public.verification_status DEFAULT 'pending',
  is_suspended boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.wallets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  currency text NOT NULL DEFAULT 'NGN',
  ledger_balance numeric NOT NULL DEFAULT 0.00,
  available_balance numeric NOT NULL DEFAULT 0.00,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.virtual_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  wallet_id uuid NOT NULL REFERENCES public.wallets(id),
  account_number text NOT NULL,
  account_name text NOT NULL,
  bank_name text NOT NULL DEFAULT 'Platform Bank',
  bank_code text NOT NULL DEFAULT '999',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id uuid NOT NULL REFERENCES public.wallets(id),
  reference text NOT NULL,
  type public.transaction_type NOT NULL,
  status public.transaction_status NOT NULL DEFAULT 'pending',
  channel public.transaction_channel NOT NULL,
  amount numeric NOT NULL,
  fee numeric NOT NULL DEFAULT 0.00,
  balance_before numeric NOT NULL,
  balance_after numeric NOT NULL,
  narration text,
  counterparty_name text,
  counterparty_account text,
  counterparty_bank text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.beneficiaries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  account_number text NOT NULL,
  bank_name text NOT NULL,
  bank_code text NOT NULL,
  is_platform_user boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.kyc_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  document_type public.kyc_document_type NOT NULL,
  document_url text,
  document_number text,
  status public.kyc_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  metadata jsonb,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tier_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier public.user_tier NOT NULL,
  tier_name text NOT NULL,
  tier_description text,
  max_send_per_tx numeric NOT NULL,
  max_receive_per_tx numeric NOT NULL,
  daily_send_limit numeric NOT NULL,
  daily_receive_limit numeric NOT NULL,
  monthly_limit numeric NOT NULL,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  required_documents text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_tier_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  current_tier public.user_tier NOT NULL DEFAULT 'tier_1',
  tier_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tier_upgrade_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  current_tier public.user_tier NOT NULL,
  requested_tier public.user_tier NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reason text,
  reviewed_by uuid REFERENCES public.admin_users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  two_factor_enabled boolean NOT NULL DEFAULT false,
  biometric_enabled boolean NOT NULL DEFAULT false,
  email_notifications boolean NOT NULL DEFAULT true,
  sms_notifications boolean NOT NULL DEFAULT false,
  push_notifications boolean NOT NULL DEFAULT true,
  transaction_alerts boolean NOT NULL DEFAULT true,
  login_alerts boolean NOT NULL DEFAULT true,
  daily_limit_alerts boolean NOT NULL DEFAULT true,
  auto_limit_management boolean NOT NULL DEFAULT false,
  profile_visibility text NOT NULL DEFAULT 'private',
  preferred_language text NOT NULL DEFAULT 'en',
  timezone text NOT NULL DEFAULT 'Africa/Lagos',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_suspensions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  reason text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  suspended_by uuid REFERENCES public.admin_users(id),
  lifted_by uuid REFERENCES public.admin_users(id),
  suspended_at timestamptz NOT NULL DEFAULT now(),
  lifted_at timestamptz
);

CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  first_name text,
  last_name text,
  full_name text,
  role public.admin_role NOT NULL DEFAULT 'read_only_admin',
  is_active boolean NOT NULL DEFAULT true,
  two_factor_enabled boolean NOT NULL DEFAULT false,
  two_factor_secret text,
  last_login_at timestamptz,
  last_login_ip text,
  created_by uuid REFERENCES public.admin_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.admin_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text NOT NULL,
  admin_user_id uuid REFERENCES public.admin_users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- =============
-- RLS POLICIES
-- =============

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (is_admin(auth.uid()));

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all wallets" ON public.wallets FOR SELECT USING (is_admin(auth.uid()));

ALTER TABLE public.virtual_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own virtual accounts" ON public.virtual_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all virtual accounts" ON public.virtual_accounts FOR SELECT USING (is_admin(auth.uid()));

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (get_wallet_owner(wallet_id) = auth.uid());
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT USING (is_admin(auth.uid()));

ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own beneficiaries" ON public.beneficiaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own beneficiaries" ON public.beneficiaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own beneficiaries" ON public.beneficiaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own beneficiaries" ON public.beneficiaries FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own KYC documents" ON public.kyc_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own KYC documents" ON public.kyc_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own KYC documents" ON public.kyc_documents FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all KYC documents" ON public.kyc_documents FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.tier_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tier limits" ON public.tier_limits FOR SELECT USING (true);
CREATE POLICY "Only admins can modify tier limits" ON public.tier_limits FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.user_tier_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tier" ON public.user_tier_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only admins can modify tier assignments" ON public.user_tier_assignments FOR ALL USING (is_admin(auth.uid()));

ALTER TABLE public.tier_upgrade_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own requests" ON public.tier_upgrade_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own requests" ON public.tier_upgrade_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON public.tier_upgrade_requests FOR SELECT USING (is_admin_user(auth.uid()));
CREATE POLICY "Authorized admins can update requests" ON public.tier_upgrade_requests FOR UPDATE USING (admin_has_permission(auth.uid(), 'manage_tiers'));

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (is_admin(auth.uid()));

ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view suspensions" ON public.user_suspensions FOR SELECT USING (is_admin_user(auth.uid()));
CREATE POLICY "Authorized admins can manage suspensions" ON public.user_suspensions FOR ALL USING (admin_has_permission(auth.uid(), 'manage_users'));

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all notifications" ON public.notifications FOR SELECT USING (is_admin(auth.uid()));

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT USING (email = (auth.jwt() ->> 'email'));
CREATE POLICY "admin_users_select_all_admins" ON public.admin_users FOR SELECT USING (current_user_is_admin());
CREATE POLICY "admin_users_super_admin_all" ON public.admin_users FOR ALL USING (current_user_admin_role() = 'super_admin') WITH CHECK (current_user_admin_role() = 'super_admin');

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (is_admin_user(auth.uid()));
CREATE POLICY "System can insert audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (is_admin_user(auth.uid()));


-- =============
-- FUNCTIONS
-- =============

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_otp()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_otp(user_email text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  random_otp TEXT;
BEGIN
  random_otp := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  UPDATE public.profiles SET otp_code = random_otp, otp_expires_at = now() + interval '10 minutes' WHERE email = user_email;
  RETURN random_otp;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_user_otp(user_email text, provided_otp text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  UPDATE public.profiles
  SET verification_status = 'verified', otp_code = NULL, otp_expires_at = NULL
  WHERE email = user_email AND otp_code = provided_otp AND otp_expires_at > now()
  RETURNING TRUE INTO is_valid;
  RETURN COALESCE(is_valid, FALSE);
END;
$$;

CREATE OR REPLACE FUNCTION public.is_user_verified(user_email text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  status public.verification_status;
BEGIN
  SELECT verification_status INTO status FROM public.profiles WHERE email = user_email;
  RETURN status = 'verified';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_profile_by_email(user_email text)
RETURNS TABLE(user_id uuid, verification_status verification_status)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  RETURN QUERY SELECT p.user_id, p.verification_status FROM public.profiles p WHERE p.email = user_email;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_unverified_user(user_email text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  DELETE FROM public.profiles WHERE email = user_email AND verification_status = 'pending';
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_wallet_owner(_wallet_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT user_id FROM public.wallets WHERE id = _wallet_id;
$$;

CREATE OR REPLACE FUNCTION public.is_transaction_pin_set()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  pin_hash text;
BEGIN
  SELECT transaction_pin_hash INTO pin_hash FROM public.profiles WHERE user_id = auth.uid();
  RETURN pin_hash IS NOT NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' SET row_security TO 'off' AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = (auth.jwt() ->> 'email') AND au.is_active = true);
$$;

CREATE OR REPLACE FUNCTION public.current_user_admin_role()
RETURNS admin_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' SET row_security TO 'off' AS $$
  SELECT au.role FROM public.admin_users au WHERE au.email = (auth.jwt() ->> 'email') AND au.is_active = true LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' SET row_security TO 'off' AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = (SELECT auth.jwt() ->> 'email') AND au.is_active = true);
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' SET row_security TO 'off' AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = (SELECT auth.jwt() ->> 'email') AND au.is_active = true);
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role(_user_id uuid)
RETURNS admin_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' SET row_security TO 'off' AS $$
  SELECT CASE
    WHEN _user_id IS NOT NULL AND _user_id = auth.uid() THEN public.current_user_admin_role()
    ELSE NULL::public.admin_role
  END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_user_id(_auth_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' SET row_security TO 'off' AS $$
  SELECT CASE
    WHEN _auth_user_id IS NOT NULL AND _auth_user_id = auth.uid() THEN (
      SELECT au.id FROM public.admin_users au WHERE au.email = (auth.jwt() ->> 'email') AND au.is_active = true LIMIT 1
    )
    ELSE NULL::uuid
  END;
$$;

CREATE OR REPLACE FUNCTION public.admin_has_permission(_user_id uuid, _permission text)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _role admin_role;
BEGIN
  SELECT get_admin_role(_user_id) INTO _role;
  IF _role IS NULL THEN RETURN FALSE; END IF;
  IF _role = 'super_admin' THEN RETURN TRUE; END IF;
  CASE _permission
    WHEN 'view_users' THEN RETURN _role IN ('operations_admin', 'compliance_admin', 'support_admin', 'read_only_admin');
    WHEN 'manage_users' THEN RETURN _role IN ('operations_admin', 'support_admin');
    WHEN 'view_kyc' THEN RETURN _role IN ('compliance_admin', 'support_admin', 'read_only_admin');
    WHEN 'manage_kyc' THEN RETURN _role = 'compliance_admin';
    WHEN 'view_transactions' THEN RETURN _role IN ('operations_admin', 'compliance_admin', 'support_admin', 'read_only_admin');
    WHEN 'manage_transactions' THEN RETURN _role = 'operations_admin';
    WHEN 'view_wallets' THEN RETURN _role IN ('operations_admin', 'compliance_admin', 'read_only_admin');
    WHEN 'manage_wallets' THEN RETURN _role = 'operations_admin';
    WHEN 'view_tiers' THEN RETURN _role IN ('operations_admin', 'compliance_admin', 'support_admin', 'read_only_admin');
    WHEN 'manage_tiers' THEN RETURN _role IN ('operations_admin', 'compliance_admin');
    WHEN 'view_logs' THEN RETURN TRUE;
    WHEN 'manage_admins' THEN RETURN FALSE;
    ELSE RETURN FALSE;
  END CASE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_tier_limits(_user_id uuid)
RETURNS TABLE(tier user_tier, tier_name text, max_send_per_tx numeric, max_receive_per_tx numeric, daily_send_limit numeric, daily_receive_limit numeric, monthly_limit numeric, features jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT tl.tier, tl.tier_name, tl.max_send_per_tx, tl.max_receive_per_tx, tl.daily_send_limit, tl.daily_receive_limit, tl.monthly_limit, tl.features
  FROM public.tier_limits tl JOIN public.user_tier_assignments uta ON uta.current_tier = tl.tier WHERE uta.user_id = _user_id;
$$;

CREATE OR REPLACE FUNCTION public.check_transaction_limit(_user_id uuid, _amount numeric, _tx_type transaction_type)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _limits RECORD;
  _daily_total NUMERIC;
  _monthly_total NUMERIC;
BEGIN
  SELECT * INTO _limits FROM public.get_user_tier_limits(_user_id);
  IF _limits IS NULL THEN RETURN FALSE; END IF;
  IF _tx_type = 'debit' AND _amount > _limits.max_send_per_tx THEN RETURN FALSE; END IF;
  IF _tx_type = 'credit' AND _amount > _limits.max_receive_per_tx THEN RETURN FALSE; END IF;
  SELECT COALESCE(SUM(amount), 0) INTO _daily_total FROM public.transactions t JOIN public.wallets w ON w.id = t.wallet_id WHERE w.user_id = _user_id AND t.type = _tx_type AND t.status = 'successful' AND t.created_at >= CURRENT_DATE;
  IF _tx_type = 'debit' AND (_daily_total + _amount) > _limits.daily_send_limit THEN RETURN FALSE; END IF;
  IF _tx_type = 'credit' AND (_daily_total + _amount) > _limits.daily_receive_limit THEN RETURN FALSE; END IF;
  SELECT COALESCE(SUM(amount), 0) INTO _monthly_total FROM public.transactions t JOIN public.wallets w ON w.id = t.wallet_id WHERE w.user_id = _user_id AND t.status = 'successful' AND t.created_at >= date_trunc('month', CURRENT_DATE);
  IF (_monthly_total + _amount) > _limits.monthly_limit THEN RETURN FALSE; END IF;
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  new_wallet_id UUID;
  virtual_account_num TEXT;
BEGIN
  INSERT INTO public.wallets (user_id) VALUES (NEW.user_id) RETURNING id INTO new_wallet_id;
  virtual_account_num := '99' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
  INSERT INTO public.virtual_accounts (user_id, wallet_id, account_number, account_name) VALUES (NEW.user_id, new_wallet_id, virtual_account_num, COALESCE(NEW.full_name, NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.user_id, 'user');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_tier_and_settings()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.user_tier_assignments (user_id, current_tier) VALUES (NEW.user_id, 'tier_1') ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_settings (user_id) VALUES (NEW.user_id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
