import os
from result import Result
from solution import Solution


# Block: Remove if output is variable
def make_string(arrs):
    return "[" + ", ".join(map(lambda x: str(x), arrs)) + "]"


# EndBlock: Remove if output is variable


def check_output(expected, actual):
    # Block: Compare the actual and expected output -- Yours to change
    # Replace "condition" with your comparison logic
    if set(expected) == set(actual):
        return True
    return False
    # EndBlock: Compare the actual and expected output


def main():
    ##
    # finalOutput: Template
    #
    # All passed:
    # # passed
    # # passed/total i.e.(104/104)
    #
    # Failed:
    # # failed
    # # actual output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
    # # expected output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
    # # failed tests i.e. ([2,7,89])
    # # passed/total i.e (17/104)
    #
    # Error:
    # # error
    # # error i.e. (An error accured at ...)
    # #
    final_output = ""
    final_output_file_name = "final_output.txt"

    action = os.getenv("ACTION")
    try:
        # Block: Parse input from the file -- Yours to change
        # Change variable names, types and parsing logic as needed
        nums = []
        targets = []
        input_lines = read_file("testcase.txt")
        for i in range(0, len(input_lines), 2):
            temp = list(
                map(
                    int,
                    input_lines[i]
                    .strip()
                    .replace("[", "")
                    .replace("]", "")
                    .replace("\n", "")
                    .split(","),
                )
            )
            target = int(input_lines[i + 1])
            nums.append(temp)
            targets.append(target)
        # EndBlock: Parse input from the file

        failed = []
        count = 0
        passed = 0

        result = Result()
        solution = Solution()

        if action == "run":
            # Block: Call the methods from the Result and Solution class -- Yours to change
            # Change -- MethodName of Result and Solution class, type of actualOutput &
            # expectedOutput
            actual = []
            expected = []

            for count in range(len(nums)):
                actual_output = result.twoSum(nums[count], targets[count])
                expected_output = solution.twoSum(nums[count], targets[count])
                actual.append(actual_output)
                expected.append(expected_output)

                if check_output(expected_output, actual_output):
                    passed += 1
                else:
                    failed.append(count + 1)

            if not failed:
                final_output += f"passed\n{passed}/{count}\n{make_string(actual)}\n{make_string(expected)}"
            else:
                final_output += f"failed\n{passed}/{count}\n{make_string(actual)}\n{make_string(expected)}\n{failed}"
            # EndBlock: Call the methods from the Result and Solution class

        elif action == "submit" and file_exists("output.txt"):
            first = True
            input_str = ""
            actual = None
            expected = None

            # Block: Parse input from the file -- Yours to change
            # Change variable names, types and parsing logic as needed
            expected_output_lines = read_file("output.txt")

            for count in range(len(nums)):
                actual_output = result.twoSum(nums[count], targets[count])
                expected_output = list(
                    map(
                        int,
                        expected_output_lines[count]
                        .strip()
                        .replace("[", "")
                        .replace("]", "")
                        .replace("\n", "")
                        .split(","),
                    )
                )

                if check_output(expected_output, actual_output):
                    passed += 1
                elif first:
                    first = False
                    failed.append(count + 1)
                    input_str = make_string(nums[count]) + "\n" + str(targets[count])
                    actual = actual_output
                    expected = expected_output

            if not failed:
                final_output += f"passed\n{passed}/{count}"
            else:
                final_output += (
                    f"failed\n{passed}/{count}\n{actual}\n{expected}\n{input_str}"
                )
            # EndBlock: Parse input from the file

        write_file(final_output_file_name, final_output)

    except Exception as e:
        final_output += f"error\n{str(e)}"
        write_file(final_output_file_name, final_output)


def read_file(file_name):
    with open(file_name, "r") as file:
        return file.read().splitlines()


def write_file(file_name, content):
    with open(file_name, "w") as file:
        file.write(content)


def file_exists(file_name):
    return os.path.exists(file_name)


if __name__ == "__main__":
    main()
