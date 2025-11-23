const db = require('../database');

const filmeController = {
  //CRIAR um novo filme
  async create(req, res) {
    const { titulo, diretor, ano, sinopse } = req.body;
  // Validação básica: Titulo é obrigatório
    if (!titulo) {
      return res.status(400).json({ error: 'O título é obrigatório.' });
    }
    try {
    // Insere o novo filme no banco de dados
      const resultado = await db.query(
        'INSERT INTO filme (titulo, diretor, ano, sinopse) VALUES ($1, $2, $3, $4) RETURNING *',
        [titulo, diretor, ano, sinopse]
      );
      return res.status(201).json({ message: 'Filme adicionado com sucesso!', filme: resultado.rows[0] });
    } catch (error) {
      console.error('❌ Erro ao adicionar filme:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

  //LISTAR todos os filmes
  async listAll(req, res) {
    try {
  // Busca todos os filmes no banco de dados 
      const resultado = await db.query('SELECT * FROM filme');
      return res.status(200).json(resultado.rows);
    } catch (error) {
      console.error('❌ Erro ao listar filmes:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

//ATUALIZAR filmes
async update (req, res) {
  const { id } = req.params;
  const { titulo, diretor, ano, sinopse } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }

  try {
  // Atualiza o filme no banco de dados
    const resultado = await db.query(
      'UPDATE filme SET titulo = $1, diretor = $2, ano = $3, sinopse = $4 WHERE id = $5 RETURNING *',
      [titulo, diretor, ano, sinopse, id]
    );
  //Se rowCount for 0, nenhum filme foi encontrado com o ID fornecido
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Filme não encontrado.' });
    }

    return res.status(200).json({ message: 'Filme atualizado com sucesso!', filme: resultado.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao atualizar filme:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
},

//DELETAR filmes PELO ID
async deleteById(req, res) {
  const { id } = req.params;

  try {
    const resultado = await db.query('DELETE FROM filme WHERE id = $1', [id]);
  //Verifica se algo foi realmente deletado
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Filme não encontrado.' });
    }
  // Retorna status 204 No Content para indicar sucesso sem conteúdo
    return res.status(204).send();

  } catch (error) {
    console.error('❌ Erro ao deletar filme:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
};
module.exports = filmeController;