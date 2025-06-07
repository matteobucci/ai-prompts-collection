# API Design Specification Prompt

## Objective
Design comprehensive, RESTful APIs that are intuitive, secure, and scalable for long-term use.

## Prompt Template

```
You are an API architect designing a comprehensive API specification. Create a well-structured, developer-friendly API that follows industry best practices.

**API purpose and scope:**
- Primary use case: [MAIN_FUNCTIONALITY_PURPOSE]
- Target consumers: [INTERNAL_TEAMS/THIRD_PARTY_DEVELOPERS/PUBLIC]
- Integration scenarios: [WEB_APPS/MOBILE_APPS/B2B_INTEGRATIONS]
- Expected usage volume: [REQUESTS_PER_SECOND/DAY]

**Business domain:**
- Core entities: [PRIMARY_DATA_MODELS_AND_RELATIONSHIPS]
- Business operations: [KEY_WORKFLOWS_AND_PROCESSES]
- Data relationships: [ENTITY_CONNECTIONS_AND_DEPENDENCIES]
- Compliance requirements: [REGULATORY_OR_INDUSTRY_STANDARDS]

**Technical requirements:**
- Authentication method: [OAUTH/JWT/API_KEYS]
- Data formats: [JSON/XML/GRAPHQL]
- Protocol preferences: [REST/GRAPHQL/GRPC]
- Versioning strategy: [URL/HEADER/CONTENT_NEGOTIATION]

**API design framework:**

1. **Resource identification**
   - Core resources and sub-resources
   - Resource relationships and hierarchies
   - URL structure and naming conventions
   - HTTP method mapping to operations

2. **Interface design**
   - Request/response schemas
   - Error handling and status codes
   - Pagination and filtering strategies
   - Rate limiting and throttling

3. **Security design**
   - Authentication and authorization flows
   - Input validation and sanitization
   - Data privacy and protection measures
   - API key management and rotation

4. **Documentation and tooling**
   - OpenAPI/Swagger specification
   - Interactive documentation
   - SDK and client library considerations
   - Testing and validation tools

**Deliverables:**
1. **Complete OpenAPI specification** with all endpoints documented
2. **Authentication and authorization guide** with flow diagrams
3. **Error handling specification** with standardized error formats
4. **Rate limiting and usage policies** with quotas and restrictions
5. **Versioning and migration strategy** for API evolution
6. **Developer onboarding guide** with quick start examples
7. **Security considerations document** with threat model
8. **Performance guidelines** with optimization recommendations

**Design principles to follow:**
- RESTful design with clear resource modeling
- Consistent naming conventions and URL patterns
- Comprehensive error handling with meaningful messages
- Stateless design with proper HTTP method usage
- Idempotent operations where appropriate
- Clear separation of concerns and responsibilities
```

## API Design Best Practices

### Resource Design
- **Nouns for resources**: Use nouns, not verbs in URLs
- **Hierarchical structure**: Reflect resource relationships in URLs
- **Consistent naming**: Use plural nouns and consistent casing
- **Logical grouping**: Group related operations under resource collections

### HTTP Method Usage
- **GET**: Retrieve resources (idempotent, safe)
- **POST**: Create new resources or complex operations
- **PUT**: Update entire resources (idempotent)
- **PATCH**: Partial resource updates
- **DELETE**: Remove resources (idempotent)

### Response Design
- **Consistent structure**: Standardized response formats
- **Appropriate status codes**: Meaningful HTTP status codes
- **Error details**: Clear error messages with actionable guidance
- **Metadata inclusion**: Pagination, timestamps, versioning info

### Security Considerations
- **Input validation**: Comprehensive request validation
- **Output encoding**: Prevent injection attacks
- **Access control**: Fine-grained permission systems
- **Audit logging**: Track API usage and security events

## Common API Patterns

### Pagination
- Cursor-based pagination for large datasets
- Offset/limit pagination for simpler cases
- Metadata about total count and navigation

### Filtering and Sorting
- Query parameter conventions
- Field selection capabilities
- Complex filtering expressions

### Versioning Strategies
- URL versioning (/v1/resources)
- Header versioning (Accept: application/vnd.api+json;version=1)
- Content negotiation approaches