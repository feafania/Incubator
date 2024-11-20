
import {VideoDBType} from "../types";
import {Resolutions} from "../utils";
import {addDays} from "date-fns";

export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    videos: VideoDBType[]
}

export const db: DBType = { // создаём базу данных (пока это просто переменная)
    videos: [
        {
            id: 1,
            title: "Good things",
            author: "Loo Van",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: addDays(new Date(),1).toISOString(),
            availableResolutions: [Resolutions.P240]
        },
        {
            id: 2,
            title: "Good books",
            author: "Koo Han",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: addDays(new Date(),-4).toISOString(),
            publicationDate: addDays(new Date(),-3).toISOString(),
            availableResolutions: [Resolutions.P1080,Resolutions.P480]
        },
        {
            id: 3,
            title: "Adult things",
            author: "Ru Mah",
            canBeDownloaded: false,
            minAgeRestriction: 18,
            createdAt: addDays(new Date(),-15).toISOString(),
            publicationDate: addDays(new Date(),-14).toISOString(),
            availableResolutions: [Resolutions.P240,Resolutions.P2160,Resolutions.P480,Resolutions.P1080,Resolutions.P720],
        },
        {
            id: 4,
            title: "Bad things",
            author: "Loo Van",
            canBeDownloaded: true,
            minAgeRestriction: 9,
            createdAt: addDays(new Date(),4).toISOString(),
            publicationDate: addDays(new Date(),8).toISOString(),
            availableResolutions: [Resolutions.P240,Resolutions.P2160,Resolutions.P480]
        }
        ],
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        db.videos = []
        return
    }

    // если что-то передано - то заменяем старые значения новыми
    db.videos = dataset.videos || db.videos
}