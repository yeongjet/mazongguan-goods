import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('mzg_goods')
export class GoodsModel {
    @PrimaryGeneratedColumn({ comment: '商品id' })
    goods_id: number

    @Column('int4', { nullable: false, comment: '企业id' })
    enterprise_id: number

    @Column('string', { nullable: false, comment: '商品名称' })
    goods_name: string

    @Column('string', { nullable: false, comment: '商品简介' })
    intro: string

    @Column('string', { nullable: false, comment: '商品属性' })
    attribute: string

    @Column('simple-array', { nullable: false, comment: '商品主图' })
    picture: string[]

    @Column('simple-array', { nullable: false, comment: '商品详情图' })
    detail_picture: string[]

    @Column('int8', { nullable: false, comment: '库存' })
    stock: number

    @Column('int8', { nullable: false, comment: '已售' })
    sale: number

    @Column('int8', { nullable: false, comment: '现价' })
    price: number

    @Column('int8', { nullable: false, comment: '原价/划线价' })
    origin_price: number
}
