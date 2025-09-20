
const { Pool } = require('pg');

// Configuração simplificada e robusta
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  // Configuração CORS completa
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Resposta prévia para OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas GET permitido
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Teste de conexão simples
    const result = await pool.query('SELECT NOW() as current_time');
    
    return res.status(200).json({
      status: 'connected',
      database: 'PostgreSQL',
      timestamp: result.rows[0].current_time,
      message: 'Conexão bem-sucedida com o banco de dados'
    });
    
  } catch (error) {
    console.error('Erro na conexão com o banco:', error);
    
    return res.status(500).json({
      status: 'error',
      error: 'Falha na conexão com o banco de dados',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Verifique as configurações do banco'
    });
  }
}
