# 🤝 Contribution Guide

We welcome contributions from the community! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is appreciated.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## How to Contribute

### 1. Find an Issue

The best way to start is by looking at our open issues. Look for issues tagged `good first issue` or `help wanted`.

### 2. Fork & Clone

Fork the repository to your own GitHub account and then clone it to your local machine.

```bash
git clone https://github.com/YOUR_USERNAME/ChompChew2.0.git
cd ChompChew2.0
```

### 3. Create a Branch

Create a new branch for your feature or bug fix. Use a descriptive name.

```bash
# For a new feature
git checkout -b feature/name-of-your-feature

# For a bug fix
git checkout -b fix/description-of-your-fix
```

### 4. Make Your Changes

Make your changes to the codebase. Ensure you follow the existing code style and conventions.

### 5. Run Tests

Before submitting your changes, make sure all tests pass. This is crucial to maintain the quality of the application.

```bash
# Run all unit and integration tests
npm test

# If you added E2E tests, run them as well
npm run test:e2e
```

Please refer to our **[Testing Strategy](./4_testing_strategy.md)** for details on how to write new tests for your feature.

### 6. Commit Your Changes

Commit your changes with a clear and descriptive commit message, following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

-   `feat:` for a new feature.
-   `fix:` for a bug fix.
-   `docs:` for documentation changes.
-   `test:` for adding or improving tests.
-   `refactor:` for code changes that neither fix a bug nor add a feature.
-   `chore:` for build process or auxiliary tool changes.

**Example:**
```bash
git commit -m "feat: add ability to save recipes to favorites"
```

### 7. Push and Create a Pull Request

Push your branch to your fork and then open a pull request against the `main` branch of the original repository.

```bash
git push origin feature/name-of-your-feature
```

In your pull request description, please explain the changes you made and link to any relevant issues.

Thank you for your contribution! 