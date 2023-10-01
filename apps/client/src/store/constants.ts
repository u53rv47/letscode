export const initialDesc = '<p>Enter the problem description here...</p>'
export const initialInputs = { name: "", type: "", add: true }
export const languages = {
	java: {
		result:
			`import java.util.*;

class Result {
    public void helloMethod(String[] args) {
        System.out.println("Hello World");
    }
}`,
		driver: `import java.io.*;
import java.util.*;

class Driver {
	private static boolean checkOutput(int[] expected, int[] actual) {
		// Block: Compare the actual and expected output -- Yours to change
		// Replace "condition" with your comparison logic
		if (/*condition*/) {
			return true;
		}
		return false;
		// EndBlock: Compare the actual and expected output
	}

	public static void main(String[] args) {
		String inputFileName = "testcase.txt";
		String expectedOutputFileName = "output.txt";
		String finalOutputFileName = "final_output.txt";
		String action = System.getenv("ACTION");

		/*
		 * finalOutput: Template
		 * 
		 * All passed:
		 * * passed
		 * * passed/total i.e.(104/104)
		 * 
		 * Failed:
		 * * failed
		 * * first input
		 * * second input
		 * * ............
		 * * passed: passed/total i.e (passed: 17/104)
		 */
		String finalOutput = "";

		try {
			boolean isFirst = true;
			int count = 0, passed = 0;

			String[] inputLines = readFile(inputFileName);
			String[] expectedOutputLines = null;
			if (fileExists(expectedOutputFileName)) {
				expectedOutputLines = readFile(expectedOutputFileName);
			}

			Result result = new Result();
			Solution solution = new Solution();
			// Block: Parse input from the file -- Yours to change
			// // Change variable names, types and parsing logic as needed
			for (int i = 0; i < inputLines.length; i += 2) {
				int[] nums = Arrays.stream(inputLines[i]
						.trim()
						.replaceAll("[\\[\\]\\n]", "")
						.split(","))
						.filter(x -> !x.trim().isEmpty())
						.mapToInt(Integer::parseInt)
						.toArray();
				int target = Integer.parseInt(inputLines[i + 1]);
				// EndBlock: Parse input from the file

				// Block: Call the methods from the Result and Solution class -- Yours to change
				// Change -- MethodName of Result and Solution class, type of actualOutput &
				// expectedOutput
				int[] actualOutput = result.helloMethod(nums, target);

				int[] expectedOutput;
				if ("run".equals(action)) {
					expectedOutput = solution.helloMethod(nums, target);
				} else {
					expectedOutput = Arrays.stream(expectedOutputLines[count]
							.trim()
							.replaceAll("[\\[\\]\\n]", "")
							.split(","))
							.filter(x -> !x.trim().isEmpty())
							.mapToInt(Integer::parseInt)
							.toArray();
				}
				count++;
				// EndBlock: Call the result method from the Result class

				if (checkOutput(expectedOutput, actualOutput)) {
					passed++;
				} else if (isFirst) {
					isFirst = false;

					// Block: Add inputs to finalOutput
					// Change variable names
					finalOutput = "failed\n" + Arrays.toString(nums).replaceAll(" ", "") + "\n" + target;
					// EndBlock: Add inputs to finalOutput
				}
			}
			if (isFirst)
				finalOutput += "passed\n" + passed + "/" + count;
			else
				finalOutput += "\npassed: " + passed + "/" + count;
			writeFile(finalOutputFileName, finalOutput);

		} catch (IOException e) {
			finalOutput += "error\n" + e.toString();
			writeExceptionToFile(finalOutputFileName, finalOutput);
		}
	}

	private static String[] readFile(String fileName) throws IOException {
		try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
			return reader.lines().toArray(String[]::new);
		}
	}

	private static void writeFile(String fileName, String content) throws IOException {
		try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
			writer.write(content);
		}
	}

	private static boolean fileExists(String fileName) {
		return new File(fileName).exists();
	}

	private static void writeExceptionToFile(String fileName, String exceptionDetails) {
		try {
			writeFile(fileName, exceptionDetails);
		} catch (IOException e) {
			// Handle any exceptions that may occur while writing to the exception file
			e.printStackTrace();
		}
	}
}
`,
		solution: `import java.util.*;

class Solution {
    public void helloMethod(String[] args) {
        System.out.println("Hello World");
    }
}`,
	},
	python: {
		result: `import os
from result import Result
from solution import Solution


def checkOutput(expected, actual):
    # Block: Compare the actual and expected output -- Yours to change
    # Replace "condition" with your comparison logic
    if condition:  # Modify the condition as needed
        return True
    return False
    # EndBlock: Compare the actual and expected output


def main():
    inputFileName = "testcase.txt"
    expectedOutputFileName = "output.txt"
    finalOutputFileName = "final_output.txt"
    action = os.getenv("ACTION")

    #
    # # finalOutput: Template
    #
    # All passed:
    # # passed
    # # passed/total i.e.(104/104)
    #
    # Failed:
    # # failed
    # # first input
    # # second input
    # # ............
    # # passed: passed/total i.e (passed: 17/104)
    #
    finalOutput = ""

    try:
        isFirst, count, passed = True, 0, 0

        with open(inputFileName, "r") as file:
            inputLines = file.read().strip().split("\n")

        expectedOutputLines = []
        if os.path.exists(expectedOutputFileName):
            with open(expectedOutputFileName, "r") as file:
                expectedOutputLines = file.read().strip().split("\n")

        result = Result()
        solution = Solution()
        # Block: Parse input from the file -- Yours to change
        # Change variable names and parsing logic as needed
        for i in range(0, len(inputLines), 2):
            nums = list(
                map(
                    int,
                    inputLines[i]
                    .strip()
                    .replace("[", "")
                    .replace("]", "")
                    .replace("\n", "")
                    .split(","),
                )
            )

            target = int(inputLines[i + 1])
            # EndBlock: Parse input from the file

            # Block: Call the methods from the Result and Solution class -- Yours to change
            # Change -- MethodName of Result and Solution class
            actualOutput = result.helloMethod(nums, target)

            if "run" == action:
                expectedOutput = solution.helloMethod(nums, target)
            else:
                expectedOutput = list(
                    map(
                        int,
                        expectedOutputLines[count]
                        .strip()
                        .replace("[", "")
                        .replace("]", "")
                        .replace("\n", "")
                        .split(","),
                    )
                )
            # EndBlock: Call the result method from the Result class

            count += 1
            if checkOutput(expectedOutput, actualOutput):
                passed += 1
            elif isFirst:
                isFirst = False
                # Block: Add inputs to finalOutput
                # Change variable names
                finalOutput = (
                    "failed\n" + str(nums).replace(" ", "") + "\n" + str(target)
                )
                # EndBlock: Add inputs to finalOutput

        if isFirst:
            finalOutput += "passed\n" + str(passed) + "/" + str(count)
        else:
            finalOutput += "\npassed: " + str(passed) + "/" + str(count)

        writeFile(finalOutputFileName, finalOutput)

    except Exception as e:
        finalOutput += "error\n" + str(e)
        writeExceptionToFile(finalOutputFileName, finalOutput)


def writeFile(fileName, content):
    try:
        with open(fileName, "w") as file:
            file.write(content)
    except Exception as e:
        # Handle any exceptions that may occur while writing to the file
        print(e)


def writeExceptionToFile(fileName, exceptionDetails):
    try:
        writeFile(fileName, exceptionDetails)
    except Exception as e:
        # Handle any exceptions that may occur while writing to the exception file
        print(e)


if __name__ == "__main__":
    main()
`,
		solution: `import math

class Solution:
    def helloMethod(self, args):
        print("Hello World")`,
	},
	javascript: {
		result: `/**
 * @param {any} args
 * @return {null}
 */
const helloMethod = function (args) {
	console.log("Hello World");
};

module.exports = helloMethod;`,
		driver: `const fs = require('fs');
const result = require('./result')
const solution = require('./solution')

function checkOutput(expected, actual) {
    // Block: Compare the actual and expected output -- Yours to change
    // Replace "condition" with your comparison logic
    if (/* condition */) {
        return true;
    }
    return false;
    // EndBlock: Compare the actual and expected output
}

function main() {
    const inputFileName = "testcase.txt";
    const expectedOutputFileName = "output.txt";
    const finalOutputFileName = "final_output.txt";
    const action = process.env.ACTION;

    /*
     * finalOutput: Template
     * 
     * All passed:
     * * passed
     * * passed/total i.e.(104/104)
     * 
     * Failed:
     * * failed
     * * first input
     * * second input
     * * ............
     * * passed: passed/total i.e (passed: 17/104)
     */
    let finalOutput = "";

    try {
        let isFirst = true;
        let count = 0;
        let passed = 0;

        const inputLines = fs.readFileSync(inputFileName, "utf-8").trim().split('\n');
        let expectedOutputLines = null;

        if (fs.existsSync(expectedOutputFileName)) {
            expectedOutputLines = fs.readFileSync(expectedOutputFileName, "utf-8").trim().split('\n');
        }

        // Block: Parse input from the file -- Yours to change
        // Change variable names and parsing logic as needed
        for (let i = 0; i < inputLines.length; i += 2) {
            const nums = inputLines[i]
                .trim()
                .replace(/[\[\]\n]/g, '')
                .split(',')
                .filter(x => x.trim() !== '')
                .map(x => parseInt(x));
            const target = parseInt(inputLines[i + 1]);
            // EndBlock: Parse input from the file

            // Block: Call the methods from the Result and Solution class -- Yours to change
            // Change logic as needed
            const actualOutput = result(nums, target);

            let expectedOutput;

            if (action === "run") {
                expectedOutput = solution(nums, target);
            } else {
                expectedOutput = expectedOutputLines[count]
                    .trim()
                    .replace(/[\[\]\n]/g, '')
                    .split(',')
                    .filter(x => x.trim() !== '')
                    .map(x => parseInt(x));
            }
            // EndBlock: Call the methods from the Result and Solution class
            count++;

            if (checkOutput(expectedOutput, actualOutput)) {
                passed++;
            } else if (isFirst) {
                isFirst = false;

                // Block: Add inputs to finalOutput
                // Change variable names
                finalOutput = "failed\n" + nums.toString().replace(/\s/g, "") + "\n" + target;
                // EndBlock: Add inputs to finalOutput
            }
        }

        if (isFirst) {
            finalOutput += "passed\n" + passed + "/" + count;
        } else {
            finalOutput += "\npassed: " + passed + "/" + count;
        }

        fs.writeFileSync(finalOutputFileName, finalOutput);
    } catch (e) {
        finalOutput += "error\n" + e.toString();
        writeExceptionToFile(finalOutputFileName, finalOutput);
    }
}

function writeExceptionToFile(filename, exceptionDetails) {
    try {
        fs.writeFileSync(filename, exceptionDetails);
    } catch (e) {
        // Handle any exceptions that may occur while writing to the exception file
        console.error(e);
    }
}

main();`,
		solution: `const helloMethod = function (args) {
    console.log("Hello World");
};

module.exports = helloMethod;`,
	}
};