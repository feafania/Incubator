import {body} from 'express-validator'

const blogNameInputValidator = body('name')
    .isString().withMessage('Missing the name')
    .trim().isLength({min:1,max:15}).withMessage('The name should be from 1 to 15 symbols');
const blogDescriptionInputValidator = body('description')
    .isString().withMessage('Missing the description')
    .trim().isLength({min:1,max:50}).withMessage('The description should be from 1 to 50 symbols');

const blogUrlInputValidator = body('websiteUrl')
    .isString().withMessage('Missing the website URL')
    .trim().isLength({min:1,max:100}).withMessage('The website URL should be from 1 to 100 symbols')
    .isURL().withMessage('The website URL is not valid URL')
    .custom(value => {
        const pattern: RegExp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
        if (!pattern.test(value)) {
            throw new Error('The website URL does not match the pattern');
        }
        return true;
    });


export const blogInputValidators = [
    blogNameInputValidator,
    blogDescriptionInputValidator,
    blogUrlInputValidator,
]

