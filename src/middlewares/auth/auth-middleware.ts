import {NextFunction, Response, Request} from 'express';
import {jwtService} from "../../application/jwt-service";
import {UsersRepository} from "../../repositories/users-repository";
import {usersCollection} from "../../db/db";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../inputValidation/input-validation-middleware";

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

export const uniqEmailValidator = body("email")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Email is not valid')
    .custom(async (email) => {
    const existingUser = await usersCollection.findOne({'accountData.email': email})
    if (existingUser) {
        throw new Error("пользователь с таким email существует");
    }
    return true
});

const passwordValidator = body('password').isString().withMessage('Password must be a string').trim().isLength({
    min: 6,
    max: 20
}).withMessage('Incorrect password')

export const uniqLoginValidator = body("login")
    .isString()
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login is not valid')
    .isLength({
        min: 3,
        max: 10
    })
    .custom(async (login) => {
    const existingUser = await usersCollection.findOne({'accountData.userName': login})
    if (existingUser) {
        throw new Error("пользователь с таким login существует");
    }
    return true
});

export const userConfiemedValidor = body("email")
    .isString()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email is not Valid')
    .custom(async (email) => {
    const user = await usersCollection.findOne({'accountData.email': email})

    if (!user) {
        throw new Error("пользователя нет");
    }
    if(user.emailConfirmation.isConfirmed){
        throw new Error("пользователь уже подтвержден");
    }
    return true
});

export const  registrationValidation = () =>[uniqEmailValidator, passwordValidator, uniqLoginValidator,  inputValidationMiddleware]
export const  emailResendingValidation = () =>[userConfiemedValidor, inputValidationMiddleware]
