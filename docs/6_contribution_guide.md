# 🤝 Contribution Guide

We welcome contributions from the community! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is appreciated.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## 🚀 Getting Started

1.  **Fork the repository**: Create your own fork of the ChompChew repository to your GitHub account.
2.  **Clone the fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/your-username/chompchew.git
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Set up environment variables**: Copy the `.env.example` file to a new file named `.env.local` and fill in the required Supabase and OpenAI API keys.

## 📝 Making Changes

1.  **Create a new branch**: Always create a new branch for your changes.
    ```bash
    git checkout -b feature/my-awesome-feature
    ```
2.  **Write code**: Make your changes, following the existing code style.
3.  **Write tests**: If you are adding a new feature or fixing a bug, please add corresponding tests. Our goal is to maintain and increase our >90% test coverage.

## ✅ Submitting a Pull Request

1.  **Push your changes**: Push your branch to your forked repository.
    ```bash
    git push origin feature/my-awesome-feature
    ```
2.  **Open a Pull Request**: Open a pull request from your forked repository to the `main` branch of the original ChompChew repository.
3.  **Pass CI Checks**: Once you open a pull request, our **Continuous Integration (CI) pipeline** will automatically run. It will perform the following checks:
    -   Lint the code for style issues.
    -   Build the project to check for TypeScript errors.
    -   Run the entire test suite.

    **The CI checks must pass before your pull request can be reviewed and merged.** You will see a green checkmark next to your pull request if it passes, or a red X if it fails. You can click the "Details" link to see the logs and fix any issues.

4.  **Code Review**: Once the CI checks pass, a core contributor will review your code. Please be prepared to make changes based on the feedback.

Thank you for helping us make Ch-Ch-ChompChew better! 