import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    public teacherId: string;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column()
    public username: string;

    @Column()
    public password: string;
}

export default Teacher;