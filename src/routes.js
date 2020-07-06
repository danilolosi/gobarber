import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
    const user = await User.create({
        name: 'Danilo Losi',
        email: 'danilo.lsanctis@hotmail.com',
        password_hash: '65d465sa4d',
    });

    return res.json(user);
});

export default routes;
