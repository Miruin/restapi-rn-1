"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("../helpers/service");
const controllersUser_1 = __importDefault(require("../controllers/controllersUser"));
class Rutasuser {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post('/registro', controllersUser_1.default.reguser);
        this.router.post('/log', controllersUser_1.default.login);
        this.router.get('/log', service_1.auth, controllersUser_1.default.logout);
        this.router.get('/perfil', service_1.auth, controllersUser_1.default.datosuser);
        this.router.get('/perfil/:username', service_1.auth, controllersUser_1.default.getuser);
    }
}
const rutauser = new Rutasuser();
exports.default = rutauser.router;
