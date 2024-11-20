import {ResolutionsType} from "../../types";

export type CreateVideoInputModel = {
    /**
     * title of the creating video input
     * maxLength: 40
     */
    title:string | null;
    /**
     * author of the creating video input
     * maxLength: 20
     */
    author:string | null;
    /**
     * resolution of the creating video input
     * At least one resolution should be added
     */
    availableResolutions: ResolutionsType[] | null;
}


