const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const authenticate = require('../utils/auth');

const Feed = require('../models/feed');
const User = require('../models/user');



router.get('/feed-length', authenticate, async (req, res) => {
  try {
    const count = await Feed.find().countDocuments();
    res.status(200).json(count)
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    let skip = 0;

    if (req.query.index) {
      skip = parseInt(req.query.index)
    }

    const posts = await Feed.find().sort('-date_created').skip(skip).limit(10);

    const authors_usernames = [];
    for (let i in posts) {
      if (!authors_usernames[posts[i].author]) {
        authors_usernames.push(posts[i].author)
      }
    }
    const authors = await User.find({ 'username': authors_usernames });

    const feed = posts.map(({ _id, date_created, author, text, comments }) => {
      const { username, profile } = authors.find((item) => item.username === author);

      return {
        id: _id,
        date_created,
        author: { username, profile },
        text: text.length > 100 ? text.substring(0, 100) + '...' : text,
        comments: comments.length
      }
    })

    res.status(200).json(feed);
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const post_id = req.params.id;

    const post = await Feed.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const author = await User.findOne({ 'username': post.author });

    const { _id, date_created, text, comments } = post;

    const comments_authors_usernames = [];
    for (let i in comments) {
      if (!comments_authors_usernames[comments[i].author]) {
        comments_authors_usernames.push(comments[i].author)
      }
    }
    const comment_authors = await User.find({ 'username': comments_authors_usernames });

    const full_comments = comments.map(({ date_created, author, text }) => {
      const { username, profile } = comment_authors.find((item) => item.username === author);

      return {
        date_created,
        author: { username, profile },
        text: text
      }
    })

    res.status(200).json({
      id: _id,
      date_created,
      author: {
        username: author.username,
        profile: author.profile
      },
      text,
      comments: full_comments
    });
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});

router.post('/create', authenticate, [
  check('text', "Text should contains minimum 20 symbols").isLength({ min: 20 })
], async (req, res) => {
  try {
    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      return res.status(400).json({
        errors: validation_errors.array(),
        message: "Incorrect post data"
      })
    }

    const { userId } = req.user;
    const { text } = req.body;

    const { username } = await User.findOne({ _id: userId });

    const new_post = {
      date_created: new Date(),
      author: username,
      text,
      comment: []
    }

    const post = new Feed(new_post);
    await post.save()

    res.status(200).json('success')
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});

router.post('/comment', authenticate, [
  check('text', "Comment should contains minimum 2 symbols").isLength({ min: 2 })
], async (req, res) => {
  try {
    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      return res.status(400).json({
        errors: validation_errors.array(),
        message: "Incorrect comment data"
      })
    }

    const { userId } = req.user;
    const { post_id, text } = req.body;

    const { username } = await User.findOne({ _id: userId });

    const new_comment = {
      date_created: new Date(),
      author: username,
      text
    }

    const updated_post = await Feed.findOneAndUpdate(
      { _id: post_id },
      { $push: { 'comments': new_comment } },
      { useFindAndModify: false }
    )

    res.status(200).json('success')
  } catch (err) {
    res.status(500).json({ message: "Operation failed" })
  }
});



module.exports = router;
