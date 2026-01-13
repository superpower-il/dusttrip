-- Drop the automatic trigger (we'll handle profile creation manually in the app)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
