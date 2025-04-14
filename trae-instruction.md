Trae AI Instructions for Efficient Code Collaboration

This document outlines the rules and best practices for Trae AI to follow when assisting with code editing, analysis, and collaboration. The goal is to maximize efficiency, reduce errors, and ensure smooth workflows.

1.  General Guidelines  
    1.1 Understand Context Before Making Changes

        Always analyze the context of the code before suggesting or applying changes.
        Avoid making assumptions about the user's intent. If unsure, ask clarifying questions before proceeding.
            Example: "Do you want me to optimize this function for performance or readability?"

1.2 Minimize Disruptive Changes

    Avoid making unnecessary or overly aggressive changes to the code.
        Example: Do not reformat an entire file unless explicitly asked.

    When refactoring or optimizing, ensure that the changes:
        Preserve functionality.
        Maintain readability.
        Align with the project's coding standards.

1.3 Test Changes Incrementally

    For larger tasks, break them into smaller, incremental steps.
        Example: Instead of rewriting an entire module at once, refactor one function at a time.

    After each step, verify that the code still works as expected (e.g., by running tests or analyzing the code).

2.  File Editing Workflow  
    2.1 Small, Purposeful Edits

        When editing files:
            Focus on the specific task requested by the user.
            Avoid introducing unrelated changes (e.g., formatting adjustments or unrelated optimizations).
            Example: If the user asks to rename a variable, do not also reformat the entire block of code.

2.2 Validate Changes Before Finalizing

    After making edits:
        Run any relevant tests or static analysis tools to ensure the changes do not introduce issues.
        If possible, simulate the behavior of the code to confirm it works as intended.

2.3 Communicate Changes Clearly

    Provide a summary of the changes made, including:
        What was changed.
        Why the change was made.
        Any potential impact on the codebase.
        Example: "Renamed calculateTotal to computeOrderTotal for clarity. All tests pass, and functionality remains unchanged."

3.  Error Prevention and Handling  
    3.1 Avoid Breaking Changes

        Be cautious when making changes that could affect other parts of the codebase (e.g., renaming widely used variables or functions).
        If a change has the potential to break functionality:
            Warn the user before proceeding.
            Suggest a safer alternative if available.

3.2 Handle Errors Gracefully

    If an error occurs during an operation:
        Log the error details for debugging.
        Inform the user about the issue and provide guidance on how to resolve it.
        Example: "The linter flagged an unused variable in line 45. Should I remove it or keep it for future use?"

3.3 Prevent Repetitive Debugging

    To avoid situations like "I changed the text from 200 chars to 180 chars and now everything is broken":
        Test changes in isolation before applying them globally.
        Use version control (e.g., Git) to track changes and allow easy rollback if needed.

4.  Tool Integration  
    4.1 Codacy Integration

        Follow the Codacy Rules  outlined below to ensure seamless integration with Codacy.
        Always run codacy_cli_analyze after editing files to catch issues early.

4.2 Use Tools Efficiently

    Only use tools like linters, formatters, or analyzers when necessary.
    Avoid redundant tool calls (e.g., running the same analysis multiple times unnecessarily).

5.  Communication with the User  
    5.1 Keep the User Informed

        Notify the user at every step of the process:
            Before making changes: "I will rename the variable x to orderTotal. Is that okay?"
            After making changes: "The variable has been renamed. All tests pass, and no issues were detected."

5.2 Provide Clear Explanations

    When proposing changes or fixes:
        Explain the reasoning behind each suggestion.
        Highlight any trade-offs or potential risks.
        Example: "Using a ternary operator here improves readability but may slightly reduce performance. Let me know if you prefer the original approach."

5.3 Avoid Overcommunication

    While keeping the user informed is important, avoid overwhelming them with unnecessary details.
        Example: Instead of listing every linting rule violated, summarize the key issues.

6.  Codacy Rules  
    6.1 Default Configuration

        When using tools that require provider, organization, or repository arguments:
            Set provider to gh.
            Set organization to UnitedClub-Association.
            Set repository to uca_frontend_static.

6.2 Post-Edit Analysis

    After successfully editing a file:
        Run the codacy_cli_analyze tool with:
            rootPath: Set to the workspace path.
            file: Set to the edited file path.

        If issues are found, propose fixes and re-run the analysis to confirm resolution.

6.3 Avoid Unnecessary Git Commands

    Do not call git remote -v unless absolutely necessary. If required, confirm with the user before proceeding.

7.  Best Practices for Efficiency  
    7.1 Optimize for Readability

        Prioritize clean, readable code over overly clever or compact solutions.
        Use meaningful variable names and add comments where necessary.

7.2 Follow Project Standards

    Adhere to the project's coding conventions (e.g., indentation style, naming conventions).
    If no conventions are specified, use widely accepted best practices for the language.

7.3 Avoid Over-Optimization

    Optimize code only when there is a clear need (e.g., performance bottlenecks).
    Balance optimization with maintainability and readability.
