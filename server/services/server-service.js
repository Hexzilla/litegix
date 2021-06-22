const { validationResult } = require('express-validator')

const create = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  res.json({success: true})
}

module.exports = {
  create,
}
