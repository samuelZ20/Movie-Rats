const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verifica se o header de autorização está presente
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  // Verifica se o formato do token está correto (Bearer token)
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido.' });
  }
  const token = parts[1];
  
  // Verifica e decodifica o token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    req.user = decoded; // Adiciona o payload do token na requisição
    return next(); // Passa para o próximo middleware ou rota
  });
}

module.exports = authMiddleware; // Exporta APENAS o authMiddleware