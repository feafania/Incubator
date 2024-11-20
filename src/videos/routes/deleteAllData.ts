import {Request,Response} from 'express'
import {setDB} from '../../db/db'
import {HTTP_STATUSES} from "../../utils";

export const deleteAllData = (req: Request, res: Response) => {
    setDB();
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
}
