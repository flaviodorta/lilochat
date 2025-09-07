import app from './app';
import sequelize from './database';
import { setupAssociations } from './models/associations';

const PORT = Number(process.env.PORT || 3000);

async function main() {
  try {
    await sequelize.authenticate();
    setupAssociations();
    console.log('✅ MySQL conectado.');
    app.listen(PORT, () => console.log(`HTTP on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Erro ao iniciar:', e);
    process.exit(1);
  }
}
main();
