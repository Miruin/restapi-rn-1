import { Request, Response, Router} from 'express';
import { auth } from '../helpers/service';
import controllersuser from '../controllers/controllersUser';

class Rutasuser{

    router: Router;

    constructor() {

        this.router = Router();      
        this.routes();

    }

    routes() {
        
        this.router.post('/registro', controllersuser.reguser);

        this.router.post('/log', controllersuser.login);

        this.router.get('/log', auth, controllersuser.logout);

        this.router.get('/perfil', auth, controllersuser.datosuser);

        this.router.get('/perfil/:username', auth, controllersuser.getuser);



    }
 
}

const rutauser = new Rutasuser();

export default rutauser.router;


