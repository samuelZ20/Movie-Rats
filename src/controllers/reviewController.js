const db = require('../database');

const reviewController = {
  //CRIAR review
  async create(req, res) {
  //O id do filme virá dos parâmetros da rota
    const { filme_id } = req.params;
  // O ID do usuário virá do token JWT que o authMiddleware decodificou
    const { id: usuario_id } = req.user;
  //O conteúdo e a nota virão do corpo da requisição
    const { conteudo_texto, nota } = req.body;

    if (!conteudo_texto || !nota) {
      return res.status(400).json({ error: 'O conteúdo e a nota são obrigatórios.' });
    }

    try {
    // Insere a nova review no banco de dados
      const resultado = await db.query(
        'INSERT INTO review (conteudo_texto, nota, usuario_id, filme_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [conteudo_texto, nota, usuario_id, filme_id]
      );
      return res.status(201).json({ message: 'Review adicionada com sucesso!', review: resultado.rows[0] });
    } catch (error) {
      console.error('❌ Erro ao adicionar review:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

  //LISTAR reviews de um filme específico
  async listByFilme(req, res) {
    const { filme_id } = req.params;
    try {
    // Busca todas as reviews do filme no banco de dados
      const resultado = await db.query('SELECT * FROM review WHERE filme_id = $1', [filme_id]);
      return res.status(200).json(resultado.rows);
    } catch (error) {
      console.error('❌ Erro ao listar reviews:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

//ATUALIZAR reviews dos filmes
async update(req, res) {
    const { id } = req.params; 
    const { id: userId, nivel: userNivel } = req.user; 
    const { conteudo_texto, nota } = req.body;

    if (!conteudo_texto || !nota) {
      return res.status(400).json({ error: 'O conteúdo e a nota são obrigatórios.' });
    }

    try {
      // Primeiro, verifica se a review existe e pertence ao usuário logado ou se o usuário é admin
      const checkReview = await db.query('SELECT usuario_id FROM review WHERE id = $1', [id]);

      if (checkReview.rowCount === 0) {
        return res.status(404).json({ error: 'Review não encontrada.' });
      }

      const reviewOwnerId = checkReview.rows[0].usuario_id;

      // Só permite a atualização se o usuário for o dono da review OU se for admin
      if (reviewOwnerId !== userId && userNivel !== 'admin') {
        return res.status(403).json({ error: 'Permissão negada para atualizar esta review.' });
      }

      // Se a permissão for concedida, atualiza a review
      const resultado = await db.query(
        'UPDATE review SET conteudo_texto = $1, nota = $2 WHERE id = $3 RETURNING *',
        [conteudo_texto, nota, id]
      );

      return res.status(200).json({ message: 'Review atualizada com sucesso!', review: resultado.rows[0] });
    } catch (error) {
      console.error('❌ Erro ao atualizar review:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

//DELETAR reviews 
async deleteById(req, res) {
    const { id } = req.params;
    const { id: userId, nivel: userNivel } = req.user;
    try {
      // Primeiro, verifica se a review existe e pertence ao usuário logado ou se o usuário é admin
      const checkReview = await db.query('SELECT usuario_id FROM review WHERE id = $1', [id]);
      if (checkReview.rowCount === 0) {
        return res.status(404).json({ error: 'Review não encontrada.' });
      }
      const reviewOwnerId = checkReview.rows[0].usuario_id;

      // Só permite a exclusão se o usuário for o dono da review OU se for admin
      if (reviewOwnerId !== userId && userNivel !== 'admin') {
        return res.status(403).json({ error: 'Permissão negada para deletar esta review.' });
      }

      // Se a permissão for concedida, deleta a review
      await db.query('DELETE FROM review WHERE id = $1', [id]);
      return res.status(204).send();
    } catch (error) {
      console.error('❌ Erro ao deletar review:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};
module.exports = reviewController;
