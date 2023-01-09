# Contributing guidelines

Welcome and thank you for showing interest in contributing to Lume!

As a new project, we are hoping to create an active community of developers that submits issues, creates pull requests and provides invaluable feedback.

To help you get ready to do meaningful contributions to this repository, please read along these guidelines, as they cover some important aspects of this project.

## Important links

- [Code of conduct](https://github.com/Adyen/lume/blob/main/CODE_OF_CONDUCT.md)
- Design principles
- [Design guidelines](https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A2)
- [gitmoji](https://gitmoji.dev/)

## Development

Any contribution must start by creating an issue — this is important for tracking. Code contributions should be made via pull requests. These must be reviewed and need at least two approvals from project owners to be merged.

## Issues

Issues should be used to report problems, provide suggestions or request new features. They can also be used for discussing potential changes before an MR is created.

Before creating a new issue, please thoroughly check the existing issues (both open and closed) to avoid duplication. If you do find an issue that addresses the problem you're having, please add your own reproduction information and/or add an emoji reaction to enhance visibility of said issue.

When creating an issue, a template will be loaded to guide you through collecting and providing the information we need to investigate. If it is a problem report, please provide a minimal and concise way to reproduce it.

### Pull requests

Pull requests should:

- Add unit or integration tests for fixed or changed functionality (if a test suite already exists).
- Include documentation.
- Be accompanied by a complete Pull Request template (loaded automatically when an MR is created).
- Have a version bump and according changelog entry, following the [Semver](https://semver.org/) conventions.

Before creating a Pull request, please check whether your commits comply with the conventions used in this repository.

### Commits

All commits to this project should respect the following rules:

- **Follow the single responsibility principle** - this means a commit should aim to do one thing only.
- **Commit messages must use [gitmoji](https://gitmoji.dev/)** - it helps to scope the commit purpose and also provides a visual filter in a commit list.
- **Commit subject must be concise and imperative** - it shouldn't exceed 60 characters; use _fix_, not _fixes_ or _fixed_.
- **Use the commit body to provide extra information** - when the subject isn't sufficiently explanatory. If present, it should explain _what_ and _why_, but not _how_ (that belongs in documentation/implementation).
- **Commit body must include a reference to all issues related** - it should also classify how it relates to the issues (e.g. _resolves #123_).
- **Any line of the commit message shouldn't exceed 100 characters** - this makes the message easier to read on GitHub as well as in various git tools.

## License

By contributing your code to the Lume GitHub repository, you agree to license your contribution under the MIT license.
