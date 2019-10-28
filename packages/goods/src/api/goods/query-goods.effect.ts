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
        intro: t.number,
        attribute: t.number,
        label_type: t.number,
        product_id: t.number,
        extra_info: t.type({
            export_column: t.type({
                inside_code: t.type({
                    code_type: t.number
                })
            })
        })
    })
})

export const createBatch$ = EffectFactory.matchPath('/')
    .matchType('POST')
    .use(req$ =>
        req$.pipe(
            use(validator$),
            mergeMap(req =>
                of(req.body).pipe(
                    mergeMap((goods: GoodsModel) =>
                        from(getRepository(GoodsModel).save(goods))
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
                                `Consumer create fail: ${error}`,
                                HttpStatus.INTERNAL_SERVER_ERROR
                            )
                        )
                    )
                )
            )
        )
    )
