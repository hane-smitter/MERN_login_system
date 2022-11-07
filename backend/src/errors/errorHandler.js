function LostErrorHandler(req, res, next) {
  res.status(404);

  res.json({ error: "Resource not found" });
}

function AppErrorHandler(err, req, res, next) {
  res.status(err.status || 500);
  // err?.cause is a custom set error payload that can contain
  // any data type for an error other than just string
  const error = err?.cause || err?.message;
  res.json({ error });
}

module.exports = { LostErrorHandler, AppErrorHandler };
