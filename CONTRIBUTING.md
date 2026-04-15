# Contributing to f1-telemetry-js

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/revanthreddy0906/f1-telemetry-js.git
cd f1-telemetry-js
npm install
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start tsup in watch mode |
| `npm run build` | Build the package |
| `npm run lint` | Type-check with TypeScript |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run storybook` | Start Storybook dev server |
| `npm run benchmark` | Run performance benchmarks |

## Making Changes

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run lint + tests: `npm run lint && npm run test:run`
4. Create a changeset: `npx changeset`
5. Commit and push
6. Open a pull request

## Changesets

We use [changesets](https://github.com/changesets/changesets) for version management.
Every PR that changes the public API or behavior must include a changeset:

```bash
npx changeset
```

Pick the appropriate semver bump:
- **patch**: bug fixes, documentation
- **minor**: new features, non-breaking additions
- **major**: breaking changes

## Code Style

- TypeScript strict mode
- No `any` types in public API
- JSDoc comments on exported functions
- Tests for all new functionality

## Reporting Issues

Use [GitHub Issues](https://github.com/revanthreddy0906/f1-telemetry-js/issues) to report bugs or request features.
