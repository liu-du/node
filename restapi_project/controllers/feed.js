const { validationResult } = require('express-validator/check');

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
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: '3',
            title: title, 
            content: content,
            creator: {
                name: 'Jimmy'
            },
            createdAt: new Date()
        }
    })
};