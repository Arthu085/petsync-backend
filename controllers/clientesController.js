const pool = require('../db'); // Importa a configuração do banco de dados

const createCliente = async (req, res) => {
  const { nome_cliente, email, telefone, endereco, cpf } = req.body;

  try {
    const query = `
      INSERT INTO petsync.clientes (nome_cliente, email, telefone, endereco, cpf)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nome_cliente, email, telefone, endereco, cpf];
    
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Cliente adicionado com sucesso', data: result.rows[0] });
  } catch (err) {
    console.error('Erro ao adicionar cliente:', err);
    res.status(500).json({ message: 'Erro interno no servidor', err });
  }
};

const getClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM petsync.clientes ORDER BY id_cliente');
    res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter clientes', err });
  }
};

const deleteCliente = async (req, res) => {
  const { id } = req.params;  // Obtemos o ID do cliente a partir da URL

  try {
    const query = 'DELETE FROM petsync.clientes WHERE id_cliente = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(200).json({ message: 'Cliente excluído com sucesso', data: result.rows[0] });
  } catch (err) {
    console.error('Erro ao excluir cliente:', err);
    res.status(500).json({ message: 'Erro interno no servidor', err });
  }
};

const updateCliente = async (req, res) => {
  const { id_cliente } = req.params;
  const { nome_cliente, email, telefone, endereco, cpf } = req.body;

  let updateFields = [];
  let values = [];

  if (nome_cliente) {
    updateFields.push(`nome_cliente = $${updateFields.length + 1}`);
    values.push(nome_cliente);
  }
  if (email) {
    updateFields.push(`email = $${updateFields.length + 1}`);
    values.push(email);
  }
  if (telefone) {
    updateFields.push(`telefone = $${updateFields.length + 1}`);
    values.push(telefone);
  }
  if (endereco) {
    updateFields.push(`endereco = $${updateFields.length + 1}`);
    values.push(endereco);
  }
  if (cpf) {
    updateFields.push(`cpf = $${updateFields.length + 1}`);
    values.push(cpf);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'Nenhum campo para atualizar' });
  }

  // Verifica se o cliente existe antes de atualizar
  const checkQuery = 'SELECT * FROM petsync.clientes WHERE id_cliente = $1';
  try {
    const checkResult = await pool.query(checkQuery, [id_cliente]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const query = `
      UPDATE petsync.clientes
      SET ${updateFields.join(', ')}
      WHERE id_cliente = $${updateFields.length + 1}
      RETURNING *;
    `;
    values.push(id_cliente);

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Cliente atualizado com sucesso', data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente', error });
  }
};

module.exports = { createCliente, getClientes, deleteCliente, updateCliente };
