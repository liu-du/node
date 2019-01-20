const fs = require('fs');
const path = require('path');
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

  if (!req.file) {
    const error = new Error('No image provided...');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  // create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: 'Jimmy'
    }
  });

  post
    .save()
    .then(result => {
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

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed...');
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post...');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(post => {
      return res.status(200).json({
        message: 'Post updated',
        post: post
      });
    })
    .catch(err => next(errHandler(err)));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find and delete post');
        error.statusCode = 404;
        throw error;
      }
      // check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted Post.' });
    })
    .catch(err => next(errHandler(err)));
};

clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {
    console.log(err);
  });
};
