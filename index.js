const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const express = require('express');
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const clientesRoutes = require('./routes/clientes');
const animaisRoutes = require('./routes/animais');
const usuariosRoutes = require('./routes/usuarios');
const dashboardRoutes = require('./routes/dashboard');
const agendamentosRoutes = require('./routes/agendamento');

const app = express();

// Configuração do CORS para permitir todas as origens ou configurar restrições
const corsOptions = {
  origin: '*', // Permite todas as origens (você pode especificar uma URL como 'http://localhost:3000' se desejar)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

app.use(cors(corsOptions)); // Usando a configuração de CORS
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', loginRoutes);
app.use('/api', clientesRoutes); // Registrando a rota de login
app.use('/api', animaisRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', agendamentosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
