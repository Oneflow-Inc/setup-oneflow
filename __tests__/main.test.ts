import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  await expect(wait(input)).rejects.toThrow('milliseconds not a number')
})

test('wait 100 ms', async () => {
  const start = new Date()
  await wait(100)
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(0)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_ONEFLOW-BUILD-ENV'] = 'conda'
  process.env['INPUT_CONDA-ENV-FILE'] = 'environment.yml'
  process.env['INPUT_ONEFLOW-SRC'] = 'dummy'
  process.env['INPUT_CMAKE-INIT-CACHE'] = 'dummy'
  process.env['INPUT_DRY-RUN'] = 'true'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  try {
    console.log(cp.execFileSync(np, [ip], options).toString())
  } catch (error) {
    console.log(error.output.toString())
    throw error
  }
})

test('test runs1', () => {
  if (process.platform != 'linux') {
    return
  }
  process.env['INPUT_ONEFLOW-BUILD-ENV'] = 'conda'
  process.env['INPUT_CMAKE-INIT-CACHE'] =
    '~/oneflow-conda/cmake/caches/cn/fast/cpu-clang.cmake'
  process.env['INPUT_ONEFLOW-SRC'] = '~/oneflow-conda'
  process.env['INPUT_ONEFLOW-BUILD-ENV'] = 'conda'
  process.env['INPUT_CONDA-ENV-FILE'] =
    '~/conda-env/dev/clang10/environment-v2.yml'
  process.env['INPUT_CONDA-INSTALLER-URL'] =
    'https://oneflow-static.oss-cn-beijing.aliyuncs.com/downloads/conda-installers/Miniconda3-py39_4.10.3-Linux-x86_64.sh'
  process.env['INPUT_CONDA-PREFIX'] = '~/miniconda3-prefixes/py39_4.10.3'
  process.env['INPUT_SELF-HOSTED'] = 'true'
  process.env['INPUT_DRY-RUN'] = 'false'
  process.env['RUNNER_TEMP'] = '~/runner-tmp'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  try {
    console.log(cp.execFileSync(np, [ip], options).toString())
  } catch (error) {
    console.log(error.output.toString())
    throw error
  }
})
