// create-admin.js
import 'dotenv/config'; // loads .env automatically
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

(async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'mannickochieng@gmail.com',
    password: 'OCHY&ABU/Tech@2026',
    options: {
      data: { role: 'admin', login_id: 'CBSI@ADMIN' }
    }
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Admin created:', data.user);
  }
})();