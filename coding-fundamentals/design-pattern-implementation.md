# Design Pattern Implementation Prompt

## Objective
Implement appropriate design patterns to solve specific architectural problems while maintaining code clarity.

## Prompt Template

```
You are an expert software architect helping implement design patterns effectively.

**Problem scenario:**
[DESCRIBE_SPECIFIC_PROBLEM]

**Current code structure:**
[INSERT_EXISTING_CODE]

**Requirements:**
- Language: [PROGRAMMING_LANGUAGE]
- Framework: [FRAMEWORK_IF_APPLICABLE]
- Constraints: [PERFORMANCE/MEMORY/TEAM_CONSTRAINTS]

**Analysis needed:**
1. **Pattern identification**: Which design pattern(s) best solve this problem?
2. **Trade-off analysis**: Benefits vs complexity for each option
3. **Implementation strategy**: Step-by-step approach
4. **Alternative solutions**: Other patterns or approaches to consider

**Deliverables:**
1. Recommended pattern with justification
2. Complete implementation with clear interfaces
3. Usage examples showing the pattern in action
4. Migration path from current code
5. Testing strategy for the new structure

**Evaluation criteria:**
- Solves the stated problem effectively
- Maintains or improves code maintainability
- Follows language/framework conventions
- Includes appropriate abstractions without over-engineering
```

## Common Scenarios

### Scenario 1: Object Creation Complexity
When object instantiation becomes complex or needs to be configurable.
**Suggested patterns**: Factory, Builder, Abstract Factory

### Scenario 2: Behavior Variation
When algorithms or behaviors need to be interchangeable.
**Suggested patterns**: Strategy, Command, State

### Scenario 3: Interface Compatibility
When existing interfaces don't match new requirements.
**Suggested patterns**: Adapter, Facade, Decorator

### Scenario 4: Object Communication
When objects need to communicate without tight coupling.
**Suggested patterns**: Observer, Mediator, Publisher-Subscriber

## Anti-Pattern Warnings
- Don't force patterns where simple solutions suffice
- Avoid pattern mixing without clear justification
- Don't implement patterns for future flexibility without current need