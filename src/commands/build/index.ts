import { Command, Flags } from '@oclif/core'
import * as process from 'process'
import os from 'os'
import { buildWithCondaOrManyLinux } from '../../buildOneFlow'
import * as env from '../../utils/env'

process.env['RUNNER_TOOL_CACHE'] = '~/runner_tool_cache'.replace('~', os.homedir)
process.env['RUNNER_TEMP'] = '~/runner_temp'.replace('~', os.homedir)
process.env['INPUT_WHEELHOUSE-DIR'] = '~/manylinux-wheelhouse'
process.env['MANYLINUX'] = '1'

interface SimpleObject {
    [key: string]: any
}

export default class Cuda extends Command {

    async init(): Promise<void> {
        const yaml = require('js-yaml');
        const fs = require('fs');

        const settings = yaml.load(fs.readFileSync('action.yml', 'utf8')).inputs as SimpleObject;
        const flags = {} as SimpleObject;
        for (let key in settings) {
            let val = settings[key]['default'];
            let req = settings[key]['required'] == 'true' && !val;
            if (val) env.setInput(key as string, val);
            flags[key] = Flags.string({
                description: `set ${key}`,
                required: req
            });
        }
        Cuda.flags = flags;
    }
    static description = 'Build cuda version of oneflow';

    static examples = [
        `$ get-oneflow build --$key $value`,
    ];

    async run(): Promise<void> {
        for (let key in Cuda.flags)
            console.log(key)
        const { args, flags } = await this.parse(Cuda);

        for (let key in flags as SimpleObject) {
            flags[key] == 'undefined' ? delete process.env[key] :
                env.setInput(key as string, flags[key]);
        }
        await buildWithCondaOrManyLinux();
    }


}
