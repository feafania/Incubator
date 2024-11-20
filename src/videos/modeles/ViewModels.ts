
import {ResolutionsType} from "../../types";

export type ViewVideoModel = {
    /**
     * id of the video
     */
    id?: number;
    /**
     * title of the video
     */
    title: string;
    /**
     * author of the video
     */
    author: string;
    /**
     * the video is allowed for downloading
     * By default, false
     */
    canBeDownloaded?: boolean;
    /**
     * minimum age restriction for viewing the video
     * Should be between 1 and 18, null - no restriction
     */
    minAgeRestriction?: number | null;
    /**
     * date when the video was created
     * ($date-time)-format
     */
    createdAt?: string;
    /**
     * date when the video was published
     * ($date-time)-format
     * By default - +1 day from CreatedAt
     */
    publicationDate?: string;
    /**
     * resolution of the video
     * At least one resolution should be added
     */
    availableResolutions?: ResolutionsType[] | null;
 }
