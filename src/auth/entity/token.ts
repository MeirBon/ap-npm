import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity, JoinColumn, ManyToOne
} from "typeorm";
import User from "./user";

@Entity()
export default class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(type => User, user => user.tokens)
  user: User;
}