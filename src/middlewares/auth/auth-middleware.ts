import {NextFunction, Response, Request} from 'express';
import {jwtService} from "../../application/jwt-service";
import {UsersRepository} from "../../repositories/users-repository";



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

