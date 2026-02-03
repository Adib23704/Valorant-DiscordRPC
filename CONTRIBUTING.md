# Contributing to ValoDiscordRPC

Thank you for your interest in contributing to ValoDiscordRPC! This document provides guidelines and information for contributors.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS version, app version)
- Screenshots if applicable
- Relevant logs

### Suggesting Features

Feature suggestions are welcome! Please:

- Check existing issues/discussions first
- Describe the problem your feature would solve
- Explain your proposed solution
- Consider alternatives you've thought about

### Pull Requests

1. **Fork the repository** and create your branch from `master`
2. **Install dependencies**: `pnpm install`
3. **Make your changes** following our coding standards
4. **Test your changes**: `pnpm tauri dev`
5. **Run checks**: `pnpm validate`
6. **Commit your changes** with a clear message
7. **Push to your fork** and open a Pull Request

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 22+ with pnpm
- [Rust](https://rustup.rs/) 1.93+
- [Tauri prerequisites](https://tauri.app/start/prerequisites/)

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/valo-discord-rpc.git
cd valo-discord-rpc

# Install dependencies
pnpm install --frozen-lockfile

# Start development server
pnpm tauri dev
```

### Project Structure

```
├── src/                    # React frontend (TypeScript)
│   ├── components/         # UI components
│   ├── hooks/              # React hooks
│   ├── lib/                # Utilities
│   ├── pages/              # Page components
│   ├── stores/             # Zustand stores
│   └── types/              # TypeScript types
│
└── src-tauri/              # Rust backend
    └── src/
        ├── commands/       # Tauri commands
        ├── config/         # Settings
        ├── content/        # Game content
        ├── discord/        # Discord RPC
        ├── presence/       # Presence manager
        ├── process/        # Process detection
        └── riot/           # Riot API client
```

## Coding Standards

### TypeScript/React

- Use TypeScript strict mode
- Follow existing code style (Biome handles formatting)
- Use functional components with hooks
- Prefer named exports

### Rust

- Follow Rust idioms and best practices
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Handle errors properly (no unwrap in production code)

### Commits

- Use clear, descriptive commit messages
- Reference issues when applicable (e.g., "Fixes #123")
- Keep commits focused on single changes

### Code Quality

Before submitting, ensure:

```bash
# Run all checks
pnpm validate

# This runs:
# - Biome lint & format check
# - Cargo fmt check
# - Cargo clippy
```

## Testing

While we don't have a comprehensive test suite yet, please:

- Test your changes manually
- Verify the app works with Valorant running
- Check Discord presence updates correctly
- Test on Windows 10/11

## Documentation

- Update README.md if adding features
- Add comments for complex logic
- Update CHANGELOG.md for significant changes

## Questions?

Feel free to open a discussion or issue if you have questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
