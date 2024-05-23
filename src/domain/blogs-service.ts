import {PostOutputType} from "../types/posts/output";
import {PostRepository} from "../repositories/post-repository";
import {CreateNewPostType} from "../types/posts/input";
import {BlogRepository} from "../repositories/blog-repository";
import {CreateNewBlogType} from "../types/blogs/input";
import {BlogOutputType} from "../types/blogs/output";

export class BlogsService {

//TODO после создания пост сервиса вернуться сюда
    static async createPostToBlog(data: CreateNewPostType) {
        const {title, shortDescription, content, blogId} = data
        // Создаем новый пост для конкретного блога
        const newPost: PostOutputType | null = await PostRepository.createPost({
            title,
            shortDescription,
            content,
            blogId,
        });
        return newPost
    }

    // переносим часть функционала  с blog route ( создание блога)
    static async createBlog(data: CreateNewBlogType) {
        const {name, description, websiteUrl} = data
        const newBlog: BlogOutputType = await BlogRepository.createBlog({
            name,
            description,
            websiteUrl
        })
        return newBlog
    }


    static async deleteBlog(id: string): Promise<boolean> {
        return await BlogRepository.deleteBlog(id)
    }

}



