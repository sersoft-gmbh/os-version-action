import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';

async function runCmd(cmd: string, args?: string[]): Promise<string> {
    const output = await getExecOutput(cmd, args, {
        failOnStdErr: true,
        silent: !core.isDebug()
    });
    return output.stdout;
}

async function main() {
    let version: string;
    switch (process.platform) {
        case 'linux':
            version = await runCmd('lsb_release', ['-sr']);
            break;
        case 'darwin':
            version = await runCmd('sw_vers', ['-productVersion']);
            break;
        case 'win32':
        case 'cygwin':
            const major = await runCmd('[System.Environment]::OSVersion.Version.Major');
            const minor = await runCmd('[System.Environment]::OSVersion.Version.Minor');
            version = `${major}.${minor}`;
            break;
        default:
            throw new Error('Unsupported platform: ' + process.platform);
    }
    core.setOutput('version', version.trim());
}

try {
    main().catch(error => core.setFailed(error.message));
} catch (error) {
    core.setFailed(error.message);
}
