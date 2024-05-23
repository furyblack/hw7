import express, {Request, Response} from "express";
import {blogCollection, postCollection, usersCollection} from "./db/db";
import {postRoute} from "./routes/post-route";
import {blogRoute} from "./routes/blog-route";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentRouter} from "./routes/comment-router";

export const app = express();

// подключение роутеров
app.use(express.json())
app.use('/posts', postRoute)
app.use('/blogs', blogRoute)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentRouter)

app.delete('/testing/all-data', async (req:Request, res: Response)=>{
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await usersCollection.deleteMany({})
    res.sendStatus(204)
})





/*
import express, {Request, Response} from 'express';
import {blogRoute} from "./routes/blog-route";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "./types/common";

// import {VideoUpdateModelBody, VideoUpdateModelParams} from "../models/videoUpdateModel";
//

//once upon a tine
 app.use(express.json());
 app.use('/blogs', blogRoute)

export const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

export type VideoDbType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: typeof AvailableResolutions;
}

export let videos: VideoDbType[] = [
    {
        id: 0,
        title: 'string',
        author: 'string',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2024-01-07T08:53:23.637Z",
        publicationDate: "2024-01-07T08:53:23.637Z",
        availableResolutions: [
            "P144"
        ]
    }

];

type CreateVideoType = {
    title: string;
    author: string;
    availableResolutions: typeof AvailableResolutions;

};
type errorsMessages = {
    message: string;
    field: string;
};
type ErrorType = {
    errorsMessages: errorsMessages[];
};

app.get('/videos', (_req: Request<{}, {}, CreateVideoType>, res: Response) => {
    _req.body.author
    res.send(videos);
});

app.delete('/testing/all-data', (_req: Request, res: Response) => {
    videos.length = 0;
    res.sendStatus(204);
});

app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId
    const newVideos=videos.filter(v=>v.id !==id)
    if (newVideos.length < videos.length){
        videos = newVideos
        res.send(204)
    }else{
        res.send(404)
    }
})



app.get('/videos/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    console.log('get started')
    const id = +req.params.id
    const video = videos.find((v) => v.id === id)

    if (!video) {
        res.sendStatus(404)
        return
    }
    res.send(video)
})






app.post('/videos', (req: RequestWithBody<CreateVideoType>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []

    }
    let {title, author, availableResolutions}:CreateVideoType = req.body

if (!title || typeof title !=='string' || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid title!', field: 'title'})
    }

    if (!author || typeof author !=='string' || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid author!', field: 'author'})
    }

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions!',
                field: 'availableResolutions'
            })
        })
    } else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const  createdAt=new Date()
    const publicationDate=new Date()

    publicationDate.setDate(createdAt.getDate()+1)

    const newVideo: VideoDbType = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)

})



app.put('/videos/:id', (req:RequestWithParamsAndBody<VideoUpdateModelParams, VideoUpdateModelBody>, res:Response)=>{
    console.log('srabot')
    let  {title, author, availableResolutions, canBeDownloaded, publicationDate, minAgeRestriction}:VideoUpdateModelBody = req.body
    const id = +req.params.id

    const errors: ErrorType = {
        errorsMessages: []

    }

    if (!title || typeof title !== 'string' || !title.trim() || title.length>40){
       errors.errorsMessages.push({
                message:'Incorrect title',
                field: 'title'
            })
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.length>20){
        errors.errorsMessages.push({
            message:'Incorrect author',
            field: 'author'
        })
    }

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions!',
                field: 'availableResolutions'
            })
        })
    }

    if (canBeDownloaded && typeof canBeDownloaded !== "boolean"){
        errors.errorsMessages.push({
            message: 'Invalid canBeDownloaded',
            field: 'canBeDownloaded'
        })

    }
    const dataInspection = (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/gi).test(publicationDate);
    if(publicationDate && !dataInspection ){
        errors.errorsMessages.push({
            message: 'Invalid data',
            field: 'publicationDate'
        })
    }

    if (minAgeRestriction && typeof minAgeRestriction === "number"){
        if(minAgeRestriction<1 || minAgeRestriction>18){
            errors.errorsMessages.push({
                message: 'Invalid minAgeRestriction',
                field: 'minAgeRestriction'
            })
        }
    }

    if(errors.errorsMessages.length){
      return res.status(400).send(errors)
    }


    const video = videos.find(v=> { return v.id === id})
    console.log('video>>', video)
    if (!video){
        res.sendStatus(404)
        return;
    }

    video.author = author;
    video.title = title;
    video.canBeDownloaded = canBeDownloaded ?? false;
    video.availableResolutions = availableResolutions ?? ['P144'];
    video.minAgeRestriction = minAgeRestriction;
    video.publicationDate = publicationDate ? publicationDate : video.publicationDate

    // const videoIndex = videos.findIndex(v => {return v.id === id})
    //
    //     const  videoUpdated = {
    //         ...video,
    //         canBeDownloaded: canBeDownloaded ?? false,
    //         minAgeRestriction,
    //         title,
    //         author,
    //         publicationDate:publicationDate ? publicationDate : video.publicationDate,
    //         availableResolutions: availableResolutions ?? ['P144']
    //
    //     }
    //     console.log('video test', videoUpdated)
    //     videos.splice(videoIndex, 1, videoUpdated)
     return  res.sendStatus(204)



})

 */