import Docker from "dockerode";
import path, { resolve } from "path";

export let error = false;
export let consoleOutput = "";

const docker = new Docker();

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

function clean(input: string) {
	return input.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '');
}
export function runContainer(dirPath: string, language: string, action: string, cb: Function) {
	dirPath = resolve(dirPath);
	const dockerOptions = {
		Image: containers[language].image,
		WorkingDir: '/app',
		HostConfig: {
			Binds: [`${dirPath}:/app`], // Mount the program directory
		},
		Env: [
			`ACTION=${action}`,
		],
	};
	// Create the container
	try {
		docker.createContainer(dockerOptions, (err, container) => {
			if (err) {
				console.error('Error creating container:', err.message);
				// cb(consoleOutput, error);
				stopContainer(container);
				cb();
				return;
			}
			// Start the container
			container.start(async (startErr) => {
				if (startErr) {
					console.error('Error starting container:', startErr.message);
					return;
				}
				console.log('Container is running.');

				// Compile the Java program (if language is "java")
				if (language === "java") {
					const compileOptions: Docker.ExecCreateOptions = {
						AttachStdout: true,
						AttachStderr: true,
						Cmd: ["javac", "Result.java", "Solution.java", "Driver.java"],
					};
					const compileExec = await container.exec(compileOptions);
					await new Promise((resolve, reject) => {
						compileExec.start(compileOptions, (compileStartErr, compileStream) => {
							if (compileStartErr) {
								console.error('Error starting compile exec instance:', compileStartErr.message);
								reject(compileStartErr);
							} else {
								container.modem.demuxStream(compileStream, process.stdout, process.stderr);

								compileStream.on('data', (chunk) => {
									error = true;
									consoleOutput += clean(chunk.toString('utf8'));
								});

								compileStream.on('end', () => {
									console.log('Java program has been compiled.');
									resolve(compileStream);
								});
							}
						});
					});
				}

				// // Run generic program
				// const genericOptions: Docker.ExecCreateOptions = {
				// 	AttachStdout: true,
				// 	AttachStderr: true,
				// 	Cmd: ["ls"],
				// };
				// const genericExec = await container.exec(genericOptions);
				// console.log("Running the generic program");
				// await new Promise((resolve, reject) => {
				// 	genericExec.start(genericOptions, (genericStartErr, genericStream) => {
				// 		if (genericStartErr) {
				// 			console.error('Error starting run exec instance:', genericStartErr.message);
				// 			reject(genericStartErr);
				// 		} else {
				// 			container.modem.demuxStream(genericStream, process.stdout, process.stderr);

				// 			genericStream.on('data', (chunk) => {
				// 				consoleOutput += clean(chunk.toString('utf8'));
				// 			});

				// 			genericStream.on('end', async () => {
				// 				console.log('Generic Program has finished.');
				// 				resolve(genericStream);
				// 			});
				// 		}
				// 	});
				// });

				// Run the program
				if (!error) {
					const runOptions: Docker.ExecCreateOptions = {
						AttachStdout: true,
						AttachStderr: true,
						Cmd: containers[language].run,
					};

					const runExec = await container.exec(runOptions);
					console.log("Running the program");
					await new Promise((resolve, reject) => {
						runExec.start(runOptions, (runStartErr, runStream) => {
							if (runStartErr) {
								console.error('Error starting run exec instance:', runStartErr.message);
								reject(runStartErr);
							} else {
								container.modem.demuxStream(runStream, process.stdout, process.stderr);

								runStream.on('data', (chunk) => {
									consoleOutput += clean(chunk.toString('utf8'));
								});

								runStream.on('end', async () => {
									await new Promise((resolve, reject) => {
										runExec.inspect((inspectErr, data) => {
											if (inspectErr) {
												console.error('Error inspecting container:', inspectErr);
												reject(inspectErr);
											} else {
												const exitCode = data.ExitCode;
												// Check the exit code to determine success or failure
												if (exitCode === 1)
													error = true;
												resolve(data);
											}
										});
									});
									console.log('Program has finished.');
									resolve(runStream);
								});

							}
						});
					});
				}
				stopContainer(container);
				cb();
			});
		});
	} catch (err) {
		if (err)
			console.error("Some error has occured: " + err);
	}
}

function stopContainer(container: Docker.Container) {
	error = false;
	consoleOutput = "";
	// Stop and remove the container
	container.stop(async () => {
		console.log("Container has been stopped.")
		container.remove(() => {
			console.log('Container has been removed.');
		});
	});
}