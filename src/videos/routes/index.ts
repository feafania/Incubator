import {Router} from 'express'
import {getVideosController} from './getVideosController'
import {createVideoController} from './createVideoController'
import {VideoDBType} from "../../types";
import {ViewVideoModel} from "../modeles/ViewModels";
import {findVideoController} from "./findVideoController";
import {updateVideoController} from "./updateVideoController";
import {deleteVideoController} from "./deleteVideoController";
import {deleteAllData} from "./deleteAllData";

export const getVideosRouter = () => {
    const router = Router();
    router.get('/', getVideosController);
    router.post('/', createVideoController);
    router.get('/:id', findVideoController);
    router.put('/:id', updateVideoController);
    router.delete('/:id', deleteVideoController);
    router.delete('/', deleteAllData);
    return router;
}

export const mapEntityToViewModel = (model: VideoDBType):ViewVideoModel => {
    return {
        id: model.id ?? 0, // або любыя значэнні па змаўчанні
        title: model.title,
        author: model.author,
        canBeDownloaded: model.canBeDownloaded ?? false,
        minAgeRestriction: model.minAgeRestriction ?? null,
        createdAt: model.createdAt ?? '',
        publicationDate: model.publicationDate ?? '',
        availableResolutions: model.availableResolutions ?? []
    }
}


