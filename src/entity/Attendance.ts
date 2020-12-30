import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public subjectId: string;

    @Column()
    public studentId: string;

    @Column()
    public status: string;
}

export default Attendance;