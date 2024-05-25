import {WithId} from "mongodb";

export type CreateNewUserType= {
    "login": string,
    "password": string,
    "email": string
}

export type UserAccountDBType = WithId<{
    accountData: UserAccountType,
    emailConfirmation: EmailConfirmationType
}>
export type UserAccountType= {
    "email": string,
    "userName": string,
    "passwordHash": string,
    "passwordSalt": string,
    "createdAt": Date
}
export type EmailConfirmationType= {
    "isConfirmed": boolean,
    "confirmationCode": string | null,
    "expirationDate": Date | null
}


export type LoginUserType= {
    "loginOrEmail": string,
    "password": string,

}

export type UserMongoDbType =  {
    userName: string,
    email: string,
    passwordHash: string,
    passwordSalt:string,
    createdAt: Date
}

export type userQuerySortData = {
    pageSize?: number,
    pageNumber?: number,
    sortBy?: string,
    sortDirection?: string,
    searchLoginTerm?: string,
    searchEmailTerm?: string,
}