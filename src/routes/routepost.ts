import { Router } from 'express';
import { auth } from '../helpers/service';
import controllerspost from '../controllers/controllersPost';
import { upload } from '../helpers/service';

class Rutaspost{

    router: Router;

    constructor() {

        this.router = Router();
        this.routes();

    }
   
    routes() {
        
        this.router.post('/post', auth, upload.single('archivo'), controllerspost.crearPost);

        this.router.get('/posts', auth, controllerspost.getMyPosts);

        this.router.delete('/post/:id', auth, controllerspost.borrarPost);

        this.router.get('/posts/:username', auth, controllerspost.getDatosPosts);


    }
 
}

const rutapost = new Rutaspost();

export default rutapost.router