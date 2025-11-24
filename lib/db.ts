import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { Movie } from "@/entities/Movie";
import path from "path";

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "sqlite",
    database: path.join(process.cwd(), "database.sqlite"),
    entities: [User, Movie],
    synchronize: true, // Em produção, usar migrations
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}

