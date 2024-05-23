import {PostMongoDbType, PostOutputType, postSortData} from "../types/posts/output";
import {commentCollection, postCollection} from "../db/db";
import {PostMapper} from "../domain/posts-service";
import {PaginationOutputType} from "../types/blogs/output";
import {ObjectId, SortDirection} from "mongodb";
import {CommentMapper} from "../domain/comment-service";
import {CommentOutputType} from "../types/comment/output-comment-type";



export class QueryPostRepository {

    static async getAll(sortData: postSortData):Promise<PaginationOutputType<PostOutputType[]>> {
        const {pageSize, pageNumber, sortBy, sortDirection, searchNameTerm} = sortData
        const search = searchNameTerm
            ? {title: {$regex: searchNameTerm, $options: 'i'}}
            : {}
        const  post = await postCollection
            .find(search)
            .sort(sortBy, sortDirection as SortDirection)
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments(search)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: post.map(p =>PostMapper.toDto(p))
        }

    }
    static async getAllCommentsForPost(postId:string, sortData:postSortData):Promise<PaginationOutputType<CommentOutputType[]>>{
        const {pageSize, pageNumber, sortBy, sortDirection} = sortData
        const search = {postId: postId}
        const post = await commentCollection
            .find(search)
            .sort(sortBy, sortDirection as SortDirection) //был вариант(sortBy as keyof BlogOutputType, sortDirection as SortDirection))
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .toArray()
        // подсчёт элементов (может быть вынесено во вспомогательный метод)
        const totalCount = await commentCollection.countDocuments(search)

        return {

            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: post.map(c => CommentMapper.toDto(c))
        }

    }


    static async getById(id: string): Promise<PostOutputType | null> {
        const post: PostMongoDbType | null = await postCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return PostMapper.toDto(post)
    }
}