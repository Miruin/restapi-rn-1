import { Request, Response, Router} from 'express';
import { auth } from '../helpers/service';
import cu from '../controllers/controllersUser';

class Rutasuser{

    router: Router;

    constructor() {

        this.router = Router();      
        this.routes();

    }

    routes() {
        
        this.router.post('/registro', cu.reguser);

        this.router.post('/log', cu.login);

        this.router.get('/log', auth, cu.logout);

        this.router.get('/perfil', auth, cu.datosuser);

        this.router.get('/buscar/:username', (req: Request, res: Response) => {

            console.log(req.params.username);
            res.send({nick: req.params.username})
            
        })

        //this.router.put('/actualizar', auth, cu.moduser);

        //this.router.delete('/eliminar', auth, cu.deluser);

    }
 
}

const ru = new Rutasuser();

export default ru.router;


