# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by emailing the maintainers. Please do NOT create a public GitHub issue for security vulnerabilities.

## Security Best Practices Implemented

### Environment Variables
- ✅ `.env` files are excluded from version control via `.gitignore`
- ✅ `.env.example` template provided for required environment variables
- ✅ Environment variables validated at application startup
- ✅ No secrets or credentials hardcoded in source code

### Code Security
- ✅ TypeScript strict mode enabled for type safety
- ✅ No use of `eval()` or similar dangerous functions
- ✅ No use of `innerHTML` or `dangerouslySetInnerHTML`
- ✅ Input validation implemented where necessary
- ✅ Centralized error handling with ErrorBoundary

### Logging & Monitoring
- ✅ Centralized logging service (Logger) replaces direct console usage
- ✅ Log levels configurable by environment
- ✅ Sensitive data not logged in production
- ✅ Production logs can be sent to external monitoring services

### Dependencies
- ✅ Dependencies regularly updated
- ✅ No known security vulnerabilities in dependencies
- ✅ Yarn lock file maintained for consistent installs

### PWA Security
- ✅ Service Worker only active in production
- ✅ HTTPS required for Service Worker functionality
- ✅ Content Security Policy can be configured

## Security Checklist for Contributors

Before committing code, ensure:
- [ ] No secrets, API keys, or credentials in code
- [ ] `.env` file not committed
- [ ] Sensitive data not logged
- [ ] User input properly validated and sanitized
- [ ] No use of dangerous functions (`eval`, `innerHTML`, etc.)
- [ ] Dependencies up to date
- [ ] TypeScript types properly defined (no `any` types)

## Environment Variables

Required environment variables:
- `VITE_GRAPHQL_API_URL` - GraphQL API endpoint URL

### Setup Instructions
1. Copy `.env.example` to `.env`
2. Fill in your actual values in `.env`
3. **NEVER** commit `.env` file to version control

## Known Security Measures

### Authentication & Authorization
- Currently using public GraphQL API (https://api.escuelajs.co/graphql)
- No authentication implemented yet
- **Future**: Implement proper authentication when using private APIs

### Data Validation
- TypeScript provides compile-time type checking
- Domain entities (Product) have validation in constructors
- Error boundaries catch runtime errors

### XSS Prevention
- React escapes content by default
- No use of `dangerouslySetInnerHTML`
- No dynamic script injection

### CORS
- Handled by the GraphQL API server
- Apollo Client configured with appropriate headers

## Recommendations for Production

1. **Use HTTPS**: Deploy behind HTTPS to enable Service Worker and PWA features
2. **Set CSP Headers**: Configure Content Security Policy headers
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Error Tracking**: Integrate Sentry or similar service for production error tracking
5. **Monitoring**: Set up application monitoring and alerting
6. **Secret Management**: Use environment-specific secret management (e.g., AWS Secrets Manager, HashiCorp Vault)

## Secure Development Guidelines

### Never Commit Secrets
```bash
# Check for secrets before committing
git diff --cached | grep -i "password\|secret\|key\|token"

# Use .env for local development
cp .env.example .env
# Edit .env with your values (this file is gitignored)
```

### Validate All Inputs
```typescript
// Always validate user input
if (!isValid(userInput)) {
    throw new ValidationError('Invalid input');
}
```

### Use Type Safety
```typescript
// Avoid 'any' types
interface UserData {
    id: number;
    name: string;
}

// Use proper types
function processUser(user: UserData): void {
    // TypeScript ensures type safety
}
```

### Log Securely
```typescript
// Use centralized Logger, not console
import { Logger } from '@/Shared/Infrastructure/Logger';

// Good
Logger.info('User action completed');

// Bad - don't log sensitive data
Logger.info('User password:', password); // ❌ NEVER DO THIS
```

## Security Updates

This document should be updated whenever:
- New security measures are implemented
- Security vulnerabilities are discovered and fixed
- New security best practices are adopted
- Dependencies with security implications are updated

Last updated: February 2026
