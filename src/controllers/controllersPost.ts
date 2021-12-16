import { Request, Response} from 'express';
import fs from 'fs';
import mimeTypes from 'mime-types';
import sql from 'mssql';
import path from 'path';
import config from "../config/config";
import { getcon, getdatosuser } from '../database/connection';

class Controllerspost {

    constructor() {
        
    }

    async crearPost(req: Request, res: Response): Promise<any> {

        let {descripcionpost, archivoUri, archivoName, archivoType} = req.body;
        
        let nick = req.user
        let autor = req.user 
        
        try {
            
            const pool = await getcon();

            if (!req.file) {

                if(archivoUri && archivoName && archivoType){

                    console.log('a trabajar la imagen malditasea...');
                    let archivoMetaData = archivoUri.split(",")
                    let urldirectorio = "public/post/"+req.user
                    let mimeT = archivoName.split('.')

                    if (archivoType == 'image/jpg') {

                        archivoType = 'image/jpeg'

                    }

                    let name_archivo = Date.now()+"-"+req.user+"."+mimeTypes.extension(archivoType);
                    let urlarchivo = "https://restapi-twitterclone1.herokuapp.com/post/"+req.user+"/"+name_archivo;
                
                    if( !fs.existsSync(urldirectorio) ){

                        fs.mkdirSync(urldirectorio, { recursive: true });
            
                    }

                    fs.writeFile(urldirectorio+'/'+name_archivo, archivoMetaData[1], 'base64', (error) =>{

                        if(error){

                            console.error(error);
                            
                        }

                    });

                    await pool.request()
                    .input('nick', sql.VarChar, nick)
                    .input('autor', sql.VarChar, autor)
                    .input('descripcionpost', sql.VarChar, descripcionpost)
                    .input('archivourlpost', sql.VarChar, urlarchivo)
                    .query(String(config.q4));
                    
    
                    pool.close();
                    return res.status(200).send({msg: 'Se ha guardado el post satisfactoriamente'});
                    
                }

                if (descripcionpost) {

                    await pool.request()
                    .input('nick', sql.VarChar, nick)
                    .input('autor', sql.VarChar, autor)
                    .input('descripcionpost', sql.VarChar, descripcionpost)
                    .query(String(config.q3));

                    pool.close();
                    return res.status(200).send({msg: 'Se ha guardado el post satisfactoriamente'});
                    
                }

                pool.close();    
                return res.status(400).send({ msg: 'No se han llenado los campos'});
                
            } else {

                let urlarchivo = "https://restapi-twitterclone1.herokuapp.com/post/"+req.user+"/"+req.file?.filename;
                
                await pool.request()
                .input('nick', sql.VarChar, nick)
                .input('autor', sql.VarChar, autor)
                .input('descripcionpost', sql.VarChar, descripcionpost)
                .input('archivourlpost', sql.VarChar, urlarchivo)
                .query(String(config.q4));
                

                pool.close();
                return res.status(200).send({msg: 'Se ha guardado el post satisfactoriamente'});
                                 
            }

        } catch (error) {

            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor al guardar el post'});
            
        } 

    }

    async borrarPost(req: Request, res: Response): Promise<any>{

        let id = req.params.id
        let nick = req.user
        try {
            
            let e = null ;
            const pool = await getcon();

            const result = await pool.request()
            .input('id', id)
            .query(String(config.q5));
            
            if (result.recordset[0]) {

                if (!(result.recordset[0].nick_usuario == nick)) 
                return res.status(400).send({msg: 'no tienes permitido borrar post de otros usuarios'})

                if (result.recordset[0].archivourl_post) {
                
                    let urlarchivo = 'public/post/'+nick+'/'+path.basename(result.recordset[0].archivourl_post);

                    fs.stat(urlarchivo, (error, stats) =>{

                        if(error){

                            console.error(error);
                            e = error
                        
                        }else{       

                            fs.unlink(urlarchivo,(error) => {

                                if (error) {
        
                                    e = error
                                    console.error(error);

                                }
        
                            }); 

                        }

                    });

                }
                await pool.request()
                .input('id', id)
                .query(String(config.q6));

                pool.close();
                return res.status(200).send({msg: 'Se ha borrado el post satisfactoriamente', msgErr: e})
                
            } else {

                pool.close();
                return res.status(400).send({msg: 'Error no se ha encontrado el post'})
                
            }

        } catch (error) {

            console.log(error);
            return res.status(500).send({msg: 'Error en el servidor al borrar'})
            
        }

    }

    async getMyPosts(req: Request, res: Response): Promise<any>{

        let username = req.user;

        try {

            const pool = await getcon();

            const result = await pool.request()
            .input('username', username)
            .query(String(config.q7));

            if (result.recordset[0]) {

                pool.close();
                return res.status(200).send(result.recordset);
                
            }

            pool.close();
            return res.status(400).send({msg: 'No has creado ningun post'});
            
        } catch (error) {
            
            console.error(error);
            
        }
        
    }

    async getDatosPosts(req: Request, res: Response): Promise<any>{

        let username = req.params.username;

        try {
            
            const pool = await getcon();
            
            const result = await pool.request()
            .input('username', username)
            .query(String(config.q7));

            if (result.recordset) {

                pool.close();
                return res.status(200).send(result.recordset);
                
            }

            const result1 = await getdatosuser(pool, username);

            if (!result1.recordset[0]) 
            return res.status(400).send({msg: 'Error  no se encuentra el usuario'});

            pool.close();
            return res.status(200).send({msg: 'Este usuario no tiene creado ningun post o los ha eliminado'});

        } catch (error) {

            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor al pedir datos'});
            
        }

    }


}

const controllerspost = new Controllerspost();

export default controllerspost;