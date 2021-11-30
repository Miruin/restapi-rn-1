import { Request, Response} from 'express';
import sql from 'mssql';
import bcryptjs from 'bcryptjs';
import { creartoken } from "../helpers/service";
import config from "../config/config";
import { getcon, getdatosuser } from '../database/connection';

class Controllersuser {

    constructor() {
        
    }

    async reguser (req: Request, res: Response): Promise<any>{
       
        try {

            const pool = await getcon();

            let { Username, Email, Password, Name, Lastname, descripcion } = req.body;
            
            if(!Username || !Email || !Password || !Name || !Lastname) {
    
                return res.status(400).json({ msg : 'No se han llenado los valores correctamente'});
    
            } else {

                const result = await getdatosuser(pool, Username);

                if (result.recordset[0]) { 
                        
                    pool.close();
                    return res.status(400).send({msg: 'Ya se esta usando este usuario'});

                } else {

                    if(!descripcion) descripcion = 'Soy '+Name+' '+Lastname;

                    let rondas = 10;
                    let pwh = await bcryptjs.hash(Password, rondas);
                    await pool.request()
                    .input('nick', sql.VarChar, Username)
                    .input('email', sql.VarChar, Email)
                    .input('pw', sql.VarChar, pwh)
                    .input('nombre', sql.VarChar, Name)
                    .input('apellido', sql.VarChar, Lastname)
                    .input('descripcion', sql.VarChar, descripcion)
                    .query(String(config.q1));

                    pool.close();
                    return res.status(200).send({msg: 'Se ha registrado satisfactoriamente'});
                    
                }

            }
    
        } catch(e) {

            console.error(e);
            return res.status(500).send({msg: 'Error en el servidor'});

        }
    }
    
    
    async login(req: Request, res: Response): Promise<any> {
    
        try {
    
            const pool = await getcon();
    
            let { Username, Password} = req.body;
    
            if (!Username || !Password) {
    
                return res.status(400).send({ msg : 'No se han llenado los valores correctamente'});
                
            } else {
                
                const result = await getdatosuser(pool, Username);
    
                if (result.recordset[0]) {
    
                    const pwv = await bcryptjs.compare(Password, result.recordset[0].pw_usuario);
    
                    if (pwv) {
    
                        pool.close();
                        return res.status(200).send({token: creartoken(Username), msg: 'Se ha iniciado secion satisfactoriamente', nickname: Username});
                        
                    } else {

                        pool.close();
                        return res.status(200).send({msg: 'La contrasena no coincide'});

                    }
    
                } else {

                    pool.close();
                    return res.status(200).send({msg: 'No se ha encontrado el usuario'});

                } 
    
            }
            
        } catch (error) {
            
            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor'});
    
        }
    
    }
    
    async datosuser(req: Request, res: Response): Promise<any> {
    
        try {
    
            const pool = await getcon();

            const result = await getdatosuser(pool, String(req.user));
    
            let {nick_usuario, email_usuario, nombre_usuario, apellido_usuario, descripcion_usuario} = result.recordset[0];
    
            pool.close();
            
            return res.status(200).send({nick: nick_usuario, email: email_usuario, nombre: nombre_usuario, apellido: apellido_usuario, descripcion: descripcion_usuario});
            
        } catch (error) {
    
            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor'});
            
        }
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
    
    
    async logout(req: Request, res: Response): Promise<any> {

        try {

            const pool = await getcon();

            const result = await getdatosuser(pool, String(req.user));
        
            if (result.recordset[0]) {

                pool.close();
                return res.status(200).send({msg: 'Tienes permiso para deslogearte'});
        
            } else {
        
                pool.close();
                return res.status(500).send({msg: 'No se encuentra este usuario en la DB'});
        
            }
            
        } catch (error) {

            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor'});
            
        }
        
    }
    
    /*async deluser(req: Request, res: Response): Promise<any> {
    
        try {
    
            const pool = await getcon();
            const result = await getdatosuser(pool, String(req.user));
    
            if (result.recordset[0]) {
    
                await pool.request()
                .input('nick', req.user)
                .query(String(config.q6));
                pool.close();
                return res.status(200).send({msg: 'El usuario se ha eliminado'});
            } else {
    
                pool.close()
                return res.status(400).send({msg: 'No se encontro el usuario'});
            }
            
        } catch (error) {
    
            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor'});
            
        }
    
    }*/
}


const cu = new Controllersuser();

export default cu;