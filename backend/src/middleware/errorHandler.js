export function errorHandler(error, request, response, next) {
  console.error(error);
  if (response.headersSent) return next(error);
  response.status(error.status || 500).json({
    message: error.status ? error.message : "Something went wrong. Please try again.",
  });
}
