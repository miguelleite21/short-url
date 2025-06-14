import { Migration } from '@mikro-orm/migrations';

export class Migration20250613234955_users extends Migration {
  override async up(): Promise<void> {
    const knex = this.getKnex();
    await knex.schema.createTable('user', (table) => {
      table.increments('id').primary();
      table.string('email', 255).notNullable();
      table.string('password_hash', 255).notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('updated_at', { useTz: true }).nullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();

      table.unique(['email']);
    });
  }

  override async down(): Promise<void> {
    const knex = this.getKnex();
    await knex.schema.dropTableIfExists('user');
  }
}
