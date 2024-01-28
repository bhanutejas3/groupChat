export const error = (statusCode, message) => {
  const err = new Error();
  err.statusCode = statusCode;
  err.message = message;
  return err;
};

export const handleMongoError = (err, statusCode = "", message = "") => {
  if (err instanceof Error && err.code) {
    if (err.code === 11000) {
      return error(400, "Duplicate entry, please choose a different value.");
    } else {
      return error(500, "MongoDB error occurred.");
    }
  } else {
    return error(statusCode, message);
  }
  return err;
};
