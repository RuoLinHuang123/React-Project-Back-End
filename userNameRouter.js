const express = require("express");
const User = require("./user");
const auth = require('./auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user._id); // Use the user ID set by the authenticateToken middleware
      if (!user) return res.status(404).send('User not found');
      res.send({ name: user.name }); // Send the user's name in response
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });


module.exports = router;