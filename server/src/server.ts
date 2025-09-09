import app from './app';
import sequelize from './database';
import { setupAssociations } from './models/associations';
import http from 'http';
import { setupSocket } from './realtime/socket';

const PORT = Number(process.env.PORT || 3333);

async function main() {
  try {
    await sequelize.authenticate();
    setupAssociations();
    console.log('✅ MySQL conectado.');

    const server = http.createServer(app);

    setupSocket(server);

    server.listen(PORT, () => console.log(`HTTP on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Erro ao iniciar:', e);
    process.exit(1);
  }
}
main();
