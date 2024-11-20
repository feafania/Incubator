
// готовые данные для переиспользования в тестах

import {BlogDBType, PostDBType} from "../../src/db/types";

export const blog1: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 't' + Date.now() + Math.random(),
    description: 'a' + Date.now() + Math.random(),
    websiteUrl:	'https://t' + Date.now() + Math.random(),

}

export const blog2: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 'p' + Date.now() + Math.random(),
    description: 'n' + Date.now() + Math.random(),
    websiteUrl:	'https://t' + Date.now() + Math.random(),

}

export const blog3: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 'j' + Date.now() + Math.random(),
    description: 'a' + Date.now() + Math.random(),
    websiteUrl:	'https://t' + Date.now() + Math.random(),

}

export const blog4: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 't' + Date.now() + Math.random(),
    description: 'a' + Date.now() + Math.random(),
    websiteUrl:	'https://t' + Date.now() + Math.random(),
}

export const blog5: BlogDBType = {
    id: Date.now() + Math.random(),
    name: '',
    description: 'a' + Date.now() + Math.random(),
    websiteUrl:	'https://t' + Date.now() + Math.random(),
}

export const blog6: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 'thjhhhhhhhgff ffghhg ghf',
    description: 'a' + Date.now() + Math.random(),
    websiteUrl:	'https://t' + Date.now() + Math.random(),
}

export const blog7: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 't' + Date.now() + Math.random(),
    description: '',
    websiteUrl:	'https://t' + Date.now() + Math.random(),
}

export const blog8: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 't' + Date.now() + Math.random(),
    description: 'a' + Date.now() + Math.random(),
    websiteUrl:	'',
}

export const blog9: BlogDBType = {
    id: Date.now() + Math.random(),
    name: 't' + Date.now() + Math.random(),
    description: 'a' + Date.now() + Math.random(),
    websiteUrl:	'fgdggdf' + Date.now() + Math.random(),
}

export const datasetBlogValid: BlogDBType[] = [blog1,blog2,blog3,blog4]
export const datasetBlogNotValid1: BlogDBType[] = [blog5,blog6,blog7,blog8]
export const datasetBlogNotValid2: BlogDBType[] = [blog1,blog2,blog6,blog9]

export const post1: PostDBType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now(),
    shortDescription: 'a' + Date.now() + Math.random(),
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post2: PostDBType = {
    id: Date.now() + Math.random(),
    title: 'b' + Date.now(),
    shortDescription: 'a' + Date.now() + Math.random(),
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post3: PostDBType = {
    id: Date.now() + Math.random(),
    title: 'c' + Date.now(),
    shortDescription: 'a' + Date.now() + Math.random(),
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post4: PostDBType = {
    id: Date.now() + Math.random(),
    title: 'f' + Date.now(),
    shortDescription: 'a' + Date.now() + Math.random(),
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post5: PostDBType = {
    id: Date.now() + Math.random(),
    title: '',
    shortDescription: 'a' + Date.now() + Math.random(),
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post6: PostDBType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now(),
    shortDescription: '',
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post7: PostDBType = {
    id: Date.now() + Math.random(),
    title: 'a'.repeat(40),
    shortDescription: 'a'.repeat(40),
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post8: PostDBType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now(),
    shortDescription: 'a'.repeat(150),
    content:	'about ' + Date.now() + Math.random(),
    blogId: blog1.id,
}

export const post9: PostDBType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now(),
    shortDescription: 'a' + Date.now() + Math.random(),
    content:	'a'.repeat(1150),
    blogId: blog1.id,
}

export const datasetPostValid: PostDBType[] = [post1,post2,post3,post4]
export const datasetPostNotValid1: PostDBType[] = [post5,post6,post7,post8]
export const datasetPostNotValid2: PostDBType[] = [post1,post2,post6,post9]
