# Performance Optimization Analysis Prompt

## Objective
Systematically analyze and optimize code performance while maintaining readability and correctness.

## Prompt Template

```
Act as a performance optimization specialist. Analyze the provided code for performance improvements while considering maintainability and readability trade-offs.

**Code to optimize:**
[INSERT_CODE_BLOCK]

**Performance context:**
- Current performance metrics: [RESPONSE_TIME/THROUGHPUT/RESOURCE_USAGE]
- Performance targets: [DESIRED_IMPROVEMENTS]
- Constraints: [MEMORY/CPU/COMPATIBILITY_LIMITS]
- Usage patterns: [FREQUENCY/DATA_VOLUME/CONCURRENCY]

**Environment details:**
- Language/Framework: [TECH_STACK]
- Hardware specs: [CPU/MEMORY/STORAGE]
- Expected load: [CONCURRENT_USERS/REQUESTS_PER_SECOND]

**Optimization analysis framework:**

1. **Performance profiling**
   - Identify bottlenecks and hot spots
   - Measure current resource usage
   - Analyze algorithm complexity
   - Profile memory allocation patterns

2. **Optimization opportunities**
   - Algorithm improvements (O(n) → O(log n))
   - Data structure optimizations
   - Caching strategies
   - I/O operation improvements
   - Parallel processing potential

3. **Implementation strategy**
   - Quick wins vs long-term improvements
   - Risk assessment for each optimization
   - Backwards compatibility considerations
   - Testing and validation approach

4. **Trade-off analysis**
   - Performance vs readability
   - Memory vs CPU usage
   - Development time vs performance gains
   - Maintenance complexity implications

**Deliverables:**
1. **Performance analysis report**
   - Current bottlenecks with measurements
   - Optimization potential ranking
   - Expected performance improvements

2. **Optimized code versions**
   - Multiple optimization approaches
   - Progressive enhancement options
   - Performance comparison benchmarks

3. **Implementation recommendations**
   - Prioritized optimization roadmap
   - Testing strategy for each change
   - Monitoring and measurement plan

**Optimization categories to consider:**
- **Algorithmic**: Better algorithms and data structures
- **Computational**: Loop optimization, condition ordering
- **Memory**: Object pooling, garbage collection reduction
- **I/O**: Batching, caching, async operations
- **Network**: Request optimization, payload reduction
- **Database**: Query optimization, indexing, connection pooling
```

## Optimization Techniques

### Algorithmic Improvements
- Replace linear search with binary search
- Use hash tables for O(1) lookups
- Implement efficient sorting algorithms
- Apply dynamic programming for overlapping subproblems

### Memory Optimization
- Object reuse and pooling
- Lazy initialization
- Memory-efficient data structures
- Garbage collection optimization

### I/O Optimization
- Asynchronous operations
- Batch processing
- Connection pooling
- File system optimization

### Caching Strategies
- In-memory caching
- Database query caching
- CDN and edge caching
- Application-level caching

## Performance Measurement

### Before Optimization
- Baseline performance metrics
- Resource utilization patterns
- User experience indicators

### After Optimization
- Performance improvement quantification
- Resource usage comparison
- Scalability impact assessment
- Code complexity analysis