import {usersCollection} from "../db/db";
import {UserMongoDbType} from "../types/users/inputUsersType";
import {ObjectId, WithId} from "mongodb";

export class UsersRepository{

    static async createUser(user: UserMongoDbType): Promise<ObjectId>{

        const result  = await usersCollection.insertOne(user)
        return result.insertedId
    }

    static  async findByLoginOrEmail(loginOrEmail: string):Promise<WithId<UserMongoDbType> |null>{
        const user:WithId<UserMongoDbType>|null = await usersCollection.findOne({$or: [{email: loginOrEmail}, {userName:loginOrEmail}]})
        return user
    }

    static async deleteUser(id:string): Promise<boolean>{
        try{
            const result = await usersCollection.deleteOne({_id:new ObjectId(id)})
            return result.deletedCount ===1;
        }catch (error){
            console.error("Error deleting user", error)
            return false
        }
    }
    static async findUserById(id:string): Promise<WithId<UserMongoDbType> |null>{
        try{
            const result = await usersCollection.findOne({_id:new ObjectId(id)})
            return result
        }catch (error){
            console.error("Error deleting user", error)
            return null
        }
    }
}
