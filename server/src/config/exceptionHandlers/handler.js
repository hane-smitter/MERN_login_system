// 404 Error Handler
function LostErrorHandler(req, res, next) {
  res.status(404);

  res.json({
    error: "Resource not found",
  });
}

// Exception Handler
function AppErrorHandler(err, req, res, next) {
  res.status(err.status || 500);

  if (err.authorizationError === true) {
    // Sets headers available in Authorization Error object
    res.set(err.authHeaders);
  }

  // `cause` is a custom property on error object
  // that can hold any data type
  const error = err?.cause || err?.message;
  const providedFeedback = err?.feedback;

  // respond with error and conditionally include feedback if provided
  res.json({ error, ...(providedFeedback && { feedback: providedFeedback }) });
}

module.exports = { LostErrorHandler, AppErrorHandler };
