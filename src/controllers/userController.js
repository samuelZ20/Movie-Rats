
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database'); 

// objeto que guardará todas as funções do controller
const userController = {
  //REGISTRAR um novo usuário ---
  async create(req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    try {
      const hashDaSenha = await bcrypt.hash(senha, 10);
      const resultado = await db.query(
        'INSERT INTO usuarios (nome, email, senha, nivel) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, nivel',
        [nome, email, hashDaSenha, 'padrao']
      );
      return res.status(201).json({ message: 'Usuário registrado com sucesso!', usuario: resultado.rows[0] });
    } catch (error) {
      console.error('❌ Erro ao registrar usuário:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Este e-mail já está em uso.' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },
  //LISTAR todos os usuários ---
  async listAll(req, res) {
    try {
      const resultado = await db.query('SELECT id, nome, email, nivel FROM usuario');
      return res.status(200).json(resultado.rows);
    } catch (error) {
      console.error('❌ Erro ao listar usuários:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

  //UPDATE de um usuário
  async update(req, res) {
    const userId = req.params.id;
    const { nome, email, senha, nivel } = req.body;
    try {
      const campos = [];
      const valores = [];
      let indice = 1;
      if (nome) {
        campos.push(`nome = $${indice++}`);
        valores.push(nome);
      }
      if (email) {
        campos.push(`email = $${indice++}`);
        valores.push(email);
      }
      if (senha) {
        const hashDaSenha = await bcrypt.hash(senha, 10);
        campos.push(`senha = $${indice++}`);
        valores.push(hashDaSenha);
      }
      if (nivel) {
        campos.push(`nivel = $${indice++}`);
        valores.push(nivel);
      }
      if (campos.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
      }
      valores.push(userId);
      const query = `UPDATE usuario SET ${campos.join(', ')} WHERE id = $${indice} RETURNING id, nome, email, nivel`;
      const resultado = await db.query(query, valores);
      return res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario: resultado.rows[0] });
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

  //DELETE de um usuário
  async delete(req, res) {
    const userId = req.params.id;
    try {
      await db.query('DELETE FROM usuario WHERE id = $1', [userId]);
      return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

  //LOGIN de um usuário ---
  async login(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    try {
      const resultado = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
      if (resultado.rows.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }
      const usuario = resultado.rows[0];
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }
      const payload = { id: usuario.id, nivel: usuario.nivel };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login bem-sucedido!', token: token });
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};

// Exporta o objeto com todas as funções
module.exports = userController;