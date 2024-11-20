
import {DBType} from '../src/db/db'
import {VideoDBType} from "../src/types";
import {Resolutions} from "../src/utils";

// готовые данные для переиспользования в тестах

export const video1: VideoDBType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now() + Math.random(),
    author: 'a' + Date.now() + Math.random(),
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [Resolutions.P240],
}

export const video2: VideoDBType = {
    id: Date.now() + Math.random(),
    title: 'p' + Date.now() + Math.random(),
    author: 'n' + Date.now() + Math.random(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [Resolutions.P240],
}

export const video3: VideoDBType = {
    id: Date.now() + Math.random(),
    title: 'j' + Date.now() + Math.random(),
    author: 'a' + Date.now() + Math.random(),
    canBeDownloaded: true,
    minAgeRestriction: 15,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [Resolutions.P240,Resolutions.P144],
}

export const video4: VideoDBType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now() + Math.random(),
    author: 'a' + Date.now() + Math.random(),
    canBeDownloaded: false,
    minAgeRestriction: 5,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [Resolutions.P1080,Resolutions.P360, Resolutions.P1440],
}

export const dataset1: DBType = {
    videos: [video1,video2,video3,video4],
}

// ...