import { Response, Request, Router} from "express";
import {UsersService} from "../domain/users-service";
import {RequestWithBody} from "../types/common";
import {LoginUserType, UserMongoDbType} from "../types/users/inputUsersType";
import {jwtService} from "../application/jwt-service";
import {WithId} from "mongodb";
import {CurrentUserType} from "../types/users/outputUserType";
import {authMiddlewareBearer} from "../middlewares/auth/auth-middleware";
import {UserQueryRepository} from "../repositories/query-user-repository";

export const authRouter = Router({})

authRouter.post('/login', async (req: RequestWithBody<LoginUserType>, res: Response) =>{
    const user:WithId<UserMongoDbType> | null = await UsersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(!user){
        res.sendStatus(401)
        return
    }
        const token = await jwtService.createJWT(user)
        res.status(200).send({accessToken:token})
})
authRouter.get('/me', authMiddlewareBearer, async (req: Request, res: Response<CurrentUserType>) => {

    const user = req.userDto

    return res.status(200).json({
        "login": user.userName,
        "email": user.email,
        "userId":user._id.toString()
    });

});
