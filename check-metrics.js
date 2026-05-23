const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://whomyggjgyuxfljuvmqa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indob215Z2dqZ3l1eGZsanV2bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQyMjksImV4cCI6MjA5NDM0MDIyOX0.8Up0YHdMAa4b4O2JDgmWOAaiOSTXzcpuAdPHOjhUNxQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data } = await supabase.from('metricas').select('*').limit(5).order('created_at', { ascending: false });
  console.log(data);
  
  if (data && data.length > 0) {
    const dbDateStr = data[0].created_at;
    const dbDate = new Date(dbDateStr);
    console.log("DB Date Str:", dbDateStr);
    console.log("Parsed Date:", dbDate.toString());
    console.log("toDateString:", dbDate.toDateString());
    console.log("Current Date toDateString:", new Date().toDateString());
  }
}
check();
