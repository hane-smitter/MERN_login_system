function LostErrorHandler(req, res, next) {
  res.status(404);

  res.json({
    error: "Resource not found",
  });
}

function AppErrorHandler(err, req, res, next) {
  // console.log(err)
  res.status(err.status || 500);

  if (err.authorizationError === true) {
    res.set(err.authHeaders);
  }
  // err?.cause is a custom set error payload that can contain
  // any data type for an error other than just string
  const error = err?.cause || err?.message;
  const providedFeedback = err?.feedback;
  res.getHeaderNames();
  res.json({ error, ...(providedFeedback && { feedback: providedFeedback }) });
}

module.exports = { LostErrorHandler, AppErrorHandler };
