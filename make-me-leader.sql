-- Make yourself a leader (replace with your actual phone or email)
UPDATE profiles
SET is_leader = TRUE, leader_approved_at = NOW()
WHERE phone = 'YOUR_PHONE_NUMBER'; -- or use: WHERE email = 'your@email.com'

-- Verify it worked
SELECT full_name, phone, is_leader FROM profiles WHERE is_leader = TRUE;
