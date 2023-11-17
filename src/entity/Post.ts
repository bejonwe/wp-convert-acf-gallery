import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity("P1E51d_posts")
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    ID: number

    @Column()
    post_content: string

    @Column()
    guid: string

    @Column()
    post_type: string
}
