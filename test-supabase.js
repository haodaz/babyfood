const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hnynzkzdbyluqhvlshin.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueW56a3pkYnlsdXFodmxzaGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NTE0MDcsImV4cCI6MjEwMjEyNzQwN30.1w3v90SCsjrKtfdQUYYABX1ORr26Tv3XUo-wQMID-98'
);

async function test() {
  const { data, error } = await supabase.from('food_records').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Connection successful! Data:', data);
  }
}

test();
