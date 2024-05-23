import {Router, Response, Request} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validators";
import {BlogRepository} from "../repositories/blog-repository";
import {RequestWithBody, RequestWithParamsAndBody, RequestWithQuery, RequestWithQueryAndParams} from "../types/common";
import {blogQuerySortData, CreateNewBlogType, UpdateBlogType} from "../types/blogs/input";
import {BlogOutputType, PaginationOutputType} from "../types/blogs/output";
import {ObjectId} from "mongodb";
import {PostOutputType} from "../types/posts/output";
import {BlogsService} from "../domain/blogs-service";
import {QueryBlogRepository} from "../repositories/query-blog-repository";
import {paginator} from "../types/paginator/pagination";
import {postForBlogValidation} from "../validators/post-validators";
import {CreateNewPostForBlogType} from "../types/posts/input";


export const blogRoute = Router({});
//test commit
blogRoute.get('/', async (req: RequestWithQuery<blogQuerySortData>, res: Response<PaginationOutputType<BlogOutputType[]>>) => {
    const paginationData = paginator(req.query)

    const blogsPromise = await QueryBlogRepository.getAll(paginationData)
    res.send(blogsPromise)
})

blogRoute.get('/:id', async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const blog = await QueryBlogRepository.getById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    } else {
        res.sendStatus(404)
    }
})


blogRoute.get('/:blogId/posts', async (req: RequestWithQueryAndParams<{
    blogId: string
}, blogQuerySortData>, res: Response) => {
    const blogId = req.params.blogId; // Используйем req.params.blogId для получения значения blogId
    const paginationData = paginator(req.query)

    if (!ObjectId.isValid(blogId)) {
        res.sendStatus(404);
        return;
    }
    try {
        const posts = await QueryBlogRepository.getAllPostsForBlog(blogId, paginationData);
        if (posts!.items.length > 0) {
            res.status(200).send(posts);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error fetching posts for blog:', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<CreateNewBlogType>, res: Response<BlogOutputType>) => {
    const {name, description, websiteUrl}: CreateNewBlogType = req.body
    const newBlog = await BlogsService.createBlog({name, description, websiteUrl})

    res.status(201).send(newBlog)
})

// Роут для создания нового поста для конкретного блога

blogRoute.post('/:blogId/posts', authMiddleware, postForBlogValidation(), async (req: RequestWithParamsAndBody<{
    blogId: string
}, CreateNewPostForBlogType>, res: Response<PostOutputType>) => {

    // Извлекаем параметры и тело запроса из запроса
    const {blogId} = req.params;
    const {title, shortDescription, content} = req.body;
    const newPost = await BlogsService.createPostToBlog({title, shortDescription, content, blogId})
    // Отправляем успешный ответ с созданным постом
    if (!newPost) return res.sendStatus(404)
    res.status(201).send(newPost);
    return

})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const blogUpdateParams: UpdateBlogType = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    const blogId = req.params.id

    const doesBlogExist = await QueryBlogRepository.getById(blogId);

    if (!doesBlogExist) return res.sendStatus(404);

    const isUpdated = await BlogRepository.updateBlog(blogId, blogUpdateParams)

    if (isUpdated) return res.sendStatus(204)

    return res.sendStatus(404)
})

blogRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const isDeleted = await BlogsService.deleteBlog(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

})



