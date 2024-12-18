const pool = require('../db')

const createAgendamento = async (req, res) => {
    const {id_cliente, id_animal, id_tipo_servico, id_status, data_hora, observacoes} = req.body

    try {
        const query = `INSERT INTO petsync.agendamentos (id_cliente, id_animal, id_tipo_servico, id_status, data_hora, observacoes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

        const values = [id_cliente, id_animal, id_tipo_servico, id_status, data_hora, observacoes];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Agendamento adicionado com sucesso', data: result.rows[0] });
    } catch (err) {
        console.error('Erro ao adicionar agendamento', err);
        res.status(500).json({ message: 'Erro interno no servidor', err })
    }
};

module.exports = { createAgendamento }