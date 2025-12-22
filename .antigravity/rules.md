# Project-Specific Rules for Antigravity

## Project Scope

This is a **frontend-only project** for a casino platform built with Next.js.

## Backend Reference

- **Backend Location**: `c:\Users\Lasha\Documents\nest-project\backend`
- **Backend Role**: Reference and information source ONLY
- **Backend Modifications**: NEVER modify backend code
- **Backend Analysis**: Use backend code to understand available endpoints and data structures

## Development Guidelines

### 1. Frontend Focus

- **ONLY work on files in**: `c:\Users\Lasha\Documents\nest-project\casino-front`
- **NEVER modify**: Any files in the `backend` directory
- **Backend Usage**: Read backend code for:
  - Understanding available API endpoints
  - Checking response data structures
  - Verifying authentication requirements
  - Understanding business logic

### 2. Endpoint Implementation

- When analyzing endpoints, focus on:
  - ✅ What endpoints are available in the backend
  - ✅ What endpoints are missing from the frontend API client
  - ✅ How to implement missing frontend API calls
  - ❌ Do NOT suggest creating new backend endpoints
  - ❌ Do NOT analyze what's missing from the backend

### 3. Code Organization

- API calls should be in: `lib/api-client.ts`
- Context providers should be in: `lib/*-context.tsx`
- Components should be in: `components/`
- Pages should be in: `app/`

### 4. Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Client**: Axios
- **Authentication**: JWT tokens (stored in localStorage)

### 5. When Suggesting Changes

- Always implement frontend code to consume existing backend endpoints
- If a backend endpoint exists but frontend doesn't use it, implement the frontend integration
- If a backend endpoint doesn't exist, note it but don't attempt to create it
- Focus on UI/UX improvements and frontend functionality

## Example Workflow

**Good Approach** ✅:

1. Check backend for available endpoint: `/api/v1/wallets/:walletId/default`
2. Notice it's missing from frontend `api-client.ts`
3. Implement the frontend API method
4. Update relevant context/components to use it

**Bad Approach** ❌:

1. Notice bonus endpoints don't exist in backend
2. Suggest creating backend bonus service
3. Suggest creating backend bonus controller
4. Suggest database migrations

## Questions to Ask

When working on this project, always ask yourself:

- "Am I modifying frontend code only?"
- "Am I using the backend as a reference, not modifying it?"
- "Is this endpoint already available in the backend?"
- "How can I improve the frontend to better use existing backend features?"

## Priority Order

1. **Implement missing frontend integrations** for existing backend endpoints
2. **Improve UI/UX** of existing features
3. **Add frontend validation** and error handling
4. **Optimize performance** and user experience
5. **Document** what backend endpoints are available but not yet integrated

---

**Remember**: Backend is READ-ONLY. Frontend is your workspace.
