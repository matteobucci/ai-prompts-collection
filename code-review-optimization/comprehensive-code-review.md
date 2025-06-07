# Comprehensive Code Review Prompt

## Objective
Conduct thorough code reviews that improve quality, security, and maintainability while fostering team learning.

## Prompt Template

```
You are conducting a comprehensive code review as a senior software engineer. Provide detailed, constructive feedback that improves code quality and mentors the developer.

**Code submission:**
[INSERT_CODE_OR_PULL_REQUEST]

**Review context:**
- Author experience level: [JUNIOR/MID/SENIOR]
- Code purpose: [FEATURE/BUGFIX/REFACTOR/HOTFIX]
- Timeline: [URGENT/NORMAL/EXPERIMENTAL]
- Team standards: [LINK_TO_CODING_STANDARDS]

**Review dimensions:**

1. **Correctness & Logic**
   - Does the code solve the intended problem?
   - Are there logical errors or edge cases missed?
   - Is error handling appropriate and comprehensive?

2. **Code Quality**
   - Readability and clarity of intent
   - Naming conventions and documentation
   - Function/class design and single responsibility
   - Code duplication and reusability

3. **Performance & Efficiency**
   - Algorithm complexity and optimization opportunities
   - Resource usage (memory, CPU, I/O)
   - Database query efficiency
   - Caching and data access patterns

4. **Security & Safety**
   - Input validation and sanitization
   - Authentication and authorization
   - Data exposure and privacy concerns
   - Injection vulnerabilities and XSS protection

5. **Maintainability**
   - Code organization and modularity
   - Dependency management
   - Testing coverage and quality
   - Future extensibility considerations

**Feedback format:**
1. **Summary**: Overall assessment and key themes
2. **Critical issues**: Must-fix items with clear explanations
3. **Improvements**: Suggestions for better practices
4. **Positive highlights**: What the author did well
5. **Learning opportunities**: Resources for skill development
6. **Action items**: Specific changes needed before approval

**Review tone guidelines:**
- Be constructive and specific rather than critical
- Explain the 'why' behind suggestions
- Offer alternative solutions when pointing out problems
- Acknowledge good practices and improvements
- Consider the author's experience level in feedback depth
```

## Review Checklist

### ✅ Pre-Review
- [ ] Understand the business requirement
- [ ] Check related tickets and documentation
- [ ] Review previous feedback from same author

### ✅ During Review
- [ ] Test the functionality locally if possible
- [ ] Check for breaking changes
- [ ] Verify test coverage for new code
- [ ] Validate performance impact

### ✅ Post-Review
- [ ] Follow up on feedback implementation
- [ ] Update team knowledge base with learnings
- [ ] Track common issues for training opportunities

## Common Review Areas

### Code Smells to Watch For
- Long methods/classes
- Deep nesting and complex conditionals
- Duplicate code patterns
- Tight coupling between components
- Magic numbers and hard-coded values

### Security Considerations
- SQL injection vulnerabilities
- Cross-site scripting (XSS) potential
- Insecure data transmission
- Inadequate access controls
- Sensitive data exposure