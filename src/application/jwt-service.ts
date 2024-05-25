import { WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {UserAccountDBType, UserMongoDbType} from "../types/users/inputUsersType";


export const jwtService={
    async  createJWT(user:WithId<UserAccountDBType>){
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET as string, {expiresIn: '1h'})
        return token

    },
    async getUserIdByToken(token:string){
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET as string)
            return  result.userId
        }catch (error){
            return null
        }
    }
}