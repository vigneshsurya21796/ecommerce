const errorhandler = (err, req, res, next) => {
  const statuscode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statuscode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}
///////////////////////////////////////
module.exports ={ errorhandler}