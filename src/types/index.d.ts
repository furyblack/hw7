import {CreateNewUserType, UserAccountDBType} from "./users/inputUsersType";
import {WithId} from "mongodb";
import {UserMongoDbType} from "./users/inputUsersType";
export{}
declare global{
    declare namespace Express{
        export interface Request {
            user: CreateNewUserType | null
            userDto: WithId<UserAccountDBType>
        }
    }
}