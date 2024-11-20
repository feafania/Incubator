import {Request,Response} from 'express'
import {db} from '../../db/db'
import {HTTP_STATUSES} from "../../utils";
import {VideoDBType} from "../../types";

interface Params {
    id: string; // Параметры звычайна маюць тып `string`, бо яны паступаюць з URL
}

export const deleteVideoController = (req: Request<Params>, res: Response) => {
    const id:number = +(req.params.id);
    const videoIndex = db.videos.findIndex((video:VideoDBType) => video.id === id);
    if (videoIndex === -1) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    db.videos.splice(videoIndex, 1);
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
}
