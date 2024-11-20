import {Response} from 'express'
import {OutputErrorsType, RequestWithBody, ResolutionsType, VideoDBType} from '../../types'
import {db} from '../../db/db'
import {CreateVideoInputModel} from '../modeles/CreateModels'
import {ViewVideoModel} from "../modeles/ViewModels";
import {HTTP_STATUSES, pushError, Resolutions} from "../../utils";
import {addDays} from "date-fns";


const inputValidation = (video: CreateVideoInputModel) => {
    const errors: OutputErrorsType = { // объект для сбора ошибок
        errorsMessages: []
    }

    const videoTitle: string = video.title ? video.title.trim() : '';
    if (!videoTitle) {
        pushError(errors,'Missing the title','title')
    }
    if (videoTitle.length > 40 ) {
        pushError(errors,'The title is too long (maximum 40)','title')
    }
    const videoAuthor:string = video.author ? video.author.trim() : '';
    if (!videoAuthor) {
        pushError(errors,'Missing the name of the author','author')
    }
    if (videoAuthor.length > 20 ) {
        pushError(errors,'The name of the author is too long (maximum 20)','author')
    }

    if (video.availableResolutions && Array.isArray(video.availableResolutions)) {
        const resolutionNotSupported = video.availableResolutions.find(
            (resolution: ResolutionsType) => !Object.values(Resolutions).includes(resolution)
        );

        if (resolutionNotSupported) {
            pushError(errors,`Resolution ${resolutionNotSupported} is not supported`,'availableResolutions')
        }
    } else {
        // Обработка случая, если availableResolutions не является массивом или равно null
        pushError(errors,'Available resolutions are not defined','availableResolutions')
    }
    return errors
}

export const createVideoController = (req: RequestWithBody<CreateVideoInputModel>, res: Response<ViewVideoModel| OutputErrorsType>) => {
    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errors)
        return
    }

    // если всё ок - добавляем видео
    const createdAtDate:Date = new Date();
    const newVideo: VideoDBType = {
        ...req.body,
        id: Date.now() + Math.random(),
        title: req.body.title ? req.body.title.trim() : '',
        author: req.body.author ? req.body.author.trim() : '',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAtDate.toISOString(),
        publicationDate: addDays(createdAtDate, 1).toISOString(),
    }
    db.videos = [...db.videos, newVideo]

    res
        .status(HTTP_STATUSES.CREATE_201)
        .json(newVideo)
}