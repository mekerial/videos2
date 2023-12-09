import express, {Request, Response} from "express";
import {availableParallelism, type} from "os";
import {VideosRouter} from "./routes/videos.routes";

export const app = express()

app.use(express.json())

app.use('/testing', VideosRouter)
app.use('/videos', VideosRouter)






