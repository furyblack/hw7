import {CreateNewPostType, UpdatePostType} from "../types/posts/input";
import {PostMongoDbType, PostOutputType} from "../types/posts/output";
import {PostRepository} from "../repositories/post-repository";


export class PostMapper{
    static toDto(post:PostMongoDbType):PostOutputType{
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt.toISOString()
        }
    }
}

export class PostService{
    //TODO вынести мапинг в квери репу
    static async createPost(postParams: CreateNewPostType): Promise<PostOutputType | null>{
     return await PostRepository.createPost(postParams)
    }


    static async  updatePost(postId: string,  updateData:UpdatePostType): Promise<boolean | null>{
       return  await PostRepository.updatePost(postId, updateData)
    }

    static async deletePost(id: string): Promise<boolean>{
       return await PostRepository.deletePost(id)

    }


}
