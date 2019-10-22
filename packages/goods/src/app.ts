import { createServer } from 'http'
import { createContext, combineRoutes, httpListener } from '@marblejs/core'
import chalk from 'chalk'
import { bodyParser$ } from '@marblejs/middleware-body'
import { logger$ } from '@marblejs/middleware-logger'
import { notFound$, createBatch$ } from './api'
import * as models from './model'

const middlewares = [logger$(), bodyParser$()]

const effects = [combineRoutes('/', [createBatch$, notFound$])]

export const entities = models

export const bootstrap = async (host: string, port: number) => {
    createServer(httpListener({ middlewares, effects }).run(createContext()))
        .listen(port, () => {
            console.info(
                chalk.green('[server] running'),
                `http://${host}:${port}/`
            )
        })
        .on('close', () => {
            console.info(chalk.green('[server] stopped'))
        })
        .on('error', (error: Error) => {
            console.error(chalk.red('[server] errored'), error.message)
        })
}
