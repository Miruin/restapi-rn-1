"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routeuser_1 = __importDefault(require("./routes/routeuser"));
const config_1 = __importDefault(require("./config/config"));
const cors_1 = __importDefault(require("cors"));
class server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', config_1.default.port);
        //middleware
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('libreria'));
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use(routeuser_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('El servidor esta corriendo en el puerto: ', this.app.get('port'));
        });
    }
}
const serv = new server();
serv.start();
