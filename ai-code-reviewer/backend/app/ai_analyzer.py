import re
from typing import Dict, List, Any
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Load pre-trained model for code analysis
tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
model = AutoModelForSequenceClassification.from_pretrained("microsoft/codebert-base")

def analyze_code(code: str, language: str) -> Dict[str, Any]:
    """
    Analyze code using AI models and return issues, suggestions, and quality score.
    """
    # Tokenize and get model predictions
    inputs = tokenizer(code, return_tensors="pt", truncation=True, max_length=512)
    
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    # Convert predictions to quality score (0-100)
    quality_score = int(predictions[0][1].item() * 100)
    
    # Detect common issues based on language
    issues = detect_issues(code, language)
    
    # Generate suggestions
    suggestions = generate_suggestions(code, language, issues)
    
    return {
        "score": quality_score,
        "issues": issues,
        "suggestions": suggestions
    }

def detect_issues(code: str, language: str) -> List[Dict[str, Any]]:
    """
    Detect common code issues based on language patterns.
    """
    issues = []
    
    # Common issues across languages
    if re.search(r'\b(pass|TODO|FIXME|XXX)\b', code):
        issues.append({
            "type": "code_smell",
            "message": "Contains placeholder code (pass, TODO, FIXME)",
            "severity": "medium"
        })
    
    # Language-specific issues
    if language.lower() == "python":
        # Check for Python-specific issues
        if re.search(r'^\s*except\s*:', code, re.MULTILINE):
            issues.append({
                "type": "anti_pattern",
                "message": "Bare except clause detected",
                "severity": "high"
            })
        
        if re.search(r'^\s*print\s*\(', code, re.MULTILINE):
            issues.append({
                "type": "code_smell",
                "message": "Debug print statements found",
                "severity": "low"
            })
            
    elif language.lower() == "javascript":
        # Check for JavaScript-specific issues
        if re.search(r'==\s*[^=]', code):
            issues.append({
                "type": "anti_pattern",
                "message": "Use of loose equality (==) instead of strict equality (===)",
                "severity": "medium"
            })
        
        if re.search(r'var\s+', code):
            issues.append({
                "type": "code_smell",
                "message": "Use of 'var' instead of 'let' or 'const'",
                "severity": "low"
            })
    
    # Check for potential security issues
    if re.search(r'password\s*=\s*["\'][^"\']+["\']', code, re.IGNORECASE):
        issues.append({
            "type": "security",
            "message": "Hardcoded password detected",
            "severity": "critical"
        })
    
    return issues

def generate_suggestions(code: str, language: str, issues: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generate improvement suggestions based on detected issues.
    """
    suggestions = []
    
    # Generate suggestions based on issues
    for issue in issues:
        if issue["type"] == "anti_pattern" and "bare except" in issue["message"].lower():
            suggestions.append({
                "message": "Specify exception type in except clause",
                "example": "except ValueError as e:",
                "priority": "high"
            })
        
        if issue["type"] == "security" and "password" in issue["message"].lower():
            suggestions.append({
                "message": "Use environment variables or configuration files for sensitive data",
                "example": "password = os.environ.get('APP_PASSWORD')",
                "priority": "critical"
            })
    
    # General code quality suggestions
    if len(code.split('\n')) > 100 and not re.search(r'^\s*def\s+\w+\s*\([^)]*\)\s*:', code, re.MULTILINE):
        suggestions.append({
            "message": "Consider breaking down large code blocks into functions",
            "example": "def process_data(data):\n    # Your code here",
            "priority": "medium"
        })
    
    # Add docstring suggestion for Python
    if language.lower() == "python" and re.search(r'^\s*def\s+\w+\s*\([^)]*\)\s*:', code, re.MULTILINE):
        if not re.search(r'^\s*"""', code, re.MULTILINE):
            suggestions.append({
                "message": "Add docstrings to functions",
                "example": "def function_name(param):\n    \"\"\"Function description.\n    \n    Args:\n        param: Description\n        \n    Returns:\n        Description\n    \"\"\"\n    pass",
                "priority": "low"
            })
    
    return suggestions