"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runContainer = exports.consoleOutput = exports.error = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
const path_1 = require("path");
exports.error = false;
exports.consoleOutput = "";
const docker = new dockerode_1.default();
const containers = {
    java: {
        docker: docker,
        image: "openjdk:11",
        run: ["java", "Driver"],
    },
    python: {
        docker: docker,
        image: "python:3.9-alpine",
        run: ["python", "driver.py"],
    },
    javascript: {
        docker: docker,
        image: "node:16.20-alpine",
        run: ["node", "driver.js"],
    },
};
function clean(input) {
    return input.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '');
}
function runContainer(dirPath, language, action, cb) {
    dirPath = (0, path_1.resolve)(dirPath);
    const dockerOptions = {
        Image: containers[language].image,
        WorkingDir: '/app',
        HostConfig: {
            Binds: [`${dirPath}:/app`],
        },
        Env: [
            `ACTION=${action}`,
        ],
    };
    try {
        docker.createContainer(dockerOptions, (err, container) => {
            if (err) {
                console.error('Error creating container:', err.message);
                return;
            }
            container.start((startErr) => __awaiter(this, void 0, void 0, function* () {
                if (startErr) {
                    console.error('Error starting container:', startErr.message);
                    return;
                }
                console.log('Container is running.');
                if (language === "java") {
                    const compileOptions = {
                        AttachStdout: true,
                        AttachStderr: true,
                        Cmd: ["javac", "Result.java", "Solution.java", "Driver.java"],
                    };
                    const compileExec = yield container.exec(compileOptions);
                    yield new Promise((resolve, reject) => {
                        compileExec.start(compileOptions, (compileStartErr, compileStream) => {
                            if (compileStartErr) {
                                console.error('Error starting compile exec instance:', compileStartErr.message);
                                reject(compileStartErr);
                            }
                            else {
                                container.modem.demuxStream(compileStream, process.stdout, process.stderr);
                                compileStream.on('data', (chunk) => {
                                    exports.error = true;
                                    exports.consoleOutput += clean(chunk.toString('utf8'));
                                });
                                compileStream.on('end', () => {
                                    console.log('Java program has been compiled.');
                                    resolve(compileStream);
                                });
                            }
                        });
                    });
                }
                if (!exports.error) {
                    const runOptions = {
                        AttachStdout: true,
                        AttachStderr: true,
                        Cmd: containers[language].run,
                    };
                    const runExec = yield container.exec(runOptions);
                    console.log("Running the program");
                    yield new Promise((resolve, reject) => {
                        runExec.start(runOptions, (runStartErr, runStream) => {
                            if (runStartErr) {
                                console.error('Error starting run exec instance:', runStartErr.message);
                                reject(runStartErr);
                            }
                            else {
                                container.modem.demuxStream(runStream, process.stdout, process.stderr);
                                runStream.on('data', (chunk) => {
                                    exports.consoleOutput += clean(chunk.toString('utf8'));
                                });
                                runStream.on('end', () => __awaiter(this, void 0, void 0, function* () {
                                    yield new Promise((resolve, reject) => {
                                        runExec.inspect((inspectErr, data) => {
                                            if (inspectErr) {
                                                console.error('Error inspecting container:', inspectErr);
                                                reject(inspectErr);
                                            }
                                            else {
                                                const exitCode = data.ExitCode;
                                                if (exitCode === 1)
                                                    exports.error = true;
                                                resolve(data);
                                            }
                                        });
                                    });
                                    console.log('Program has finished.');
                                    resolve(runStream);
                                }));
                            }
                        });
                    });
                }
                container.stop(() => __awaiter(this, void 0, void 0, function* () {
                    cb();
                    exports.error = false;
                    exports.consoleOutput = "";
                    console.log("Container has been stopped.");
                    container.remove(() => {
                        console.log('Container has been removed.');
                    });
                }));
            }));
        });
    }
    catch (err) {
        if (err)
            console.error("Some error has occured: " + err);
    }
}
exports.runContainer = runContainer;
