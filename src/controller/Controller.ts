import { Request, Response } from 'express';
import { createConnection, getConnectionManager, getConnection } from 'typeorm';
import Teacher from '../entity/Teacher';
import Student from '../entity/Student';
import Subjects from '../entity/Subjects';
import Attendance from '../entity/Attendance';
import * as redis from 'redis';
const tokenGen = require('./Token');

const redisPort = 6379;
const redisClient = redis.createClient(redisPort);

class Controller {
    constructor() { }

    //login user and set redis key
    public login(req: Request, res: Response) {
        createConnection().then(async connection => {
            let username = req.body.username;
            let password = req.body.password;
            let userType = req.body.userType;
            if (userType === 'T') {
                let teachers = await connection.manager.find(Teacher);
                teachers.map(teacher => {
                    if (teacher.username === username && teacher.password === password) {
                        const token = tokenGen.generateToken(username);
                        redisClient.get(username, function (err, response) {
                            if (username === response) {
                                redisClient.del(username, function (err, response) {
                                    console.log(err);
                                });
                            }
                        });
                        redisClient.setex(username, 1296000, token);
                        res.json({ token: token, message: 'LoggedIn' });
                    } else {
                        res.json({ message: "Invalid User Credentials" });
                    }
                });
            } else if (userType === 'S') {
                let students = await connection.manager.find(Student);
                students.map(student => {
                    if (student.username === username && student.password === password) {
                        const token = tokenGen.generateToken(username);
                        redisClient.setex(username, 3600, token);
                        res.json({ token: token, message: 'LoggedIn' });
                    } else {
                        res.json({ message: "Invalid User Credentials" });
                    }
                });
            }
        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }

    //register new teacher/Student
    public register(req: Request, res: Response) {
        createConnection().then(async connection => {
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let username = req.body.username;
            let password = req.body.password;
            let userType = req.body.userType;
            if (userType === 'T') {
                let teacher = new Teacher();
                teacher.firstName = firstName;
                teacher.lastName = lastName;
                teacher.username = username;
                teacher.password = password;
                await connection.manager.save(teacher);
                res.json({
                    message: 'User registered successfully'
                });
            } else if (userType === 'S') {
                let student = new Student();
                student.firstName = firstName;
                student.lastName = lastName;
                student.username = username;
                student.password = password;
                student.subjects = req.body.subjects;
                await connection.manager.save(student);
                res.json({
                    message: 'User registered successfully'
                });
            }
        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }

    //fetch all subjects
    public listSubjects(req: Request, res: Response) {
        createConnection().then(async connection => {
            console.log("Inside listSubjects");
            let subjects: Subjects[] = await connection.manager.find(Subjects);
            res.json(subjects);
        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }

    //add new subjects
    public addSubject(req: Request, res: Response) {
        createConnection().then(async connection => {
            console.log(req.body);
            let subjectDesc = req.body.subjectDesc;
            let teacher = req.body.teacher;
            let subjects = new Subjects();
            subjects.subjectDesc = subjectDesc;
            subjects.teacher = teacher;
            await connection.manager.save(subjects);
            res.json({
                message: 'Subject created successfully'
            })
        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }

    //update existing subject information
    public updateSubject(req: Request, res: Response) {
        createConnection().then(async connection => {
            let subject = new Subjects();
            let subId = req.body.subjectId;
            let subDesc = req.body.subjectDesc;
            let teacher = req.body.teacher;
            subject.subjectDesc = subDesc;
            subject.teacher = teacher;
            await connection.manager.update(Subjects, subId, subject);
            res.json({
                message: 'Subject updated successfully'
            });

        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }

    //delete a subject
    public deleteSubject(req: Request, res: Response) {
        createConnection().then(async connection => {
            let subject = new Subjects();
            let subId = req.body.subjectId;
            await connection.manager.remove(Subjects, subId);
            res.json({
                message: 'Subject deleted successfully'
            });

        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }

    //update student attendance
    public markAttendance(req: Request, res: Response) {
        createConnection().then(async connection => {
            let attendanceData = req.body;
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Attendance)
                .values(attendanceData)
                .execute()
        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }

    //get attendance status of student
    public getAttendance(req: Request, res: Response) {
        createConnection().then(async connection => {
            let attendanceData: Attendance[] = await connection.manager.find(Attendance);
            res.json(attendanceData);
        }).catch(err => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === "AlreadyHasActiveConnectionError") {
                const existentConn = getConnectionManager().get("default");
                return existentConn;
            }
            console.log(err);
            res.json(err);
        });
    }
}

export { Controller };