"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const service_1 = require("../helpers/service");
const config_1 = __importDefault(require("../config/config"));
const connection_1 = require("../database/connection");
class Controllersuser {
    constructor() {
    }
    reguser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, connection_1.getcon)();
                let { Username, Email, Password, Name, Lastname, descripcion } = req.body;
                if (!Username || !Email || !Password || !Name || !Lastname) {
                    return res.status(400).json({ msg: 'No se han llenado los valores correctamente' });
                }
                else {
                    const result = yield (0, connection_1.getdatosuser)(pool, Username);
                    if (result.recordset[0]) {
                        pool.close();
                        return res.status(400).send({ msg: 'Ya se esta usando este usuario' });
                    }
                    else {
                        if (!descripcion)
                            descripcion = 'Soy ' + Name + ' ' + Lastname;
                        let rondas = 10;
                        let pwh = yield bcryptjs_1.default.hash(Password, rondas);
                        yield pool.request()
                            .input('nick', mssql_1.default.VarChar, Username)
                            .input('email', mssql_1.default.VarChar, Email)
                            .input('pw', mssql_1.default.VarChar, pwh)
                            .input('nombre', mssql_1.default.VarChar, Name)
                            .input('apellido', mssql_1.default.VarChar, Lastname)
                            .input('descripcion', mssql_1.default.VarChar, descripcion)
                            .query(String(config_1.default.q1));
                        pool.close();
                        return res.status(200).send({ msg: 'Se ha registrado satisfactoriamente' });
                    }
                }
            }
            catch (e) {
                console.error(e);
                return res.status(500).send({ msg: 'Error en el servidor' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, connection_1.getcon)();
                let { Username, Password } = req.body;
                if (!Username || !Password) {
                    return res.status(400).send({ msg: 'No se han llenado los valores correctamente' });
                }
                else {
                    const result = yield (0, connection_1.getdatosuser)(pool, Username);
                    if (result.recordset[0]) {
                        const pwv = yield bcryptjs_1.default.compare(Password, result.recordset[0].pw_usuario);
                        if (pwv) {
                            pool.close();
                            return res.status(200).send({ token: (0, service_1.creartoken)(Username), msg: 'Se ha iniciado secion satisfactoriamente', nickname: Username });
                        }
                        else {
                            pool.close();
                            return res.status(200).send({ msg: 'La contrasena no coincide' });
                        }
                    }
                    else {
                        pool.close();
                        return res.status(200).send({ msg: 'No se ha encontrado el usuario' });
                    }
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ msg: 'Error en el servidor' });
            }
        });
    }
    datosuser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, connection_1.getcon)();
                const result = yield (0, connection_1.getdatosuser)(pool, String(req.user));
                let { nick_usuario, email_usuario, nombre_usuario, apellido_usuario, descripcion_usuario } = result.recordset[0];
                pool.close();
                return res.status(200).send({ nick: nick_usuario, email: email_usuario, nombre: nombre_usuario, apellido: apellido_usuario, descripcion: descripcion_usuario });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ msg: 'Error en el servidor' });
            }
        });
    }
    /*async moduser(req: Request, res: Response): Promise<any> {
    
        try {
    
            let { nick, email, na, fn} = req.body;
    
            const pool = await getcon();
            const result = await getdatosuser(pool, String(req.user));
    
            if (nick == result.recordset[0].nick_usuario && email == result.recordset[0].email_usuario &&
                na == result.recordset[0].na_usuario && fn == result.recordset[0].fn_usuario) {
    
                pool.close();
                return res.status(200).send({msg: 'No se ha cambiado ningun valor...'});
                
            } else {
    
                const result = await getdatosuser(pool, nick);
                
                if (result.recordset[0]) {
    
    
                    await pool.request()
                    .input('email', sql.VarChar, email)
                    .input('na', sql.VarChar, na)
                    .input('fn', sql.VarChar, fn)
                    .input('nickname', req.user)
                    .query(String(config.q5));
                    
                    pool.close();
                    return res.status(200).send({msg: 'Se ha actualizado satisfactoriamente'});
                } else {
    
                    await pool.request()
                    .input('nick', sql.VarChar, nick)
                    .input('email', sql.VarChar, email)
                    .input('na', sql.VarChar, na)
                    .input('fn', sql.VarChar, fn)
                    .input('nickname', req.user)
                    .query(String(config.q4));
                    pool.close();
                    return res.status(200).send({token: creartoken(nick), msg: 'Se ha actualizado satisfactoriamente'});
                    
                }
    
                
            }
            
        } catch (error) {
    
            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor'});
            
        }
    }*/
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, connection_1.getcon)();
                const result = yield (0, connection_1.getdatosuser)(pool, String(req.user));
                if (result.recordset[0]) {
                    pool.close();
                    return res.status(200).send({ msg: 'Tienes permiso para deslogearte' });
                }
                else {
                    pool.close();
                    return res.status(500).send({ msg: 'No se encuentra este usuario en la DB' });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ msg: 'Error en el servidor' });
            }
        });
    }
}
const cu = new Controllersuser();
exports.default = cu;
