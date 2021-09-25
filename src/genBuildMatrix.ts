import * as core from '@actions/core'
import {ok} from 'assert'
import * as cache from './utils/cache'
import * as matrix from './utils/matrix'

type Include = {
  entry: matrix.ComputePlatform
  'cache-hit': boolean
  'runs-on': 'ubuntu-latest' | string[]
}

async function run(): Promise<void> {
  try {
    const entries: matrix.ComputePlatform[] = core.getMultilineInput(
      'entries',
      {
        required: true
      }
    ) as matrix.ComputePlatform[]
    const runnerLabels: string[] = core.getMultilineInput('runner-labels', {
      required: true
    })
    const buildDigest = await cache.getDigestByType('build')
    let entryIncludes: Include[] = []
    for (const entry of entries) {
      const keys = [cache.keyFrom({digest: buildDigest, entry})]
      const foundKey = await cache.checkComplete(keys)
      entryIncludes = entryIncludes.concat([
        {
          entry,
          'cache-hit': !!foundKey,
          'runs-on': foundKey ? 'ubuntu-latest' : runnerLabels
        }
      ])
    }
    ok(entryIncludes.length !== 0, 'entryIncludes.length !== 0')
    const outputMatrix = {
      entry: entryIncludes.map(x => x.entry),
      include: entryIncludes
    }
    core.setOutput('matrix', outputMatrix)
    core.info(JSON.stringify(outputMatrix, null, 2))
  } catch (error) {
    core.setFailed(error as Error)
  }
}

run()
