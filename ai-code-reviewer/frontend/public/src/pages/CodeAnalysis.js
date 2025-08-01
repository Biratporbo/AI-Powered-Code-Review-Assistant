import React, { useState } from 'react';
import { codeAnalysisService } from '../services/codeAnalysisService';
import { useAuth } from '../context/AuthContext';

const CodeAnalysis = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await codeAnalysisService.analyzeCode(code, language);
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'primary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="code-analysis">
      <h2>Code Analysis</h2>
      <p>Analyze your code for issues, vulnerabilities, and improvement suggestions.</p>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="language" className="form-label">Language</label>
              <select 
                className="form-select" 
                id="language" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="code" className="form-label">Code</label>
              <textarea 
                className="form-control" 
                id="code" 
                rows="10" 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
              ></textarea>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </form>
        </div>
      </div>
      
      {analysis && (
        <div className="mt-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Analysis Results</h4>
              <span className={`badge bg-${analysis.score > 80 ? 'success' : analysis.score > 60 ? 'warning' : 'danger'}`}>
                Score: {analysis.score}/100
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Issues Found ({analysis.issues.length})</h5>
                  {analysis.issues.length > 0 ? (
                    <ul className="list-group">
                      {analysis.issues.map((issue, index) => (
                        <li key={index} className={`list-group-item list-group-item-${getSeverityColor(issue.severity)}`}>
                          <div className="d-flex justify-content-between">
                            <span>{issue.message}</span>
                            <span className="badge bg-secondary">{issue.type}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No issues found!</p>
                  )}
                </div>
                
                <div className="col-md-6">
                  <h5>Suggestions ({analysis.suggestions.length})</h5>
                  {analysis.suggestions.length > 0 ? (
                    <div className="accordion" id="suggestionsAccordion">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="accordion-item">
                          <h2 className="accordion-header" id={`heading${index}`}>
                            <button 
                              className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} 
                              type="button" 
                              data-bs-toggle="collapse" 
                              data-bs-target={`#collapse${index}`}
                            >
                              <span className={`badge bg-${getPriorityColor(suggestion.priority)} me-2`}>
                                {suggestion.priority}
                              </span>
                              {suggestion.message}
                            </button>
                          </h2>
                          <div 
                            id={`collapse${index}`} 
                            className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#suggestionsAccordion"
                          >
                            <div className="accordion-body">
                              <pre><code>{suggestion.example}</code></pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No suggestions at this time.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeAnalysis;