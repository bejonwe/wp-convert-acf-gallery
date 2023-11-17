import "reflect-metadata"
import { DataSource } from "typeorm"
import { PostMeta } from "./entity/PostMeta"
import { Post } from "./entity/Post"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "",
    port: 3306,
    username: "",
    password: "",
    database: "",
    synchronize: false,
    logging: false,
    entities: [PostMeta, Post],
    migrations: [],
    subscribers: [],
})
