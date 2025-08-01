import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { codeAnalysisService } from '../services/codeAnalysisService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      try {
        const response = await codeAnalysisService.getAnalysisHistory(0, 5);
        setRecentAnalyses(response.data);
      } catch (err) {
        console.error('Failed to load recent analyses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchRecentAnalyses();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getScoreColor = (score) => {
    if (score > 80) return 'success';
    if (score > 60) return 'warning';
    return 'danger';
  };

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2>Welcome to AI Code Review Assistant</h2>
              <p className="lead">
                Analyze your code for issues, vulnerabilities, and improvement suggestions using advanced AI.
              </p>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/analyze" className="btn btn-primary btn-lg px-4 me-md-2">
                  Analyze Code
                </Link>
                <Link to="/history" className="btn btn-outline-secondary btn-lg px-4">
                  View History
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h4>Features</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Code Quality Analysis</h5>
                      <p className="card-text">
                        Detect code smells, anti-patterns, and maintainability issues in your code.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Security Vulnerability Detection</h5>
                      <p className="card-text">
                        Identify potential security vulnerabilities and get suggestions to fix them.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Improvement Suggestions</h5>
                      <p className="card-text">
                        Get actionable suggestions to improve your code quality and performance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Recent Analyses</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status"></div>
                </div>
              ) : recentAnalyses.length > 0 ? (
                <div className="list-group">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="fw-bold">{analysis.language}</div>
                          <div className="small text-muted">{formatDate(analysis.timestamp)}</div>
                        </div>
                        <span className={`badge bg-${getScoreColor(analysis.score)}`}>
                          {analysis.score}/100
                        </span>
                      </div>
                      <div className="mt-2">
                        <code className="small">{analysis.code_snippet}</code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted">No recent analyses</p>
              )}
              
              {recentAnalyses.length > 0 && (
                <div className="text-center mt-3">
                  <Link to="/history" className="btn btn-sm btn-outline-primary">
                    View All History
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h4>Supported Languages</h4>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Python</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> JavaScript</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Java</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> C#</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> C++</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Go</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Rust</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;