const fs = require('fs');
const result = require('./result')
const solution = require('./solution');


function fileExists(fileName) {
    return fs.existsSync(fileName);
}

function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8').split('\n');
}

function writeFile(fileName, content) {
    fs.writeFileSync(fileName, content);
}

function writeExceptionToFile(fileName, exceptionDetails) {
    try {
        writeFile(fileName, exceptionDetails);
    } catch (e) {
        // Handle any exceptions that may occur while writing to the exception file
        console.error(e);
    }
}

// Block: Remove if output is variable
function makeString(arrs) {
    return "[" + arrs.map(arr => "[" + arr.join(",") + "]").join(",") + "]";
}
// EndBlock: Remove if output is variable

// Block: Compare the actual and expected output -- Yours to change
// Replace "condition" with your comparison logic
function checkOutput(expected, actual) {
    if ((expected[0] == actual[0] && expected[1] == actual[1])
        || (expected[0] == actual[1] && expected[1] == actual[0])) {
        return true;
    }
    return false;
}
// EndBlock: Compare the actual and expected output

function main() {
    /*
    * finalOutput: Template
    * 
    * All passed:
    * * passed
    * * passed/total i.e.(104/104)
    * 
    * Failed:
    * * failed
    * * actual output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
    * * expected output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
    * * failed tests i.e. ([2,7,89])
    * * passed/total i.e (17/104)
    * 
    * Error:
    * * error
    * * error i.e. (An error accured at ...)
    */
    let finalOutput = "";
    const finalOutputFileName = "final_output.txt";

    const action = process.env.ACTION;
    try {
        // Block: Parse input from the file -- Yours to change
        // Change variable names, types and parsing logic as needed
        const nums = [];
        const targets = [];
        const inputLines = readFile("testcase.txt");
        for (let i = 0; i < inputLines.length; i += 2) {
            const temp = inputLines[i]
                .trim()
                .replace(/[\[\]\n]/g, "")
                .split(",")
                .filter(x => x.trim() !== "")
                .map(Number);
            const target = parseInt(inputLines[i + 1]);
            nums.push(temp);
            targets.push(target);
        }
        // EndBlock: Parse input from the file

        const failed = [];
        let count = 0, passed = 0;

        if (action === "run") {
            // Block: Call the methods from the Result and Solution class -- Yours to change
            // Change -- MethodName of Result and Solution class, type of actualOutput &
            // expectedOutput
            const actual = [];
            const expected = [];

            for (count = 0; count < nums.length; count++) {
                const actualOutput = result(nums[count], targets[count]);
                const expectedOutput = solution(nums[count], targets[count]);
                actual.push(actualOutput);
                expected.push(expectedOutput);

                if (checkOutput(expectedOutput, actualOutput)) {
                    passed++;
                } else {
                    failed.push(count + 1);
                }
            }

            if (failed.length === 0)
                finalOutput += "passed\n"
                    + passed + "/" + count + "\n"
                    + toString(actual) + "\n"
                    + toString(expected);
            else {
                finalOutput += "failed\n"
                    + passed + "/" + count + "\n"
                    + makeString(actual) + "\n"
                    + makeString(expected) + "\n"
                    + failed.toString();
            }
            // EndBlock: Call the methods from the Result and Solution class
        } else if (action === "submit" && fileExists("output.txt")) {
            let first = true;
            let input = "";
            let actual, expected;

            // Block: Parse input from the file -- Yours to change
            // Change variable names, types and parsing logic as needed
            const expectedOutputLines = readFile("output.txt");
            for (count = 0; count < nums.length; count++) {
                const actualOutput = result(nums[count], targets[count]);
                const expectedOutput = expectedOutputLines[count]
                    .trim()
                    .replace(/[\[\]\n]/g, "")
                    .split(",")
                    .filter(x => x.trim() !== "")
                    .map(Number);
                if (checkOutput(expectedOutput, actualOutput)) {
                    passed++;
                } else if (first) {
                    first = false;
                    failed.push(count + 1);
                    input = JSON.stringify(nums[count]) + "\n" + targets[count];
                    actual = actualOutput;
                    expected = expectedOutput;
                }
            }
            if (failed.length === 0)
                finalOutput += "passed\n" + passed + "/" + count;
            else {
                finalOutput += "failed\n"
                    + passed + "/" + count + "\n"
                    + actual.toString() + "\n"
                    + expected.toString() + "\n"
                    + input;
            }
            // EndBlock: Parse input from the file
        }

        writeFile(finalOutputFileName, finalOutput);

    } catch (e) {
        finalOutput += "error\n" + e.toString();
        writeExceptionToFile(finalOutputFileName, finalOutput);
    }
}

main();