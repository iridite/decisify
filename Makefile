.PHONY: help install test test-cov lint format type-check security clean run dev

help:  ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install:  ## Install dependencies
	uv sync --all-extras

test:  ## Run all tests
	uv run pytest tests/ --ignore=tests/test_api.py -v

test-cov:  ## Run tests with coverage report
	uv run pytest tests/ --ignore=tests/test_api.py --cov=src --cov-report=term-missing --cov-report=html

test-watch:  ## Run tests in watch mode
	uv run pytest-watch tests/ --ignore=tests/test_api.py

lint:  ## Run linter (ruff)
	uv run ruff check .

format:  ## Format code with ruff
	uv run ruff format .
	uv run ruff check --fix .

type-check:  ## Run type checker (mypy)
	uv run mypy src/

security:  ## Run security checks (bandit)
	uv run bandit -r src/ -c pyproject.toml

quality:  ## Run all quality checks (lint + type + security)
	@echo "Running linter..."
	@$(MAKE) lint
	@echo "\nRunning type checker..."
	@$(MAKE) type-check
	@echo "\nRunning security checks..."
	@$(MAKE) security

pre-commit-install:  ## Install pre-commit hooks
	uv run pre-commit install

pre-commit:  ## Run pre-commit on all files
	uv run pre-commit run --all-files

clean:  ## Clean up cache and temporary files
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name ".coverage" -delete 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true

run:  ## Run the application
	uv run python main.py

dev:  ## Run in development mode with auto-reload
	uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

benchmark:  ## Run performance benchmarks
	@echo "Running single decision benchmark..."
	@uv run python benchmarks/benchmark.py
	@echo "\nRunning realistic benchmark..."
	@uv run python benchmarks/benchmark_realistic.py
	@echo "\nRunning batch benchmark..."
	@uv run python benchmarks/benchmark_batch.py

validate:  ## Run validation tests
	uv run python src/validate.py

all:  ## Run format, quality checks, and tests
	@$(MAKE) format
	@$(MAKE) quality
	@$(MAKE) test-cov
