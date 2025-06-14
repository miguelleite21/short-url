/* eslint-disable @typescript-eslint/no-unsafe-call */
import { config } from 'dotenv';
import { prompt } from 'enquirer';
import chalk from 'chalk';

config();

async function main() {
  try {
    const dbAddress = `${process.env.DB_HOST}:${process.env.DB_PORT}`;
    console.log(
      chalk.blueBright(`[Migração para o banco de dados]: ${dbAddress}`),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await prompt({
      type: 'confirm',
      name: 'sure',
      message: `Tem certeza que deseja rodar as migrations nesse servidor? (${dbAddress})`,
    });

    const sure = (response as { sure: boolean }).sure;

    if (!sure) {
      console.log(chalk.yellow('Migração cancelada pelo usuário.'));
      process.exit(1);
    }

    console.log(chalk.green('Iniciando migração...'));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('Erro na confirmação da migração:'), error);
    process.exit(1);
  }
}

void main();
