import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMovies1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "movies",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "synopsis",
            type: "text",
            isNullable: true,
          },
          {
            name: "coverImage",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "comments",
            type: "text",
            isNullable: true,
          },
          {
            name: "rating",
            type: "int",
            default: 0,
          },
          {
            name: "duration",
            type: "int",
            isNullable: true,
          },
          {
            name: "watched",
            type: "boolean",
            default: false,
          },
          {
            name: "userId",
            type: "int",
          },
          {
            name: "createdAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "movies",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("movies");
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("userId") !== -1
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("movies", foreignKey);
    }
    await queryRunner.dropTable("movies");
  }
}

