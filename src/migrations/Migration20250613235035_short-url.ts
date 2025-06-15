import { Migration } from "@mikro-orm/migrations";

export class Migration20250613235035_short_url extends Migration {
	override async up(): Promise<void> {
		const knex = this.getKnex();
		await knex.schema.createTable("short_url", (table) => {
			table.increments("id").primary();
			table.string("short_code", 6).notNullable();
			table.string("target_url", 255).notNullable();
			table.integer("owner_id").nullable();
			table.integer("click_count").defaultTo(0).notNullable();
			table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
			table.timestamp("updated_at", { useTz: true }).nullable();
			table.timestamp("deleted_at", { useTz: true }).nullable();

			table
				.foreign("owner_id")
				.references("user.id")
				.onUpdate("CASCADE")
				.onDelete("SET NULL");
		});
	}

	override async down(): Promise<void> {
		const knex = this.getKnex();
		await knex.schema.dropTableIfExists("short_url");
	}
}
