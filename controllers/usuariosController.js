const pool = require('../db');
const bcrypt = require('bcrypt');

const getUsuario = async (req, res) => {
    try {
      const result = await pool.query('SELECT a.*, b.nome_acesso FROM petsync.usuarios a INNER JOIN petsync.acessos b ON a.id_acesso = b.id_acesso WHERE a.email <> $1 ORDER BY a.id_usuario', 
        ['admin@gmail.com']); 
      res.status(200).json({ data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao obter usuários', err });
    }
  };

const deleteUsuario = async (req, res) => {
    const id  = req.params.id;

    try {
        const query = 'DELETE FROM petsync.usuarios WHERE id_usuario = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário excluido com sucesso', data: result.rows[0] });
    } catch (err) {
        console.error('Erro ao excluir usuário', err);
        res.status(500).json({ message: 'Erro interno no servidor', err});
    }
};

const editUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    const { email, senha, id_acesso } = req.body; // Use id_acesso consistentemente

    try {
        const result = await pool.query('SELECT * FROM petsync.usuarios WHERE id_usuario = $1', [id_usuario]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        let query = 'UPDATE petsync.usuarios SET';
        const params = [];
        let paramIndex = 1;
        let fieldsAdded = false;

        if (email) {
            query += ` email = $${paramIndex},`;
            params.push(email);
            paramIndex++;
            fieldsAdded = true;
        }

        if (senha) {
            const hashedPassword = await bcrypt.hash(senha, 10);
            query += ` senha = $${paramIndex},`;
            params.push(hashedPassword);
            paramIndex++;
            fieldsAdded = true;
        }

        if (id_acesso) {
            const idAcessoNumber = parseInt(id_acesso, 10);
            query += ` id_acesso = $${paramIndex},`;
            params.push(idAcessoNumber);
            paramIndex++;
            fieldsAdded = true;
        }

        if (!fieldsAdded) {
            return res.status(400).json({ message: 'Nenhum dado para atualização fornecido.' });
        }

        query = query.slice(0, -1);
        query += ' WHERE id_usuario = $' + paramIndex;
        params.push(id_usuario);

        const updatedResult = await pool.query(query, params);

        return res.status(200).json({
            message: 'Usuário atualizado com sucesso!',
            usuario: updatedResult.rows[0] // Pode ser null se nada foi atualizado
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar o usuário', details: err.message }); // Inclua detalhes do erro para depuração
    }
};

module.exports = { getUsuario, deleteUsuario, editUsuario }