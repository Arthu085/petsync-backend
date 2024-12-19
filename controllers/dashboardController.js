const pool = require('../db')

const getClienteNumber = async(req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM petsync.clientes');
        res.status(200).json( {data: result.rows } );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter número de clientes', err });
    }
};

const getAnimalNumber = async(req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM petsync.animais');
        res.status(200).json( {data: result.rows } );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter número de animais', err });
    }
};

const getUsuarioNumber = async(req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM petsync.usuarios WHERE id_usuario != 6');
        res.status(200).json( {data: result.rows } );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter número de usuários', err });
    }
};

const getAgendamentoNumber = async(req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM petsync.agendamentos');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter número de agendamentos', err});
    }
};

const getAgendamentos = async(req, res) => {
    try {
        const result = await pool.query('SELECT a.id_status, a.id_agendamento, b.nome_cliente, c.nome_animal, c.especie, d.descricao_servico, e.descricao_status, a.data_hora, a.observacoes FROM petsync.agendamentos a INNER JOIN petsync.clientes b ON a.id_cliente = b.id_cliente INNER JOIN petsync.animais c ON a.id_animal = c.id_animal INNER JOIN petsync.tipos_servico d ON a.id_tipo_servico = d.id_tipo_servico INNER JOIN petsync.status_agendamento e ON a.id_status = e.id_status ORDER BY a.id_agendamento ');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter agendamentos', err });
    }
};

const editStatusAgendamento = async (req, res) => {
    const { id_agendamento } = req.params;
    const { id_status } = req.body;

    try {
        const result = await pool.query('SELECT * FROM petsync.agendamentos WHERE id_agendamento = $1', [id_agendamento]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }

        let query = 'UPDATE petsync.agendamentos SET';
        const params = [];
        let paramIndex = 1;
        let fieldsAdded = false;

        if (id_status) {
            query += ` id_status = $${paramIndex},`;
            params.push(id_status);
            paramIndex++;
            fieldsAdded = true;
        }

        if (!fieldsAdded) {
            return res.status(400).json({ message: 'Nenhum dado para atualização fornecido.' });
        }

        query = query.slice(0, -1);
        query += ' WHERE id_agendamento = $' + paramIndex;
        params.push(id_agendamento);

        const updateResult = await pool.query(query, params);

        return res.status(200).json({
            message: 'Agendamento atualizado com sucesso!',
            agendamento: updateResult.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro ao atualizar agendamento', details: err.message });
    }
};

module.exports = { getClienteNumber, getAnimalNumber, getUsuarioNumber, getAgendamentoNumber, getAgendamentos, editStatusAgendamento }