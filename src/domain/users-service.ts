import bcrypt from 'bcrypt';
import {UserOutputType} from "../types/users/outputUserType";
import {UsersRepository} from "../repositories/users-repository";
import {WithId} from "mongodb";
import {UserFactory} from "../types/users/User";
import {UserAccountDBType} from "../types/users/inputUsersType";
import {nodemailerService} from "./nodemailer-service";


export const UsersService = {
    async createUser(login: string, email:string, password:string): Promise<UserOutputType | null>{

        const newUser = await UserFactory
            .createConfirmedUser({login, password, email})

        await UsersRepository.createUser(newUser)
        return UserFactory.getViewModel(newUser)

    },
    async createUnconfirmedUser(login: string, email: string, password: string): Promise<boolean | null> {
        const newUser = await UserFactory.createUnonfirmedUser({ login, password, email });
        try {
            await nodemailerService.sendEmail(
                newUser.accountData.email,
                "Registration confirmation",
                `To finish registration please follow the link below:\nhttps://some-front.com/confirm-registration?code=${newUser.emailConfirmation.confirmationCode}`)
        } catch (e) {
            console.log(e)
            return null
        }
        await UsersRepository.createUser(newUser);
        return true
    },
    async confirmEmail(code: string): Promise<boolean> {
        let user = await UsersRepository.findUserByConfirmationCode(code);
        if (!user || !user.emailConfirmation.expirationDate) return false

        if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
            let result = await UsersRepository.updateConfirmation(user._id);
            return result;
        }
        return false;
    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async checkCredentials(loginOrEmail: string, password: string){
        const user:WithId<UserAccountDBType> | null = await UsersRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return null
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if(user.accountData.passwordHash !== passwordHash){
           return  null
        }
        return user
    },

    async deleteUser(id: string):Promise<boolean>{
        return await UsersRepository.deleteUser(id)
    },
    async findUserByEmail(email: string) {
        return await UsersRepository.findByEmail(email);
    },

}