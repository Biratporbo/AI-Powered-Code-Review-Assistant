# AI-Powered Code Review Assistant

A web application that uses AI to analyze code quality, detect issues, and provide improvement suggestions.

## Features

- **Code Quality Analysis**: Detect code smells, anti-patterns, and maintainability issues
- **Security Vulnerability Detection**: Identify potential security vulnerabilities
- **Improvement Suggestions**: Get actionable suggestions to improve your code
- **Multi-Language Support**: Python, JavaScript, Java, C#, C++, Go, Rust
- **User Authentication**: Secure JWT-based authentication
- **Analysis History**: Track and review your previous analyses

## Tech Stack

### Backend
- Python with FastAPI
- SQLAlchemy for database operations
- JWT for authentication
- Transformers for AI code analysis
- SQLite database (easily upgradeable)

### Frontend
- React with React Router
- Bootstrap for UI components
- Axios for API requests
- Context API for state management

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development without Docker)

### Using Docker (Recommended)

1. Clone the repository
   ```bash
   git clone https://github.com/Biratporbo/ai-code-reviewer.git
   cd ai-code-reviewer