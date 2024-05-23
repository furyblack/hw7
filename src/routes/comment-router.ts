import {Request, Response, Router} from "express";
import {QueryCommentRepository} from "../repositories/query-comment-repository";
import {authMiddlewareBearer} from "../middlewares/auth/auth-middleware";
import {commentForPostValidation} from "../validators/post-validators";
import {UpdateCommentType} from "../types/comment/input-comment-type";
import {CommentRepository} from "../repositories/comment-repository";




export const commentRouter= Router({})


commentRouter.get('/:id', async (req: Request, res: Response)=>{
const commentId = await QueryCommentRepository.getById(req.params.id)
    if(commentId){
        res.status(200).send(commentId)
    }else{
        res.sendStatus(404)
    }
})

commentRouter.put('/:id', authMiddlewareBearer, commentForPostValidation(), async (req: Request, res: Response) =>{
    const commentUpdateParams: UpdateCommentType={
        content: req.body.content
    }
    const commentId = req.params.id

    const userId = req.userDto._id

    const foundComment = await CommentRepository.findById(commentId)
    if( foundComment && foundComment?.commentatorInfo.userId.toString() !== userId.toString()){
        return res.sendStatus(403)
    }
    await CommentRepository.updateComment(commentId, commentUpdateParams)
    //if(isUpdated){
    if(!foundComment) return res.sendStatus(404)
        return res.sendStatus(204)
    // }else{
    //     return  res.sendStatus(404)
    // }
})

commentRouter.delete('/:id',authMiddlewareBearer, async (req:Request,res:Response) =>{

    const commentId = req.params.id

    const userId = req.userDto._id

    const foundComment = await CommentRepository.findById(commentId)
    if(foundComment && foundComment?.commentatorInfo.userId.toString() !== userId.toString()){
        return res.sendStatus(403)
    }

    await CommentRepository.deleteComment(commentId)
    if(!foundComment) return res.sendStatus(404)
     return res.sendStatus(204)



    // const isDeleted = await CommentRepository.deleteComment(req.params.id)
    // if(!isDeleted){
    //     res.sendStatus(404)
    // }else {
    //     res.sendStatus(204)
    // }
})

