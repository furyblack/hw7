import {usersCollection} from "../db/db";
import {UserAccountDBType} from "../types/users/inputUsersType";
import {ObjectId, WithId} from "mongodb";

export class UsersRepository{

    static async createUser(user: UserAccountDBType): Promise<ObjectId> {
        const result = await usersCollection.insertOne(user);
        return result.insertedId;
    }

    static async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserAccountDBType> | null> {
        return usersCollection.findOne({ $or: [{ "accountData.email": loginOrEmail }, { "accountData.userName": loginOrEmail }] });
    }
    static async findUserByConfirmationCode(emailConfirmationCode: string) {
        return usersCollection.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode });
    }

    static async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount === 1;
        } catch (error) {
            console.error("Error deleting user", error);
            return false;
        }
    }

    static async findUserById(id: string): Promise<WithId<UserAccountDBType> | null> {
        try {
            return usersCollection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            console.error("Error deleting user", error);
            return null;
        }
    }

    static async findByEmail(email: string): Promise<WithId<UserAccountDBType> | null> {
        return await usersCollection.findOne({ "accountData.email": email });

    }

    static async updateConfirmation(_id: ObjectId) {
        let result = await usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
        return result.modifiedCount === 1;
    }
    static async updateConfirmationCode(userId: ObjectId, newCode: string, newExpirationDate: Date) {
        await usersCollection.updateOne(
            { _id: userId },
            {
                $set: {
                    'emailConfirmation.confirmationCode': newCode,
                    'emailConfirmation.expirationDate': newExpirationDate
                }
            }
        );
    }
}
