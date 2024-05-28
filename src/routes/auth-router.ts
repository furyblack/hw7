import { Response, Request, Router } from "express";
import { UsersService } from "../domain/users-service";
import { RequestWithBody } from "../types/common";
import {LoginUserType, UserAccountDBType} from "../types/users/inputUsersType";
import { jwtService } from "../application/jwt-service";
import { WithId } from "mongodb";
import { CurrentUserType } from "../types/users/outputUserType";
import {
    authMiddlewareBearer,
    emailResendingValidation,
    registrationValidation,
    uniqEmailValidator
} from "../middlewares/auth/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";




export const authRouter = Router({});

authRouter.post('/login', async (req: RequestWithBody<LoginUserType>, res: Response) =>{
    const user:WithId<UserAccountDBType> | null = await UsersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(!user){
        res.sendStatus(401)
        return
    }
    const token = await jwtService.createJWT(user)
    res.status(200).send({accessToken:token})
})

authRouter.get('/me', authMiddlewareBearer, async (req: Request, res: Response<CurrentUserType>) => {
    const user = req.userDto;
    return res.status(200).json({
        "login": user.accountData.userName,
        "email": user.accountData.email,
        "userId": user._id.toString()
    });
});


authRouter.post('/registration', registrationValidation(),  async (req: Request, res: Response) => {


    const result = await UsersService.createUnconfirmedUser(req.body.login, req.body.email, req.body.password);
    if(!result){
        res.sendStatus(500)
        return
    }
    res.sendStatus(204)
});

authRouter.post('/registration-confirmation',  async (req: Request, res: Response) => {
    const result = await UsersService.confirmEmail(req.body.code);
    if (!result) {
        res.status(400).send({errorsMessages: [{ message: 'пользователь уже подтвержден', field: "code" }]});
        return
    }
    res.sendStatus(204)
    return
});

authRouter.post('/registration-email-resending', emailResendingValidation(),  async (req: Request, res: Response) => {
    const email = req.body.email;
    await UsersService.resendConfirmationEmail(email);
        res.sendStatus(204)
});

