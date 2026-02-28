# Contributing to Decisify

Thank you for your interest in contributing to Decisify! We welcome contributions from the community and are grateful for your support.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together towards common goals
- **Be inclusive**: Welcome diverse perspectives and backgrounds

## 🤝 How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue on our [GitHub Issues](https://github.com/iridite/decisify/issues) page with:

- **Clear title**: Describe the bug concisely
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, Python version, Rust version (if applicable)
- **Screenshots**: If applicable, add screenshots to help explain

### Suggesting Features

We love new ideas! To suggest a feature:

1. Check [existing issues](https://github.com/iridite/decisify/issues) to avoid duplicates
2. Create a new issue with the `enhancement` label
3. Describe the feature and its benefits
4. Explain how it aligns with Decisify's goals

### Improving Documentation

Documentation improvements are always welcome:

- Fix typos or clarify existing docs
- Add examples or tutorials
- Improve README or inline code comments
- Translate documentation to other languages

## 🛠️ Development Setup

### Prerequisites

- Python 3.10 or higher
- Node.js 18+ (for frontend)
- Rust 1.75+ (optional, for performance extensions)
- Git

### Setup Steps

1. **Fork the repository**

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/decisify.git
cd decisify
```

2. **Install dependencies**

```bash
# Backend dependencies
uv pip install -e ".[dev]"

# Frontend dependencies
cd dashboard
npm install
cd ..
```

3. **Optional: Build Rust extension**

```bash
cd rust
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release
cd ..
```

4. **Run tests**

```bash
# Run all tests
pytest tests/ --ignore=tests/test_api.py -v

# Run with coverage
pytest tests/ --ignore=tests/test_api.py --cov=src --cov-report=term-missing
```

5. **Start development servers**

```bash
# Terminal 1: Backend
uv run python main.py

# Terminal 2: Frontend
cd dashboard && npm run dev
```

## 🔄 Pull Request Process

1. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Write clean, readable code
- Follow our code style guidelines
- Add tests for new functionality
- Update documentation as needed

3. **Run quality checks**

```bash
# Type checking
mypy .

# Linting
ruff check .

# Formatting
ruff format .

# Tests
pytest tests/ --ignore=tests/test_api.py -v
```

4. **Commit your changes**

```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

5. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill in the PR template with:
  - Description of changes
  - Related issue numbers
  - Testing performed
  - Screenshots (if applicable)

7. **Address review feedback**

- Respond to reviewer comments
- Make requested changes
- Push updates to your branch

## 🎨 Code Style Guidelines

### Python

- Follow [PEP 8](https://pep8.org/) style guide
- Use type hints for all function signatures
- Maximum line length: 100 characters
- Use `ruff` for linting and formatting
- Use `mypy` for static type checking

**Example:**

```python
from typing import Optional

def calculate_attention_weights(
    scores: list[float],
    temperature: float = 1.0,
) -> list[float]:
    """Calculate softmax attention weights.

    Args:
        scores: Raw attention scores
        temperature: Temperature parameter for softmax

    Returns:
        Normalized attention weights
    """
    # Implementation here
    pass
```

### TypeScript/React

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for type safety
- Use functional components with hooks
- Use Tailwind CSS for styling

**Example:**

```typescript
interface SignalProps {
  value: number;
  source: string;
  timestamp: Date;
}

export const SignalCard: React.FC<SignalProps> = ({ value, source, timestamp }) => {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{source}</h3>
      <p className="text-2xl">{value.toFixed(3)}</p>
    </div>
  );
};
```

### Rust

- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Add documentation comments for public APIs

## 🧪 Testing Requirements

### Unit Tests

- Write unit tests for all new functions
- Aim for >80% code coverage
- Use `pytest` for Python tests
- Use descriptive test names

**Example:**

```python
def test_attention_fusion_with_valid_signals():
    """Test attention fusion with valid signal inputs."""
    engine = AttentionFusionEngine(temperature=1.0)
    signals = [
        Signal(source="twitter", score=0.8, value=0.7),
        Signal(source="news", score=0.6, value=0.5),
    ]
    result = engine.fuse(signals)
    assert result.action in ["BUY", "SELL", "HOLD"]
    assert 0 <= result.confidence <= 1
```

### Integration Tests

- Test component interactions
- Test API endpoints
- Test frontend-backend integration

### Performance Tests

- Benchmark critical paths
- Ensure no performance regressions
- Document performance characteristics

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Bug description**: Clear and concise description
2. **Steps to reproduce**: Numbered steps to reproduce the issue
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**:
   - OS: (e.g., Ubuntu 22.04, macOS 14.0)
   - Python version: (e.g., 3.10.12)
   - Rust version: (e.g., 1.75.0, if applicable)
   - Node.js version: (e.g., 18.17.0)
6. **Logs**: Relevant error messages or logs
7. **Screenshots**: If applicable

## 💡 Suggesting Features

When suggesting features, please include:

1. **Feature description**: Clear description of the feature
2. **Use case**: Why is this feature needed?
3. **Proposed solution**: How should it work?
4. **Alternatives**: Other approaches you've considered
5. **Additional context**: Any other relevant information

## 📞 Getting Help

If you need help:

- Check the [documentation](docs/)
- Search [existing issues](https://github.com/iridite/decisify/issues)
- Ask in [GitHub Discussions](https://github.com/iridite/decisify/discussions)
- Read the [README](README.md)

## 🙏 Thank You!

Thank you for contributing to Decisify! Your efforts help make this project better for everyone.

---

**Questions?** Feel free to reach out by creating an issue or starting a discussion on GitHub.
