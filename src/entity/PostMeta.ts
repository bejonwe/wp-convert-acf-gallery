import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity("P1E51d_postmeta")
export class PostMeta extends BaseEntity {

    @PrimaryGeneratedColumn()
    meta_id: number

    @Column()
    post_id: number

    @Column()
    meta_key: string

    @Column()
    meta_value: string

}
