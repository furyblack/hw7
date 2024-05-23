import {BlogMongoDbType, BlogOutputType, blogSortData, PaginationOutputType} from "../types/blogs/output";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {blogCollection, postCollection} from "../db/db";
import {BlogMapper} from "./blog-repository";
import {PostOutputType} from "../types/posts/output";
import {PostMapper} from "./post-repository";


export class QueryBlogRepository {

    static async getById(id: string): Promise<BlogOutputType | null> {
        const blog: WithId<BlogMongoDbType> | null = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return BlogMapper.toDto(blog)
    }

// get by ID для конкретного поста

    static async getAllPostsForBlog(blogId: string,sortData: blogSortData): Promise<PaginationOutputType<PostOutputType[]>> {
        const {pageSize, pageNumber, sortBy, sortDirection, searchNameTerm} = sortData
        const search = {blogId: blogId}
        const blog = await postCollection
            .find(search)
            .sort(sortBy, sortDirection as SortDirection) //был вариант(sortBy as keyof BlogOutputType, sortDirection as SortDirection))
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .toArray()


        // подсчёт элементов (может быть вынесено во вспомогательный метод)
        const totalCount = await postCollection.countDocuments(search)

        return {

            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: blog.map(b => PostMapper.toDto(b))
        }

    }


    static async getAll(sortData: blogSortData): Promise<PaginationOutputType<BlogOutputType[]>> {
        const {pageSize, pageNumber, sortBy, sortDirection, searchNameTerm} = sortData
        const search = searchNameTerm
            ? {name: {$regex: searchNameTerm, $options: 'i'}}
            : {}
        const blog = await blogCollection
            .find(search)
            .sort(sortBy, sortDirection as SortDirection) //был вариант(sortBy as keyof BlogOutputType, sortDirection as SortDirection))
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .toArray()


        const totalCount = await blogCollection.countDocuments(search)

        return {

            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: blog.map(b => BlogMapper.toDto(b))
        }

    }
}


