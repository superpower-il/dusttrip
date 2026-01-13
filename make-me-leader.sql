-- Make yourself a leader (replace YOUR_EMAIL with your actual email)
UPDATE profiles
SET is_leader = TRUE, leader_approved_at = NOW()
WHERE phone = '0545656675'; -- or use your email/phone to identify yourself

-- Verify it worked
SELECT full_name, phone, is_leader FROM profiles WHERE is_leader = TRUE;
