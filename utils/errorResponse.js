module.exports = (res, error, defaultMessage = "Server error") => {
  console.error(defaultMessage, error.message || error);
  const status = error.statusCode || 500;
  return res.status(status).json({
    message: error.clientMessage || defaultMessage,
  });
};
