# Performance Bottleneck Analysis Prompt

## Objective
Identify and resolve performance bottlenecks through systematic analysis and measurement.

## Prompt Template

```
Act as a performance engineering specialist analyzing system bottlenecks and optimization opportunities.

**Performance issue details:**
- Symptom: [SLOW_RESPONSE/HIGH_CPU/MEMORY_USAGE/etc]
- Affected components: [SPECIFIC_FEATURES_OR_ENDPOINTS]
- Performance metrics: [CURRENT_VS_EXPECTED_PERFORMANCE]
- User impact: [BUSINESS_IMPACT_DESCRIPTION]

**System context:**
- Technology stack: [LANGUAGES_FRAMEWORKS_DATABASES]
- Architecture: [MONOLITH/MICROSERVICES/SERVERLESS]
- Scale: [USERS_REQUESTS_DATA_VOLUME]
- Infrastructure: [CLOUD_ONPREM_HYBRID]

**Available data:**
- Profiling data: [CPU_MEMORY_IO_PROFILES]
- Monitoring metrics: [APM_LOGS_TRACES]
- Database queries: [SLOW_QUERY_LOGS]
- Network analysis: [LATENCY_BANDWIDTH_METRICS]

**Analysis framework:**
1. **Bottleneck identification**: Systematic performance audit across all layers
2. **Impact quantification**: Measure performance impact of each bottleneck
3. **Optimization strategy**: Prioritized approach based on effort vs impact
4. **Implementation plan**: Detailed steps with risk assessment
5. **Validation methodology**: How to measure improvement

**Optimization areas to evaluate:**
- Algorithm complexity and data structures
- Database queries and indexing
- Caching strategies and cache hit rates
- Network requests and payload sizes
- Memory allocation and garbage collection
- I/O operations and disk access patterns
- Concurrency and parallelization opportunities

**Deliverables:**
1. Performance analysis report with bottleneck ranking
2. Specific optimization recommendations with expected gains
3. Implementation roadmap with quick wins vs long-term improvements
4. Testing strategy to validate optimizations
5. Monitoring setup to track performance trends
```

## Common Bottleneck Patterns

### Database Performance
- N+1 query problems
- Missing or inefficient indexes
- Large data set operations
- Connection pool exhaustion

### Application Layer
- Inefficient algorithms
- Memory leaks and excessive allocation
- Blocking I/O operations
- Poor caching strategies

### Infrastructure
- CPU/Memory resource constraints
- Network latency and bandwidth
- Storage I/O limitations
- Load balancing inefficiencies

## Optimization Strategies
- **Quick wins**: Low-effort, high-impact improvements
- **Algorithmic**: Fundamental approach changes
- **Architectural**: System design modifications
- **Infrastructure**: Hardware/deployment optimizations