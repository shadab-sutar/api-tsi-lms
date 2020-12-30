import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Subjects from './Subjects';

@Entity()
export class Student {
    @PrimaryGeneratedColumn('uuid')
    public studentId: string;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @OneToMany(() => Subjects, (subject) => subject.subjectId, {})
    public subjects: Subjects[];

    @Column()
    public username: string;

    @Column()
    public password: string;
}

export default Student;