import React, { useState, useEffect } from 'react';
import { codeAnalysisService } from '../services/codeAnalysisService';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await codeAnalysisService.getAnalysisHistory();
        setAnalyses(response.data);
      } catch (err) {
        setError('Failed to load analysis history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchHistory();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
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

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="history">
      <h2>Analysis History</h2>
      <p>View your previous code analysis results.</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {analyses.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <p>No analysis history found. Analyze some code to get started!</p>
            <a href="/analyze" className="btn btn-primary">Analyze Code</a>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Language</th>
                <th>Code Snippet</th>
                <th>Issues</th>
                <th>Suggestions</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((analysis) => (
                <tr key={analysis.id}>
                  <td>{formatDate(analysis.timestamp)}</td>
                  <td>
                    <span className="badge bg-secondary">{analysis.language}</span>
                  </td>
                  <td>
                    <code>{analysis.code_snippet}</code>
                  </td>
                  <td>
                    <span className={`badge bg-${analysis.issues_found > 0 ? 'danger' : 'success'}`}>
                      {analysis.issues_found}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${analysis.suggestions_count > 0 ? 'info' : 'secondary'}`}>
                      {analysis.suggestions_count}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${getScoreColor(analysis.score)}`}>
                      {analysis.score}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;