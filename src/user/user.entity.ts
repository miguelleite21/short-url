import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
@Unique({ properties: ["email"] })
export class User {
	@PrimaryKey()
	id!: number;

	@Property()
	email!: string;

	@Property()
	passwordHash!: string;

	@Property({ onCreate: () => new Date() })
	createdAt?: Date = new Date();

	@Property({ onUpdate: () => new Date(), nullable: true })
	updatedAt?: Date;

	@Property({ nullable: true })
	deletedAt?: Date;
}
