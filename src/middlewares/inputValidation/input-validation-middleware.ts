import {ValidationError, validationResult} from "express-validator";
import {NextFunction, Response, Request} from "express";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const formattedError = validationResult(req).formatWith((error: ValidationError) =>({
        message: error.msg,
        field: error.type == 'field' ? error.path: 'unknown'
    }))
    if(!formattedError.isEmpty()){
        const errorMessages = formattedError.array({onlyFirstError: true})

        res.status(400).send({errorsMessages: errorMessages})

        return

    }
    return next()
}