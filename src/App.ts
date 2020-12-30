import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from './routes/Routes';

const redisPort = 6379;

class App {
    public app: express.Application;
    public routesCustom: Routes;
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.routesCustom = new Routes();
        this.routesCustom.routes(this.app);
    }
}

export default new App().app;