import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from '../../user/user.entity';

@Entity()
export class ShortUrl {
  @PrimaryKey()
  id!: number;

  @Property({ length: 6 })
  shortCode!: string;

  @Property()
  targetUrl!: string;

  @ManyToOne(() => User, { nullable: true })
  owner?: User;

  @Property({ default: 0 })
  clickCount: number = 0;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;
}
