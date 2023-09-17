import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { EOL } from 'os';

async function runCmd(cmd: string, ...args: string[]): Promise<string> {
    const output = await getExecOutput(cmd, args.length <= 0 ? undefined : args, {
        failOnStdErr: true,
        silent: !core.isDebug(),
    });
    return output.stdout;
}

async function main() {
    let version: string;
    switch (process.platform) {
        case 'linux':
            version = await runCmd('lsb_release', '-sr');
            break;
        case 'darwin':
            version = await runCmd('sw_vers', '-productVersion');
            break;
        case 'win32':
        case 'cygwin':
            const systemInfo = await runCmd('systeminfo');
            const nameVersionRegex = /^OS Name:\s+[A-Za-z0-9 ]*?([0-9.]+)[A-Za-z0-9 ]*?$/;
            const matchingLine = systemInfo.split(EOL).find(l => nameVersionRegex.test(l));
            if (matchingLine) {
                version = matchingLine.replace(nameVersionRegex, '$1');
            } else {
                core.warning('Could not find a suitable version in `systeminfo`. Falling back to `[System.Environment]::OSVersion`...');
                const major = await runCmd('pwsh', '-Command', '[System.Environment]::OSVersion.Version.Major');
                const minor = await runCmd('pwsh', '-Command', '[System.Environment]::OSVersion.Version.Minor');
                version = `${major.trim()}.${minor.trim()}`;
            }
            break;
        default:
            throw new Error('Unsupported platform: ' + process.platform);
    }
    core.setOutput('version', version.trim());
}

try {
    main().catch(error => core.setFailed(error.message));
} catch (error: any) {
    core.setFailed(error.message);
}
