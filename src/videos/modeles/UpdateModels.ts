import {ResolutionsType} from "../../types";

export type UpdateVideoInputModel = {
    /**
     * id of the updating video
     */
    id?:number
    /**
     * title of the updating video input
     * maxLength: 40
     */
    title: string | null;
    /**
     * author of the updating video input
     * maxLength: 20
     */
    author: string | null;
    /**
     * resolution of the updating video input
     * At least one resolution should be added
     */
    availableResolutions?: ResolutionsType[] | null;
    /**
     * the updating video is allowed for downloading
     * By default, false
     */
    canBeDownloaded?: boolean;
    /**
     * minimum age restriction for viewing the video
     * Should be between 1 and 18, null - no restriction
     */
    minAgeRestriction?: number | null;
    /**
     * date when the video was published
     * ($date-time)-format
     */
    publicationDate?: string;
}

export type UpdateVideoInputModelByID = {
    /**
     * id of the updating video
     */
    id:string
}
