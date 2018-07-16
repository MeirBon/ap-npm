import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne
} from "typeorm";
import User from "./user";

@Entity()
class Token extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() token: string;

  @ManyToOne(type => User, user => user.tokens)
  user: User;
}

export default Token;

export { Token };
