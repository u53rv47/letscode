"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFileContainer = exports.jsDocker = exports.javaDocker = exports.pythonDocker = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
const path_1 = require("path");
exports.pythonDocker = new dockerode_1.default();
exports.javaDocker = new dockerode_1.default();
exports.jsDocker = new dockerode_1.default();
const containers = {
    java: {
        container: exports.javaDocker,
        image: "openjdk:11",
        run: ["java", "Driver"],
    },
    python: {
        container: exports.pythonDocker,
        image: "python:3.9-alpine",
        run: ["python", "driver.py"],
    },
    javascript: {
        container: exports.jsDocker,
        image: "node:16.20-alpine",
        run: ["node", "driver.js"],
    },
};
function runFileContainer(dirPath, language) {
    dirPath = (0, path_1.resolve)(dirPath);
    const imageName = language + "-image";
    const containerName = language + "-container";
    containers[language].container.buildImage({
        context: dirPath,
        src: ['Dockerfile'],
    }, { t: imageName }, function (err, stream) {
        if (err) {
            console.error('Error building Docker image:', err);
        }
        else {
            stream.pipe(process.stdout, { end: true });
            stream.on('end', function () {
                docker.createContainer({
                    name: containerName,
                    Image: imageName,
                }, function (err, container) {
                    if (err) {
                        console.error('Error creating container:', err);
                    }
                    else {
                        container.start(function (err, data) {
                            if (err) {
                                console.error('Error starting container:', err);
                            }
                            else {
                                console.log('Container started successfully!');
                                container.wait(function (err, data) {
                                    container.remove(function (err, data) {
                                        if (err) {
                                            console.error('Error removing container:', err);
                                        }
                                        else {
                                            console.log('Container removed successfully!');
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}
exports.runFileContainer = runFileContainer;
