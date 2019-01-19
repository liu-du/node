const { validationResult } = require('express-validator/check');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First post',
        creator: {
          name: 'Jimmy'
        },
        content: 'This is the first post!',
        imageUrl: 'images/1005455253.jpg',
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation Failed...',
      errors: errors.array()
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  // create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/761541913.jpg',
    creator: {
      name: 'Jimmy'
    }
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
        createdAt: new Date()
      });
    })
    .catch(err => {
      console.log(err);
    });
};
