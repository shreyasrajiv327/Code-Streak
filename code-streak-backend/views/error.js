// backend/views/error.js
exports.unauthorized = (res) => {
    res.status(401).json({ message: 'Unauthorized access. Please login.' });
  };
  
  exports.notFound = (res, resource = 'Resource') => {
    res.status(404).json({ message: `${resource} not found` });
  };
  
  exports.validationError = (res, errors) => {
    res.status(400).json({ message: 'Validation failed', errors });
  };
  
  exports.serverError = (res) => {
    res.status(500).json({ message: 'Internal server error' });
  };