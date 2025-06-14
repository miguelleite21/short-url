import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique({ properties: ['email'] })
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  passwordHash!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;

  async setPassword(password: string): Promise<void> {
    this.passwordHash = await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }
}
