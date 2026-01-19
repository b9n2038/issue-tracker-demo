# AGENTS.md - Development Guidelines for Issue Tracker

This document provides coding standards, build commands, and development practices for agentic coding assistants working on this React/TypeScript issue tracker project.

## Build Commands

- **Development server**: `pnpm run dev` or `vite --force`
- **Build production**: `pnpm run build` or `tsc && vite build`
- **Preview build**: `pnpm run preview` or `vite preview`
- **Type checking**: `tsc` (runs automatically in build)
- **Package manager**: Use `pnpm` (not npm/yarn)

## Dependency Management

**Philosophy**: Keep dependencies minimal and focused. Only add new dependencies when absolutely necessary.

- **Evaluate alternatives**: Before adding a new dependency, consider:
  - Can this be implemented with existing dependencies?
  - Can this be implemented with native browser APIs?
  - Is there a smaller, focused library that does just what we need?
- **Bundle size awareness**: Consider the impact on bundle size and load times
- **Maintenance burden**: Each dependency adds maintenance and security monitoring overhead
- **Peer dependencies**: Prefer libraries that work well with our existing stack (React, Tinybase, Tailwind, Radix UI)
- **Avoid bloat**: No utility libraries for trivial operations, no fancy dev tooling that increases complexity

## Testing

Testing philosophy: write the absolute minimum number of tests that give maximum confidence.

- Prefer property-based testing over example-based unit tests
- Use table-driven tests with `t.Run` for multiple test cases (Go-style pattern)
- Test struct fields: `name`, input params, `expected` output
- Follow naming pattern: `TestFunctionName`
- Focus on integration tests over extensive unit test coverage
- Test critical paths: data persistence, state mutations, user interactions

**Note**: No test framework currently configured. Consider adding Vitest for component/integration testing.

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode**: Always enabled - no implicit `any`, strict null checks
- **Unused variables**: Compiler flags unused locals/parameters as errors
- **Path aliases**:
  - `@/` → `./src/`
  - `@components` → `./src/components`
- **Generated types**: Never modify `src/generated/` files - they're auto-generated from TypeSpec

### Import Organization

```typescript
// External libraries first (alphabetical)
import {useCallback, useState} from 'react';
import {useStore} from 'tinybase/ui-react';

// Local imports (relative paths, then aliases)
import {IssueState} from '../generated/IssueTracker';
import {cn} from '@/lib/utils';
import StatusContextMenu from './StatusContextMenu';
```

### Naming Conventions

- **Components**: PascalCase (`IssueForm`, `StatusSelector`)
- **Functions/Variables**: camelCase (`handleSubmit`, `issueStore`)
- **Enums**: PascalCase (`IssueState`, `Priority`)
- **Interfaces**: PascalCase with `Props` suffix (`IssueFormProps`)
- **Files**: PascalCase for components (`StatusSelector.tsx`), camelCase for utilities (`utils.ts`)

### React Patterns

- **Functional components only** - no class components
- **Hooks**: Prefer custom hooks for reusable logic
- **Event handlers**: Use `useCallback` for performance-critical handlers
- **Refs**: Use `useRef` for DOM manipulation
- **State**: Keep state local when possible, use Tinybase for shared state

```typescript
// Good: useCallback for event handlers
const handleTitleChange = useCallback(
  ({target: {value}}) => setTitle(value),
  [],
);
```

### Styling

- **Tailwind CSS**: Primary styling system
- **Component variants**: Use `class-variance-authority` for reusable component styles
- **CSS classes**: Follow BEM-like naming when needed
- **Responsive**: Mobile-first approach with Tailwind breakpoints

```typescript
// Component with variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: { default: "bg-primary text-primary-foreground" },
      size: { default: "h-9 px-4 py-2" },
    },
  }
);
```

### Error Handling

Use EffectTS-style Result pattern with optional value or Error (typed errors):

```typescript
// Define result types
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// Usage example
function createIssue(input: CreateIssueInput): Result<Issue, ValidationError> {
  if (!input.title) {
    return { success: false, error: { code: 'MISSING_TITLE', message: 'Title is required' } };
  }

  try {
    const issue = issueStore.setRow('issue', generateId(), {
      ...input,
      createdAt: new Date().toISOString(),
    });
    return { success: true, data: issue };
  } catch (error) {
    return { success: false, error: { code: 'STORE_ERROR', message: error.message } };
  }
}

// Consumer pattern
const result = createIssue(formData);
if (result.success) {
  // Handle success
  updateUI(result.data);
} else {
  // Handle typed error
  showError(result.error.code, result.error.message);
}
```

### File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components (buttons, inputs, etc.)
│   └── feature/      # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and shared logic
├── generated/        # Auto-generated types (DO NOT EDIT)
├── App.tsx           # Root component
└── index.tsx         # Entry point
```

## Tinybase Patterns

Tinybase is used for client-side data management with schema validation.

### Store Setup

```typescript
// Create store with schema in App component
const store = useCreateStore(() =>
  createStore().setTablesSchema({
    project: {
      id: {type: 'string'},
      name: {type: 'string'},
      description: {type: 'string'},
    },
    issue: {
      id: {type: 'string'},
      title: {type: 'string'},
      state: {type: 'string'}, // Use IssueState enum values
      priority: {type: 'number'},
      projectId: {type: 'string'},
      createdAt: {type: 'string'},
    },
  })
);
```

### Data Operations

- **Reading**: Use `useValue`, `useRow`, `useTable` hooks
- **Writing**: Use `useAddRowCallback`, `useSetRowCallback` for mutations
- **Listeners**: Add row/table listeners for reactive updates
- **Validation**: Schema types enforce data structure

```typescript
// Reading data
const issues = useTable('issue');
const issueCount = useValue('count', 'issue');

// Writing data with callbacks
const addIssue = useAddRowCallback(
  'issue',
  (input) => ({ ...input, createdAt: new Date().toISOString() }),
  [],
  undefined,
  (rowId) => console.log(`Issue ${rowId} created`)
);
```

### State Management Principles

- Keep business logic in custom hooks
- Use generated types for type safety
- Prefer immutable updates
- Handle errors gracefully with Result pattern
- Test state mutations thoroughly

## TypeSpec Organization

**Recommendation**: Keep TypeSpec files in a separate repository/project.

Benefits:
- **Modularity**: API types can evolve independently
- **Reusability**: Types can be shared across multiple clients
- **Versioning**: Type changes can be versioned separately
- **Tooling**: TypeSpec has its own build/dev cycle

If you decide to integrate them, place in `typespec/` directory with appropriate build scripts.

## Development Workflow

1. **Start development**: `pnpm run dev`
2. **Type check**: `tsc` (runs in build)
3. **Test changes**: Run relevant tests (when implemented)
4. **Build check**: `pnpm run build` before committing
5. **Code review**: Ensure new code follows these patterns

## Tooling Notes

- **Formatter**: Prettier (single quotes, no bracket spacing, trailing commas)
- **Build tool**: Vite with React plugin
- **CSS**: Tailwind CSS v4 with custom utilities
- **State**: Tinybase with schema validation
- **UI**: Radix UI primitives with custom variants</content>
<parameter name="filePath">AGENTS.md