# Clean Code Review Prompt

## Objective
Transform existing code into clean, maintainable, and readable form following industry best practices.

## Prompt Template

```
Act as a senior software engineer conducting a code review focused on clean code principles. 

**Code to review:**
[INSERT CODE HERE]

**Context:**
- Language: [LANGUAGE]
- Domain: [BUSINESS_DOMAIN]
- Team experience level: [JUNIOR/MID/SENIOR]

**Review criteria:**
1. **Readability**: Variable/function naming, code structure, complexity
2. **Maintainability**: Modularity, coupling, cohesion
3. **Reliability**: Error handling, edge cases, defensive programming
4. **Performance**: Obvious inefficiencies, algorithmic improvements

**Output format:**
1. Overall assessment (1-5 scale with reasoning)
2. Specific issues with line references
3. Refactored code examples for major issues
4. Positive patterns to reinforce
5. Learning recommendations

**Constraints:**
- Preserve original functionality
- Suggest incremental improvements
- Explain the 'why' behind each suggestion
- Consider team's current skill level
```

## Usage Examples

### Example 1: Function Refactoring
Focus on a single function that has multiple responsibilities or unclear naming.

### Example 2: Class Structure Review
Evaluate class design, responsibilities, and interface clarity.

### Example 3: Error Handling Assessment
Review error handling patterns and suggest improvements.

## Success Metrics
- Reduced cyclomatic complexity
- Improved readability scores
- Fewer code smells
- Better test coverage opportunities