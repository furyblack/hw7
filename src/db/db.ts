import * as dotenv from "dotenv";
import { BlogMongoDbType} from "../types/blogs/output";


import { PostMongoDbType} from "../types/posts/output";
import {Collection, MongoClient} from "mongodb";
import {UserAccountDBType, UserMongoDbType} from "../types/users/inputUsersType";
import {CommentMongoDbType} from "../types/comment/output-comment-type";

//пытаюсь подключить бд

dotenv.config()
const mongoUri = process.env.MONGO_URL as string || "mongodb://0.0.0.0:27017" // вытащили из енви строку  подключения

export const client = new MongoClient(mongoUri);
const mongoDb = client.db()

export const blogCollection: Collection<BlogMongoDbType> = mongoDb.collection<BlogMongoDbType>('blog')
export const postCollection: Collection<PostMongoDbType> = mongoDb.collection<PostMongoDbType>('post')
export const commentCollection: Collection<CommentMongoDbType> = mongoDb.collection<CommentMongoDbType>('comment')

export const usersCollection: Collection<UserAccountDBType> = mongoDb.collection<UserAccountDBType>("user")


export async  function connectMongo (){
    try{
        await client.connect()
        return true
    }catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}
