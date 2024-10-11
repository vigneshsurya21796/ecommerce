const errorhandler = (err,req,res,next) => {
      const statuscode = res.statusCode || 500;

      res.status(statuscode)

      res.json({
        message: err.message,
        stack: process.env.NODE_ENV=== "PRODUCTION" ? null: err.stack
      })
}
///////////////////////////////////////
module.exports ={ errorhandler}