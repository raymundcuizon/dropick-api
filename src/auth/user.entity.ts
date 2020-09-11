import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRoles } from './userrole-enum';
import { Order } from '../orders/order.entity';

@Entity()
@Unique(['username', 'email', 'mobileNumber'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ default: true })
  isActivated: boolean;

  @Column({
    nullable: true,
  })
  activationCode: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column()
  mobileNumber: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.SELLER,
  })
  role: UserRoles;

  @OneToMany(type => Order, order => order.user, { eager: true })
  orders: Order[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
