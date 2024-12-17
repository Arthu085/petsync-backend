const pool = require('../db')

const getAnimais = async(req, res) => {
    try {
        const result = await pool.query('SELECT a.*, c.nome_cliente FROM petsync.animais a INNER JOIN petsync.clientes c ON a.id_cliente = c.id_cliente ');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter clientes', err });
    }
};

const createAnimal = async (req, res) => {
    const {nome_animal, especie, raca, idade, peso, sexo, observacoes, id_cliente} = req.body;

    try {
        const query = `INSERT INTO petsync.animais (nome_animal, especie, raca, idade, peso, sexo, observacoes, id_cliente)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

        const values = [nome_animal, especie, raca, idade, peso, sexo, observacoes, id_cliente]

        const result = await pool.query(query, values)

        res.status(201).json({ message: 'Cliente adicionado com sucesso', data: result.rows[0] });
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(500).json({ message: 'Erro interno no servidor', err });
    }
};

const deleteAnimal = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM petsync.animais WHERE id_animal = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Animal não encontrado' });
        }

        res.status(200).json({ message: 'Animal excluído com sucesso', data: result.rows[0] });
    } catch (err) {
        console.error('Erro ao excluir animal:', err);
        res.status(500).json({ message: 'Erro interno no servidor', err });        
    }
};

const updateAnimal = async (req, res) => {
    const { id_animal } = req.params;
    const { nome_animal, especie, raca, idade, peso, sexo, observacoes, id_cliente } = req.body;
  
    let updateFields = [];
    let values = [];
  
    if (nome_animal) {
      updateFields.push(`nome_animal = $${updateFields.length + 1}`);
      values.push(nome_animal);
    }
    if (especie) {
      updateFields.push(`especie = $${updateFields.length + 1}`);
      values.push(especie);
    }
    if (raca) {
      updateFields.push(`raca = $${updateFields.length + 1}`);
      values.push(raca);
    }
    if (idade) {
      updateFields.push(`idade = $${updateFields.length + 1}`);
      values.push(idade);
    }
    if (peso) {
      updateFields.push(`peso = $${updateFields.length + 1}`);
      values.push(peso);
    }
    if (sexo) {
      updateFields.push(`sexo = $${updateFields.length + 1}`);
      values.push(sexo);
    }
    if (observacoes) {
      updateFields.push(`observacoes = $${updateFields.length + 1}`);
      values.push(observacoes);
    }
    if (id_cliente) {
      updateFields.push(`id_cliente = $${updateFields.length + 1}`);
      values.push(id_cliente);
    }
  
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }
  
    // Verifica se o cliente existe antes de atualizar
    const checkQuery = 'SELECT * FROM petsync.animais WHERE id_animal = $1';
    try {
      const checkResult = await pool.query(checkQuery, [id_animal]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
  
      const query = `
        UPDATE petsync.animais
        SET ${updateFields.join(', ')}
        WHERE id_animal = $${updateFields.length + 1}
        RETURNING *;
      `;
      values.push(id_animal);
  
      const result = await pool.query(query, values);
      res.status(200).json({ message: 'Animal atualizado com sucesso', data: result.rows[0] });
    } catch (error) {
      console.error('Erro ao atualizar Animal:', error);
      res.status(500).json({ message: 'Erro ao atualizar animal', error });
    }
  };

module.exports = { getAnimais, createAnimal, deleteAnimal, updateAnimal }