import {Response} from 'express'
import {OutputErrorsType, RequestWithParamsAndBody, ResolutionsType, VideoDBType} from '../../types'
import {db} from '../../db/db'
import {ViewVideoModel} from "../modeles/ViewModels";
import {HTTP_STATUSES, pushError, Resolutions} from "../../utils";
import {UpdateVideoInputModel, UpdateVideoInputModelByID} from "../modeles/UpdateModels";

const inputValidation = (video: UpdateVideoInputModel) => {
    const errors: OutputErrorsType = { // объект для сбора ошибок
        errorsMessages: []
    }

    const videoTitle: string = video.title ? video.title.trim() : '';
    if (!videoTitle) {
        pushError(errors,'Missing the title','title')
    }
    if (videoTitle) {
        if (videoTitle.length > 40 ) {
            pushError(errors,'The title is too long (maximum 40)','title')
        }
    }

    const videoAuthor:string = video.author ? video.author.trim() : '';
    if (!videoAuthor) {
        pushError(errors,'Missing the name of the author','author')
    }
    if (videoAuthor) {
        if (videoAuthor.length > 20 ) {
            pushError(errors,'The name of the author is too long (maximum 20)','author')
        }
    }

    if (video.availableResolutions && Array.isArray(video.availableResolutions)) {
        const resolutionNotSupported = video.availableResolutions.find(
            (resolution: ResolutionsType) => !Object.values(Resolutions).includes(resolution)
        );

        if (resolutionNotSupported) {
            pushError(errors,`Resolution ${resolutionNotSupported} is not supported`,'availableResolutions')
        }
    }
    const videoMinAgeRestriction = video.minAgeRestriction;
    if (videoMinAgeRestriction !== null && videoMinAgeRestriction !== undefined) {
        if (typeof videoMinAgeRestriction !== 'number') {
            pushError(errors, 'Minimum age restriction should be a number', 'minAgeRestriction')
        }
        else {
            if ((videoMinAgeRestriction === 0)||(videoMinAgeRestriction > 18)) {
                pushError(errors, 'Minimum age restriction should be in the range 1..18', 'minAgeRestriction')
            }
        }
    }
    const videoPublicationDate = video.publicationDate;

    if (videoPublicationDate !== null && videoPublicationDate !== undefined) {
        // Правяраем, ці з'яўляецца videoPublicationDate сапраўдным ISO днём
        const parsedDate = Date.parse(videoPublicationDate);
        const isValidISODate = !isNaN(parsedDate) && new Date(parsedDate).toISOString() === videoPublicationDate;

        if (!isValidISODate) {
            pushError(errors, 'Publication date is not a valid ISO date', 'publicationDate');
        }
    }

    const canBeDownloaded = video.canBeDownloaded;

    if (canBeDownloaded !== undefined && canBeDownloaded !== null) {
        if (typeof canBeDownloaded !== 'boolean') {
            pushError(errors, 'Parameter "Can be downloaded" should be boolean', 'canBeDownloaded');
        }
    }
    return errors
}

export const updateVideoController = (req: RequestWithParamsAndBody<UpdateVideoInputModelByID,UpdateVideoInputModel>, res: Response<ViewVideoModel| OutputErrorsType>) => {
    // Знайсці індэкс элемента ў масіве
    const id:number = +(req.params.id);
    const videoIndex = db.videos.findIndex((video: VideoDBType) => video.id === id);
    if (videoIndex === -1) {
        res
            .sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
    }

    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errors)
        return
    }

    // если всё ок - изменяем видео
    const foundVideo:VideoDBType = db.videos[videoIndex];

    db.videos[videoIndex] = {
        ...foundVideo, // Першапачатковыя значэнні
        author: (req.body.author ? req.body.author.trim() : '') ?? foundVideo.author,
        availableResolutions: req.body.availableResolutions ?? foundVideo.availableResolutions,
        canBeDownloaded: req.body.canBeDownloaded ?? foundVideo.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction ?? foundVideo.minAgeRestriction, // Устаноўка новага значэння або пакінуць стары
        publicationDate: req.body.publicationDate ?? foundVideo.publicationDate, // Устаноўка новага значэння або пакінуць стары
        title: (req.body.title ? req.body.title.trim() : '') ?? foundVideo.title, // Устаноўка новага значэння або пакінуць стары
    };

    res
        .status(HTTP_STATUSES.NO_CONTENT_204)
        .json(db.videos[videoIndex])
}