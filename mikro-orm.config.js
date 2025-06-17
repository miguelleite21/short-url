require('dotenv').config();

module.exports = {
  driver: require('@mikro-orm/postgresql').PostgreSqlDriver,
  discovery: {
    warnWhenNoEntities: false,
  },
  entities: ['./dist/urls/entities/*.entity.js', './dist/user/*.entity.js'],
  migrations: {
    path: './dist/migrations',
    transactional: false,
  },
  dbName:   process.env.DB_NAME,
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  debug:    false,
};
