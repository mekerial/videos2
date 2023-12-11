import {Request, Response, Router} from "express";

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithBodyAndParams<P,B> = Request<P, {}, B, {}>
type CreateVideo = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}
type Params = {
    id: string
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

export const videos: VideoType[] = [
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

export const VideosRouter = Router({})

VideosRouter.delete('/all-data', (req: Request, res: Response) => {
    videos.length = 0;
    res.sendStatus(204)
})
VideosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos)
})
VideosRouter.get('/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id
    const video = videos.find((v) => v.id === id)

    if (!video) {
        res.sendStatus(404)
        return;
    }

    res.send(video)
})
VideosRouter.post('/', (req: RequestWithBody<CreateVideo>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body;

    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
    }

    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
    }

    if (Array.isArray(availableResolutions)){
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions',
                field: 'availableResolutions'
            })
        })
    } else {
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
VideosRouter.put('/:id', (req: RequestWithBodyAndParams<Params, any>, res: Response) => {
    const id = +req.params.id
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions, canBeDownloaded, publicationDate,minAgeRestriction} = req.body
    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
    }
    if (!author || author.trim().length < 1 || author.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"})
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
    } else {
        //
    }
    // publication date

    if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction === "number") {
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

    const updatedEntity = {
        ...video,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions,
        publicationDate: publicationDate ? publicationDate : video.publicationDate
    }
    videos.splice(videoIndex, 1, updatedEntity)

    res.sendStatus(204)
})
VideosRouter.delete('/:id', (req: RequestWithParams<Params>, res: Response) => {
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