import bcrypt from 'bcrypt';
import {CurrentUserType, UserOutputType} from "../types/users/outputUserType";
import {UsersRepository} from "../repositories/users-repository";
import { UserMongoDbType} from "../types/users/inputUsersType";
import {WithId} from "mongodb";


export const UsersService = {
    async createUser(login: string, email:string, password:string): Promise<UserOutputType>{
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserMongoDbType = {

            userName: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }
       const userId = await UsersRepository.createUser(newUser)
        return {
            login: newUser.userName,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString(),
            id: userId.toString()

        }
    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async checkCredentials(loginOrEmail: string, password: string){
        const user:WithId<UserMongoDbType> | null = await UsersRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if(user.passwordHash !== passwordHash){
           return  null
        }
        return user
    },

    async deleteUser(id: string):Promise<boolean>{
        return await UsersRepository.deleteUser(id)
    },
    //  async getCurrentUser(userId: string): Promise<CurrentUserType | null> {
    //     return await UsersRepository.findUserById(userId);
    // }


}