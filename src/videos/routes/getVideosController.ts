
import {db} from '../../db/db'
import {ViewVideoModel} from "../modeles/ViewModels";
import {mapEntityToViewModel} from "./index";
import {HTTP_STATUSES} from "../../utils";
import {VideoDBType} from "../../types";
import {Response, Request} from 'express'


export const getVideosController = (req:Request,res:Response<ViewVideoModel[]>) => {
    const videos:VideoDBType[] = db.videos // получаем видео из базы данных

    res
        .status(HTTP_STATUSES.OK_200)
        .json(videos.map(mapEntityToViewModel)) // отдаём видео в качестве ответа
}
