import {Router, Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {RequestWithBody, RequestWithQuery} from "../types/common";
import {CreateNewUserType, userQuerySortData} from "../types/users/inputUsersType";
import {UserOutputType} from "../types/users/outputUserType";
import {PaginationOutputType} from "../types/blogs/output";
import {userPaginator} from "../types/paginator/pagination";
import {UserQueryRepository} from "../repositories/query-user-repository";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {userValidation} from "../validators/user-validators";

export const usersRouter = Router({})

usersRouter.get('/',  async (req: RequestWithQuery<userQuerySortData>, res: Response<PaginationOutputType<UserOutputType[]>>) =>{
    const paginationData = userPaginator(req.query)

    const userPromise = await UserQueryRepository.getAll(paginationData)
    res.send(userPromise)
})


usersRouter.post('/', authMiddleware, userValidation(), async (req: RequestWithBody<CreateNewUserType>, res: Response)=> {
    const newCreatedUser: UserOutputType | null = await UsersService.createUser(req.body.login, req.body.email, req.body.password)
    if(!newCreatedUser) return res.sendStatus(600)
    return  res.status(201).send(newCreatedUser)
})

usersRouter.delete('/:id', authMiddleware, async (req: Request, res:Response) =>{
    const isDeleteUser = await UsersService.deleteUser(req.params.id)
    if(isDeleteUser){
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }
})
