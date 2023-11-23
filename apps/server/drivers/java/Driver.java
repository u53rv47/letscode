import java.io.*;
import java.util.*;

class Driver {
	// Block: Remove if output is variable
	private static String makeString(ArrayList<int[]> arrs) {
		String res = "[";
		for (int i = 0; i < arrs.size() - 1; i++) {
			res += (Arrays.toString(arrs.get(i)) + ",");
		}
		res += (Arrays.toString(arrs.get(arrs.size() - 1)) + "]");
		return res;
	}
	// EndBlock: Remove if output is variable

	private static boolean checkOutput(int[] expected, int[] actual) {
		// Block: Compare the actual and expected output -- Yours to change
		// Replace "condition" with your comparison logic
		if ((expected[0] == actual[0] && expected[1] == actual[1])
				|| (expected[0] == actual[1] && expected[1] == actual[0])) {
			return true;
		}
		return false;
		// EndBlock: Compare the actual and expected output
	}

	public static void main(String[] args) {
		/*
		 * finalOutput: Template
		 * 
		 * All passed:
		 * * passed
		 * * passed/total i.e.(104/104)
		 * if action == "run":
		 * * * actual output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
		 * * * expected output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
		 * 
		 * Failed:
		 * * failed
		 * * passed/total i.e (17/104)
		 * * actual output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
		 * * expected output i.e. ([23, 34, 123] or [[32, 3], [5, 3]])
		 * * action == "run" ? failed tests i.e. ([2,7,89]) : input i.e (1\n[2, 4,
		 * 5]\n[3, 5, 2])
		 * 
		 * Error:
		 * * error
		 * * error i.e. (An error accured at ...)
		 */
		String finalOutput = "";
		String finalOutputFileName = "final_output.txt";

		String action = System.getenv("ACTION");
		try {
			// Block: Parse input from the file -- Yours to change
			// Change variable names, types and parsing logic as needed
			ArrayList<int[]> nums = new ArrayList<>();
			ArrayList<Integer> targets = new ArrayList<>();
			String[] inputLines = readFile("testcase.txt");
			for (int i = 0; i < inputLines.length; i += 2) {
				int[] temp = Arrays.stream(inputLines[i]
						.trim()
						.replaceAll("[\\[\\]\\n]", "")
						.split(","))
						.filter(x -> !x.trim().isEmpty())
						.mapToInt(Integer::parseInt)
						.toArray();
				int target = Integer.parseInt(inputLines[i + 1]);
				nums.add(temp);
				targets.add(target);
			}
			// EndBlock: Parse input from the file

			int count = 0, passed = 0;
			Result result = new Result();
			Solution solution = new Solution();
			if ("run".equals(action)) {
				ArrayList<Integer> failed = new ArrayList<>();
				// Block: Call the methods from the Result and Solution class -- Yours to change
				// Change -- MethodName of Result and Solution class, type of actualOutput &
				// expectedOutput
				ArrayList<int[]> actual = new ArrayList<>();
				ArrayList<int[]> expected = new ArrayList<>();

				for (count = 0; count < nums.size(); count++) {
					int[] actualOutput = result.twoSum(nums.get(count), targets.get(count));
					int[] expectedOutput = solution.twoSum(nums.get(count), targets.get(count));
					actual.add(actualOutput);
					expected.add(expectedOutput);

					if (checkOutput(expectedOutput, actualOutput)) {
						passed++;
					} else
						failed.add(count + 1);
				}

				if (failed.size() == 0)
					finalOutput += "passed\n"
							+ passed + "/" + count + "\n"
							+ makeString(actual) + "\n"
							+ makeString(expected);
				else {
					finalOutput += "failed\n"
							+ passed + "/" + count + "\n"
							+ makeString(actual) + "\n"
							+ makeString(expected) + "\n"
							+ failed.toString();
				}
				// EndBlock: Call the methods from the Result and Solution class

			} else if (fileExists("output.txt")) {
				boolean first = true;
				String input = "";
				int[] actual = new int[1];
				int[] expected = new int[1];

				// Block: Parse input from the file -- Yours to change
				// Change variable names, types and parsing logic as needed
				String[] expectedOutputLines = readFile("output.txt");
				for (count = 0; count < nums.size(); count++) {
					int[] actualOutput = result.twoSum(nums.get(count), targets.get(count));
					int[] expectedOutput = Arrays.stream(expectedOutputLines[count]
							.trim()
							.replaceAll("[\\[\\]\\n]", "")
							.split(","))
							.filter(x -> !x.trim().isEmpty())
							.mapToInt(Integer::parseInt)
							.toArray();
					if (checkOutput(expectedOutput, actualOutput)) {
						passed++;
					} else if (first) {
						first = false;
						input = Arrays.toString(nums.get(count)) + "\n"
								+ targets.get(count);
						actual = actualOutput;
						expected = expectedOutput;
					}
				}
				if (first)
					finalOutput += "passed\n" + passed + "/" + count;
				else {
					finalOutput += "failed\n"
							+ passed + "/" + count + "\n"
							+ Arrays.toString(actual) + "\n"
							+ Arrays.toString(expected) + "\n"
							+ input;
				}
				// EndBlock: Parse input from the file
			}
			writeFile(finalOutputFileName, finalOutput);

		} catch (IOException e) {
			finalOutput += "error\n" + e.toString();
			writeExceptionToFile(finalOutputFileName, finalOutput);
		}
	}

	private static boolean fileExists(String fileName) {
		return new File(fileName).exists();
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

	private static void writeExceptionToFile(String fileName, String exceptionDetails) {
		try {
			writeFile(fileName, exceptionDetails);
		} catch (IOException e) {
			// Handle any exceptions that may occur while writing to the exception file
			e.printStackTrace();
		}
	}
}
