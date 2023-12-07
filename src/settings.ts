import express, {Request, Response} from "express";
import {availableParallelism, type} from "os";

export const app = express()

app.use(express.json())

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithBodyAndParams<P,B> = Request<P, {}, B, {}>

type CreateVideoDto = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

type ErrorMessageType = {
    field: string
    message: string
}

const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}

const videos: VideoType[] = [
    {
        id: 1,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-12-06T12:56:57.860Z",
        publicationDate: "2023-12-06T12:56:57.860Z",
        availableResolutions: [
            "P144"
        ]
    }
]
type Params = {
    id: string
}
type UpdateVideoDto = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0;
    res.sendStatus(204)
})
app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})
app.get('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id
    const video = videos.find((v) => v.id === id)

    if (!video) {
        res.sendStatus(404)
        return;
    }

    res.send(video)
})
app.post('/videos', (req: RequestWithBody<CreateVideoDto>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body;

    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
        res.sendStatus(400)
        return;
    }
    if (!author || author.trim().length < 1 || author.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
        res.sendStatus(400)
        return;
    }

    if (Array.isArray(availableResolutions)){
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions',
                field: 'availableResolutions'
            })
        })
    }else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo = {
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
app.put('/videos/:id', (req: RequestWithBodyAndParams<Params, any>, res: Response) => {
    const id = +req.params.id

    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions, canBeDownloaded, publicationDate,minAgeRestriction} = req.body
    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
        res.sendStatus(400)
        return;
    }
    if (!author || author.trim().length < 1 || author.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
        res.sendStatus(400)
        return;
    }

    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions',
                field: 'availableResolutions'
            })
        })
    } else {
        availableResolutions = []
    }
    if (typeof canBeDownloaded === "undefined"){
        canBeDownloaded = false
    }

    if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction === "number"){
        minAgeRestriction < 1 || minAgeRestriction > 18 && errors.errorsMessages.push({
            message: "Invalid minAgeRestriction",
            field: "minAgeRestriction"
        })
    } else {
        minAgeRestriction = null
    }

    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const videoIndex = videos.findIndex(v => v.id === id)
    const video = videos.find(v => v.id === id)

    if (!video) {
        res.sendStatus(404)
        return;
    }

    const updatedItem = {
        ...video,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions,
        publicationDate: publicationDate ? publicationDate : video.publicationDate
    }
    videos.splice(videoIndex, 1, updatedItem)

    res.sendStatus(204)
})
app.delete('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id
    const video = videos.find((v) => v.id === id)

    if (!video) {
        res.sendStatus(404)
    } else {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1)
                res.sendStatus(204)
                return
            }
        }
    }
})