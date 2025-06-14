import { Migration } from '@mikro-orm/migrations';
import * as bcrypt from 'bcrypt';

export class Migration20250613SeedAdmin extends Migration {
  async up(): Promise<void> {
    const password = await bcrypt.hash('admin123', 10);
    this.addSql(`
      insert into "user" ( email, "passwordHash", "createdAt")
      values ( 'admin@shorturl.com', '${password}', now());
    `);
  }
  down(): void {
    this.addSql(`delete from "user" where email = 'admin@shorturl.com';`);
  }
}
