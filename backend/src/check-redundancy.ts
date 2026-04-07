import { query } from './db/connection.js';

async function checkRedundancy() {
  try {
    const res = await query(`
      SELECT id, title, slug 
      FROM games 
      WHERE title ILIKE '% Codes' 
         OR title ILIKE '% codes'
         OR slug ILIKE '%-codes'
      LIMIT 100
    `);

    console.log(`Found ${res.rows.length} potentially redundant entries:`);
    console.log('----------------------------------------------------');
    res.rows.forEach(row => {
      console.log(`ID: ${row.id.toString().padEnd(5)} | Title: ${row.title.padEnd(40)} | Slug: ${row.slug}`);
    });
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    process.exit();
  }
}

checkRedundancy();
