# System Design Analysis Prompt

## Objective
Design scalable, maintainable system architectures that meet business requirements and technical constraints.

## Prompt Template

```
You are a senior systems architect designing a comprehensive solution. Analyze requirements and propose a robust, scalable architecture.

**Project requirements:**
- Business objective: [PRIMARY_BUSINESS_GOAL]
- Functional requirements: [KEY_FEATURES_AND_CAPABILITIES]
- Non-functional requirements: [PERFORMANCE/SECURITY/AVAILABILITY_REQUIREMENTS]
- User base: [EXPECTED_USERS_AND_USAGE_PATTERNS]

**Technical constraints:**
- Technology preferences: [PREFERRED_LANGUAGES/FRAMEWORKS]
- Infrastructure: [CLOUD/ON_PREMISE/HYBRID]
- Budget constraints: [DEVELOPMENT_AND_OPERATIONAL_COSTS]
- Timeline: [DEVELOPMENT_TIMELINE_AND_MILESTONES]
- Team expertise: [TEAM_SKILLS_AND_EXPERIENCE_LEVEL]

**Scalability requirements:**
- Initial load: [EXPECTED_INITIAL_USAGE]
- Growth projections: [SCALING_EXPECTATIONS_OVER_TIME]
- Geographic distribution: [GLOBAL/REGIONAL/LOCAL_DEPLOYMENT]
- Peak load handling: [TRAFFIC_SPIKES_AND_SEASONAL_PATTERNS]

**Design analysis framework:**

1. **Requirements analysis**
   - Functional requirement prioritization
   - Non-functional requirement trade-offs
   - Constraint impact assessment
   - Success criteria definition

2. **Architecture options evaluation**
   - Monolithic vs microservices analysis
   - Technology stack recommendations
   - Database architecture decisions
   - Infrastructure and deployment strategy

3. **Detailed system design**
   - Component breakdown and responsibilities
   - Service interfaces and communication patterns
   - Data flow and storage design
   - Security and compliance considerations

4. **Implementation roadmap**
   - Phase-by-phase development plan
   - Risk mitigation strategies
   - Testing and validation approach
   - Monitoring and observability setup

**Deliverables required:**
1. **Architecture overview diagram** with component relationships
2. **Technology stack justification** with alternatives considered
3. **Data architecture design** with storage and flow patterns
4. **Scalability strategy** with specific scaling mechanisms
5. **Security architecture** with threat model and mitigations
6. **Implementation plan** with phases, risks, and timelines
7. **Operational considerations** for deployment and maintenance

**Evaluation criteria:**
- Meets all functional and non-functional requirements
- Scalable to projected growth levels
- Maintainable and extensible architecture
- Cost-effective within budget constraints
- Feasible with available team expertise
- Follows industry best practices and standards
```

## Architecture Patterns

### Scalability Patterns
- **Horizontal scaling**: Load balancing and service distribution
- **Vertical scaling**: Resource optimization and caching
- **Data partitioning**: Sharding and federation strategies
- **Caching layers**: Multi-level caching architecture

### Reliability Patterns
- **Circuit breaker**: Failure isolation and recovery
- **Bulkhead**: Resource isolation and fault tolerance
- **Retry and timeout**: Resilient communication patterns
- **Graceful degradation**: Partial functionality maintenance

### Security Patterns
- **Defense in depth**: Multi-layer security approach
- **Zero trust**: Verify-never-trust security model
- **Principle of least privilege**: Minimal access rights
- **Secure by default**: Built-in security considerations

## Design Considerations

### Performance
- Response time requirements
- Throughput expectations
- Resource utilization optimization
- Bottleneck identification and mitigation

### Maintainability
- Code organization and modularity
- Documentation and knowledge transfer
- Development workflow optimization
- Technical debt management

### Operability
- Monitoring and alerting strategy
- Deployment and rollback procedures
- Backup and disaster recovery
- Capacity planning and cost optimization