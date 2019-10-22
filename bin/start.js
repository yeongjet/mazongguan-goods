const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const { from } = require('rxjs')
const { mergeMap } = require('rxjs/operators')
const { createConnection } = require('typeorm')
const { bootstrap, entities } = require('../packages/core')

const config = YAML.parse(
    fs.readFileSync(
        path.join(__dirname, `../config/${process.env.NODE_ENV}.yml`),
        'utf-8'
    )
)

from(
    createConnection({ ...config.database, entities: Object.values(entities) })
)
    .pipe(mergeMap(() => from(bootstrap(config.app.host, config.app.port))))
    .subscribe(() => {
        console.log('done')
    })
