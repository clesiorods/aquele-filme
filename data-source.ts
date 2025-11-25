// Carregar variáveis de ambiente
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env") });

import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Movie } from "./entities/Movie";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Movie],
  migrations: ["migrations/**/*.ts"],
  synchronize: false,
  logging: false,
});

