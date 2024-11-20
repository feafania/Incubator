import {Response} from 'express'
import {db} from '../../db/db'
import {ViewVideoModel} from "../modeles/ViewModels";
import {mapEntityToViewModel} from "./index";
import {HTTP_STATUSES} from "../../utils";
import {RequestWithParams, VideoDBType} from "../../types";
import {GetVideoModelById} from "../modeles/ReadModels";


export const findVideoController = (req: RequestWithParams<GetVideoModelById>, res: Response<ViewVideoModel>) => {
    const id:number = +(req.params.id);
    const foundVideo = db.videos.find((video:VideoDBType) => video.id === id);
    if (!foundVideo) {
        res
            .sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
    }
    res
        .status(HTTP_STATUSES.OK_200)
        .json(mapEntityToViewModel(foundVideo))
}
