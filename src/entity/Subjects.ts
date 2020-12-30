import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import Teacher from './Teacher';

@Entity()
export class Subjects {
    @PrimaryGeneratedColumn('uuid')
    public subjectId: string;

    @Column()
    public subjectDesc: string;

    @Column()
    public teacher: string;
}

export default Subjects;