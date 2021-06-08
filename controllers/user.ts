import {Request, Response} from 'express';
import {User} from '../db/models/user';

export const getUserPage = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const user = await User.findOne({where: {uid: uid}});
        if (user) {
            res.render('user/user', {
                title: 'Account',
                username : user.getDataValue('username')
            })
        }
        else {
            res.status(404).send();
        }
        
    }
    catch (err) {
        res.status(500).json({'message' : err.message})
    }
}