import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany
} from "typeorm";
import Token from "./token";

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() username: string;

  @Column() password: string;

  @Column() email: string;

  @OneToMany(type => Token, token => token.user)
  @JoinColumn()
  tokens: Token[];
}

export default User;
export { User };
