import { HttpError, HttpStatus, EffectFactory, use } from '@marblejs/core'
import { requestValidator$, t } from '@marblejs/middleware-io'
import { throwError, of, from } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import { getRepository } from 'typeorm'
import { neverNullable } from '@mazongguan-common/filter'
import { GoodsModel } from '../../model'

const validator$ = requestValidator$({
    body: t.type({
        enterprise_id: t.number,
        goods_name: t.string,
        intro: t.string,
        attribute: t.array(
            t.type({
                key: t.string,
                value: t.string
            })
        ),
        picture: t.array(t.string),
        detail_picture: t.array(t.string),
        stock: t.number,
        price: t.number,
        origin_price: t.number
    })
})

export const createGoods$ = EffectFactory.matchPath('/goods')
    .matchType('POST')
    .use(req$ =>
        req$.pipe(
            use(validator$),
            mergeMap(req =>
                of(req.body).pipe(
                    mergeMap(goods =>
                        from(
                            getRepository(GoodsModel).save({
                                ...goods,
                                sale: 0
                            })
                        )
                    ),
                    mergeMap(neverNullable),
                    map(batch => ({
                        body: {
                            code: 10000,
                            data: {
                                batch: batch
                            }
                        }
                    })),
                    catchError(error =>
                        throwError(
                            new HttpError(
                                `Goods create fail: ${error}`,
                                HttpStatus.INTERNAL_SERVER_ERROR
                            )
                        )
                    )
                )
            )
        )
    )
