# Systematic Bug Analysis Prompt

## Objective
Apply structured debugging methodology to identify root causes and implement reliable fixes.

## Prompt Template

```
You are a senior debugging specialist helping solve a complex software issue using systematic analysis.

**Problem description:**
[DESCRIBE_THE_BUG_OR_ISSUE]

**Environment details:**
- Language/Framework: [TECH_STACK]
- Environment: [DEV/STAGING/PRODUCTION]
- Recent changes: [RECENT_DEPLOYMENTS_OR_CHANGES]
- Error frequency: [ALWAYS/INTERMITTENT/SPECIFIC_CONDITIONS]

**Evidence collected:**
- Error messages: [EXACT_ERROR_TEXT]
- Stack traces: [FULL_STACK_TRACE]
- Logs: [RELEVANT_LOG_ENTRIES]
- Reproduction steps: [STEPS_TO_REPRODUCE]

**Investigation framework:**
1. **Hypothesis generation**: List 3-5 potential root causes based on evidence
2. **Hypothesis prioritization**: Rank by likelihood and impact
3. **Investigation plan**: Design experiments to test each hypothesis
4. **Evidence evaluation**: Analyze results systematically
5. **Root cause identification**: Determine actual cause with supporting evidence

**Deliverables required:**
1. Detailed root cause analysis with evidence
2. Recommended fix with rationale
3. Prevention strategies for similar issues
4. Testing plan to verify the fix
5. Monitoring recommendations to detect future occurrences

**Analysis depth:**
- Consider all system layers (UI, business logic, data, infrastructure)
- Evaluate timing, concurrency, and state management issues
- Assess external dependencies and integration points
- Review recent changes and deployment history
```

## Investigation Techniques

### Evidence Collection
- Comprehensive logging analysis
- Performance metrics correlation
- User behavior pattern analysis
- System resource monitoring

### Hypothesis Testing
- Controlled reproduction scenarios
- Environment comparison analysis
- Code path tracing
- Data state examination

### Root Cause Categories
- Logic errors and edge cases
- Concurrency and race conditions
- Resource exhaustion
- Configuration issues
- External dependency failures

## Success Metrics
- Time to identify root cause
- Fix effectiveness (no regression)
- Prevention of similar issues
- Improved system observability