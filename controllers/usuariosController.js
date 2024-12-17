const pool = require('../db');
const bcrypt = require('bcrypt');

const getUsuario = async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM petsync.usuarios WHERE id_usuario != 6 ORDER BY id_usuario');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter usuários', err });
    }
};

const deleteUsuario = async (req, res) => {
    const [ id ] = req.params.id;

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
    const { email, senha } = req.body;

    try {
        // Verificar se o usuário existe
        const result = await pool.query('SELECT * FROM petsync.usuarios WHERE id_usuario = $1', [id_usuario]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Preparar os campos para a atualização
        let query = 'UPDATE petsync.usuarios SET';
        const params = [];
        let paramIndex = 1;

        // Flag para verificar se algo foi adicionado à query
        let fieldsAdded = false;

        // Se o novo email foi fornecido, adicionar à query
        if (email) {
            query += ` email = $${paramIndex},`;
            params.push(email);
            paramIndex++;
            fieldsAdded = true;
        }

        // Se a nova senha foi fornecida, adicionar à query
        if (senha) {
            // Gerar o hash da nova senha
            const hashedPassword = await bcrypt.hash(senha, 10);
            query += ` senha = $${paramIndex},`;
            params.push(hashedPassword);
            paramIndex++;
            fieldsAdded = true;
        }

        // Se nenhum campo foi adicionado, retornar erro
        if (!fieldsAdded) {
            return res.status(400).json({ message: 'Nenhum dado para atualização fornecido.' });
        }

        // Remover a vírgula final
        query = query.slice(0, -1);

        // Finalizar a query
        query += ' WHERE id_usuario = $' + paramIndex;
        params.push(id_usuario);

        // Executar a atualização no banco de dados
        const updatedResult = await pool.query(query, params);

        // Enviar resposta de sucesso
        return res.status(200).json({
            message: 'Usuário atualizado com sucesso!',
            usuario: updatedResult.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
    }
};

module.exports = { getUsuario, deleteUsuario, editUsuario }