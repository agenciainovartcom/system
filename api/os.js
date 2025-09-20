const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST - CREATE OS
  if (req.method === 'POST') {
    try {
      const d = req.body;
      
      const query = `
        INSERT INTO ordens_servico (
          os_number, entry_date, client_name, document, rg,
          phone, email, address, brand, model, serial,
          service, details, problem, pattern, numeric_password,
          value, report, damages, sign_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *`;
      
      const values = [
        d.os_number, d.entry_date, d.client_name, d.document, d.rg,
        d.phone, d.email, d.address, d.brand, d.model, d.serial,
        d.service, d.details, d.problem, d.pattern, d.numeric_password,
        d.value, d.report, d.damages, d.sign_date
      ];
      
      const result = await pool.query(query, values);
      
      return res.status(201).json({ 
        success: true,
        data: result.rows[0]
      });
      
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // GET - LIST OS
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM ordens_servico ORDER BY id DESC LIMIT 100'
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: error.message 
      });
    }
  }

  // Default response
  return res.status(405).json({ 
    error: 'Method not allowed' 
  });
};
