import {NextFunction, Response, Request} from 'express';
import {jwtService} from "../../application/jwt-service";
import {UsersRepository} from "../../repositories/users-repository";
import {usersCollection} from "../../db/db";



const login1 = 'admin'
const password1 = 'qwerty'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>{
    if (req.headers['authorization']!== 'Basic YWRtaW46cXdlcnR5'){
        res.sendStatus(401)
        return
    }
    return next()

}
export const authMiddlewareBearer = async (req:Request,res:Response,next:NextFunction)=>{
    if(!req.headers.authorization){
        res.send(401)
        return
    }
    const  token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    const user = await UsersRepository.findUserById(userId)
    if(user){
        req.userDto = user
        next()
        return

    }
    res.sendStatus(401)
    return
}


export const checkUniqueEmailAndLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, login } = req.body;

    // Проверяем, переданы ли email и login
    if (!email || !login) {
        res.status(400).send({ message: 'Email and login are required' });
        return;
    }

    try {
        // Ищем пользователя с указанным email или login
        const existingUser = await usersCollection.findOne({
            $or: [{ 'accountData.email': email }, { 'accountData.userName': login }]
        });

        if (existingUser) {
            res.status(400).send({ message: 'Email or login already exists' });
            return;
        }

        next(); // Продолжаем выполнение следующего middleware или обработчика маршрута
    } catch (error) {
        console.error('Error checking uniqueness', error);
        res.status(500).send({ message: 'Internal server error' });
        return;
    }
};

