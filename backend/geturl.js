require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');
(async () => {
  const { data } = await supabaseAdmin.from('documents').select('storage_path').limit(1);
  const path = data?.[0]?.storage_path;
  if (path) {
    const r = await supabaseAdmin.storage.from('documents').createSignedUrl(path, 3600);
    console.log(r.data?.signedUrl);
  }
})();