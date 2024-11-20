import {config} from "dotenv";

config() // добавление переменных из файла .env в process.env

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: port,
    PATH: {
        POSTS: '/posts',
        BLOGS: '/blogs',
    },
    ADMIN_AUTH: 'admin:qwerty', //YWRtaW46cXdlcnR5

}