import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text", nullable: true })
  synopsis!: string | null;

  @Column({ type: "varchar", nullable: true })
  coverImage!: string | null;

  @Column({ type: "text", nullable: true })
  comments!: string | null;

  @Column({ type: "integer", default: 0 })
  rating!: number; // 0-5 estrelas

  @Column({ type: "integer", nullable: true })
  duration!: number | null; // Duração em minutos

  @Column({ type: "boolean", default: false })
  watched!: boolean; // true = já vi, false = quero ver

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "integer" })
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

