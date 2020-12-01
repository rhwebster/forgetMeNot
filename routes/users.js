const { decodeBase64 } = require('bcryptjs');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', csrfProtection, (req,res) => {
  res.render('log-in', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
});

const loginValidators = [
  check('emailAddress').exists({ checkFalsy: true }).withMessage('Please provide Email Address'),
  check('password').exists({ checkFalsy: true }).withMessage('Please provide a valid Password'),
]

router.post(
  '/login',
  csrfProtection,
  loginValidators,
  asyncHandler(async (req, res) => {
    const { emailAdress, password } = req.body;

    let errors = [];
    const validationErrors = validationResult(req);

    if(validationErrors.isEmpty()) {
      const user = await db.User.findOne({ where: {emailAdress} });

      if (user !== null) {
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

        if (passwordMatch) {
          loginUser(req, res, user);
          return res.redirect('/');
        }
      }

      errors.push('Invalid credentials. Please doublecheck email address and password');
    } else {
      errors.validationErrors.array().map((error) => error.msg);
    }

    res.render('log-in', {
      title: 'Login',
      emailAdress,
      errors,
      csrfToken: req.csrfToken(),
    });
  })
);


module.exports = router;
