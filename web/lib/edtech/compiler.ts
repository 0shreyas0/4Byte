/**
 * Wandbox API Wrapper for NeuralPath Coding Lab.
 * Supports multiple languages by sending code to the Wandbox remote compiler.
 */

export type Language = "javascript" | "python" | "cpp";

export interface CompileResult {
  success: boolean;
  outputs: string[]; // Lines of output from stdout
  error?: string;    // Full compiler error if any
}

const COMPILER_MAP: Record<Language, string> = {
  javascript: "nodejs-20.17.0",
  python: "cpython-3.13.8",
  cpp: "gcc-14.2.0",
};

/**
 * Executes user code against a set of inputs using the Wandbox API.
 */
export async function compileAndRun(
  language: Language,
  userCode: string,
  functionName: string,
  inputs: string[] // Raw string inputs (e.g., "[1, 2, 3]", "10")
): Promise<CompileResult> {
  let wrappedCode = "";

  if (language === "javascript") {
    wrappedCode = `
${userCode}

const inputs = [${inputs.join(", ")}];
inputs.forEach(input => {
  try {
    const result = ${functionName}(input);
    process.stdout.write("RESULT_MARKER:" + JSON.stringify(result) + "\\n");
  } catch (e) {
    process.stdout.write("RESULT_MARKER:ERROR_MARKER:" + e.message + "\\n");
  }
});
    `;
  } else if (language === "python") {
    wrappedCode = `
${userCode}

import json
inputs = [${inputs.join(", ")}]
for i in inputs:
    try:
        res = ${functionName}(i)
        print(f"RESULT_MARKER:{json.dumps(res)}")
    except Exception as e:
        print(f"RESULT_MARKER:ERROR_MARKER:{str(e)}")
    `;
  } else if (language === "cpp") {
    // Basic C++ wrapper assuming int input/output for simplicity in demo
    // For a real production app, this would need a more robust test runner
    wrappedCode = `
#include <iostream>
#include <vector>
#include <string>

${userCode}

int main() {
    // This is a simplified C++ runner for the demo
    // In a real app, we'd inject more complex test logic
    return 0; 
}
    `;
  }

  try {
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: COMPILER_MAP[language],
        code: wrappedCode,
        save: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Compiler API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Check for compiler errors (stderr or exit code)
    if (data.status !== "0" && data.program_error) {
      return { 
        success: false, 
        outputs: [], 
        error: data.program_error || data.compiler_error 
      };
    }

    // Parse stdout for results
    // We expect one JSON-encoded result per line
    const lines = (data.program_output || "").trim().split("\n").filter((l: string) => l.length > 0);

    return {
      success: true,
      outputs: lines,
    };
  } catch (err: any) {
    return {
      success: false,
      outputs: [],
      error: err.message,
    };
  }
}
