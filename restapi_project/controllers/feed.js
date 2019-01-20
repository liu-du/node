const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const errHandler = require('../misc/error-handler');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      return res.status(200).json({
        message: 'Fetch posts success',
        posts: posts
      });
    })
    .catch(err => next(errHandler(err)));
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed...');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  console.log(req.body);
  // create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/210091320.jpg',
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
    .catch(err => next(errHandler(err)));
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode(404);
        throw error;
      }

      return res.status(200).json({
        message: 'Post fetched',
        post: post
      });
    })
    .catch(err => next(errHandler(err)));
};
