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
        const result = await pool.query('SELECT COUNT(*) FROM petsync.usuarios WHERE email NOT LIKE "admin@gmail.com"');
        res.status(200).json( {data: result.rows } );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter número de usuários', err });
    }
};

module.exports = { getClienteNumber, getAnimalNumber, getUsuarioNumber }