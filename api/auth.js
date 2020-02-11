const config = require('config');
const express = require('express');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { AvatarGenerator } = require('random-avatar-generator');
const randomAvatar = () => new AvatarGenerator().generateRandomAvatar();

const authenticate = require('../utils/auth');

const User = require('../models/user');



router.post('/sign-up', [
  check('username', "Username should contains minimum 4 symbols").isLength({ min: 4 }),
  check('password', "Password should contains minimum 6 symbols").isLength({ min: 6 })
], async (req, res) => {
  try {
    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      return res.status(400).json({
        errors: validation_errors.array(),
        message: "Incorrect user data"
      })
    }

    const { username, password } = req.body;

    const username_duplicate = await User.findOne({ username });

    if (username_duplicate) {
      return res.status(400).json({ message: "Username already exists" })
    }

    const encrypted_password = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      password: encrypted_password,
      sessions: [],
      profile: {
        avatar: randomAvatar(),
        full_name: ''
      }
    });

    await user.save();

    res.status(200).json({ message: "User created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});

router.post('/login', [
  check('username', "Username should contains minimum 4 symbols").isLength({ min: 4 }),
  check('password', "Enter password").exists()
], async (req, res) => {
  try {
    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Incorrect user data"
      })
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" })
    }

    const token = webToken.sign({ userId: user.id }, config.get('auth_secret'), { expiresIn: '1h' });

    await User.findOneAndUpdate(
      { username },
      { $push: { 'sessions': { date_created: new Date(), token } } },
      { useFindAndModify: false }
    )

    res.json({ token, userId: user.id, username, profile: user.profile })
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.json({ isAuthenticated: false })
    }

    const user = await User.findOne({ _id: userId, 'sessions': { $elemMatch: { token } } });

    if (!user) {
      return res.json({ isAuthenticated: false })
    }

    const new_token = webToken.sign({ userId }, config.get('auth_secret'), { expiresIn: '1h' });

    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { 'sessions': { date_created: new Date(), token: new_token } } },
      { useFindAndModify: false }
    )

    res.json({ isAuthenticated: true, userId, token: new_token, username: user.username, profile: user.profile })
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});

router.post('/update-profile', authenticate, async (req, res) => {
  try {
    const { userId, token, profile } = req.body;

    if (!userId || !token) {
      return res.status(401)
    }

    const user = await User.findOne({ _id: userId, 'sessions.token': token });

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const updated_profile = {
      avatar: user.profile.avatar,
      full_name: profile.full_name
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { 'profile': updated_profile } },
      { useFindAndModify: false }
    )

    res.status(200).json({ isAuthenticated: true, username: user.username, profile: updated_profile })
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});



module.exports = router;
