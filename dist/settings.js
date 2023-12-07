"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
const videos = [
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
];
exports.app.get('/videos', (req, res) => {
    res.send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find((v) => v.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.app.post('/videos', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({ message: "Invalid title", field: "title" });
    }
    if (!author || author.trim().length < 1 || author.trim().length > 40) {
        errors.errorsMessages.push({ message: "Invalid title", field: "title" });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions',
                field: 'availableResolutions'
            });
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions, canBeDownloaded, publicationDate, minAgeRestriction } = req.body;
    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({ message: "Invalid title", field: "title" });
    }
    if (!author || author.trim().length < 1 || author.trim().length > 40) {
        errors.errorsMessages.push({ message: "Invalid title", field: "title" });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions',
                field: 'availableResolutions'
            });
        });
    }
    else {
        availableResolutions = [];
    }
    if (typeof canBeDownloaded === "undefined") {
        canBeDownloaded = false;
    }
    if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction === "number") {
        minAgeRestriction < 1 || minAgeRestriction > 18 && errors.errorsMessages.push({
            message: "Invalid minAgeRestriction",
            field: "minAgeRestriction"
        });
    }
    else {
        minAgeRestriction = null;
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const videoIndex = videos.findIndex(v => v.id === id);
    const video = videos.find(v => v.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    const updatedItem = Object.assign(Object.assign({}, video), { canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions, publicationDate: publicationDate ? publicationDate : video.publicationDate });
    videos.splice(videoIndex, 1, updatedItem);
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find((v) => v.id === id);
    if (!video) {
        res.sendStatus(404);
    }
    else {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1);
                res.sendStatus(204);
                return;
            }
        }
    }
});
