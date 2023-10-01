const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');
const docker = new Docker();
const pathToJavaProgram = '/path/to/uploads/289787372897894/java';
const outputPath = '/app/output';
const dockerOptions = {
    Image: 'openjdk:11',
    WorkingDir: '/app',
    HostConfig: {
        Binds: [`${pathToJavaProgram}:/app`, `${pathToJavaProgram}:/app/output`],
    },
};
function writeFile(contentType, content, container) {
    if (contentType === 'error') {
        container.stop(() => {
            container.remove(() => {
                console.log('Container has been stopped and removed.');
            });
        });
    }
}
docker.createContainer(dockerOptions, (err, container) => {
    if (err) {
        console.error('Error creating container:', err.message);
        return;
    }
    container.start((startErr) => {
        if (startErr) {
            console.error('Error starting container:', startErr.message);
            return;
        }
        console.log('Java container is running.');
    });
    const runOptions = {
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['java', 'Driver'],
    };
    let stdoutData = '';
    let stderrData = '';
    container.exec(runOptions, (runErr, runExec) => {
        if (runErr) {
            console.error('Error creating run exec instance:', runErr.message);
            return;
        }
        runExec.start((runStartErr, runStream) => {
            if (runStartErr) {
                console.error('Error starting run exec instance:', runStartErr.message);
                return;
            }
            runStream.on('data', (chunk) => {
                const chunkString = chunk.toString();
                console.log(chunkString);
                stdoutData += chunkString;
            });
            runStream.stderr.on('data', (chunk) => {
                const chunkString = chunk.toString();
                console.error(chunkString);
                stderrData += chunkString;
            });
            runStream.on('end', () => {
                console.log('Java program (Driver.java) has finished.');
            });
        });
    });
    const stdoutFilePath = path.join(outputPath, 'stdout.txt');
    fs.writeFile(stdoutFilePath, stdoutData, (stdoutFileErr) => {
        if (stdoutFileErr) {
            console.error('Error writing stdout to file:', stdoutFileErr);
            return;
        }
    });
    const stderrFilePath = path.join(outputPath, 'stderr.txt');
    fs.writeFile(stderrFilePath, stderrData, (stderrFileErr) => {
        if (stderrFileErr) {
            console.error('Error writing stderr to file:', stderrFileErr);
            return;
        }
    });
    console.log('Output files have been written.');
    const stdoutHostPath = path.join(pathToJavaProgram, 'stdout.txt');
    const stderrHostPath = path.join(pathToJavaProgram, 'stderr.txt');
    container.copy({ Resource: `${container.id}:${stdoutFilePath}` }, (copyErr, stdoutStream) => {
        if (copyErr) {
            console.error('Error copying stdout file:', copyErr.message);
            return;
        }
        const stdoutFileStream = fs.createWriteStream(stdoutHostPath);
        stdoutStream.pipe(stdoutFileStream);
        stdoutFileStream.on('finish', () => {
            console.log('stdout.txt has been copied back to the host machine.');
        });
    });
    container.copy({ Resource: `${container.id}:${stderrFilePath}` }, (copyErr, stderrStream) => {
        if (copyErr) {
            console.error('Error copying stderr file:', copyErr.message);
            return;
        }
        const stderrFileStream = fs.createWriteStream(stderrHostPath);
        stderrStream.pipe(stderrFileStream);
        stderrFileStream.on('finish', () => {
            console.log('stderr.txt has been copied back to the host machine.');
        });
    });
    container.stop();
    container.remove(() => {
        console.log('Container has been stopped and removed.');
    });
});
