import {CommentMongoDbType, CommentMongoDbTypeWithId, CommentOutputType} from "../types/comment/output-comment-type";
import {CommentRepository} from "../repositories/comment-repository";
import {PostRepository} from "../repositories/post-repository";



export class CommentMapper{
    static toDto(comment:CommentMongoDbTypeWithId):CommentOutputType{
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo:comment.commentatorInfo,
            createdAt: comment.createdAt.toISOString()
        }
    }
}

type CreateCommentServiceType ={
    postId:string,
    content:string,
    userId:string,
    userLogin:string,
}
export class CommentService{
    static async createComment(data: CreateCommentServiceType):Promise<{commentId:string}|null>{
        const {postId,content,userLogin,userId} = data

        const post= await PostRepository.findPostById(postId)
        if(!post) return null


        const newComment:CommentMongoDbType={
            postId:postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin,
            },
            createdAt: new Date()
        }


        return   await CommentRepository.createComment(newComment)

    }


}