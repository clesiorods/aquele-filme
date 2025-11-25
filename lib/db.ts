import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { Movie } from "@/entities/Movie";

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Movie],
    synchronize: false, // Usar migrations ao invés de synchronize
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}

