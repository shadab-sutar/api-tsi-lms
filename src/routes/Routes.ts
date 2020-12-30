import { Controller } from '../controller/Controller';
const middleware = require('../middleware/Authenticator');

class Routes {
    private controller: Controller;
    constructor() {
        this.controller = new Controller();
    }

    public routes(app): void {

        //login api...
        app.route('/login').post(this.controller.login);

        //register api...
        app.route('/register').post(this.controller.register);

        //get all subjects
        app.route('/listSubjects').get(middleware.Authenticator, this.controller.listSubjects);

        //add new subjects
        app.route('/addSubject').post(middleware.Authenticator, this.controller.addSubject);

        //update a subject
        app.route('/updateSubject').post(middleware.Authenticator, this.controller.updateSubject);

        //delete a subject
        app.route('/deleteSubject').post(middleware.Authenticator, this.controller.deleteSubject);

        //mark student attendance by teacher
        app.route('/markAttendance').post(middleware.Authenticator, this.controller.markAttendance);

        //display attendance to student and teacher
        app.route('/getAttendance').get(middleware.Authenticator, this.controller.getAttendance);
    }
}

export { Routes };
