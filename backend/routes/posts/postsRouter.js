const express = require('express');
const posts_controller = require('../../controllers/posts/posts.controller')
const requireAuth = require('../../middleware/requireAuth');
const fileUpload = require('express-fileupload');

const postsRouter = express.Router();

postsRouter.post('/newPost', requireAuth, fileUpload(), posts_controller.postProduct);
postsRouter.get('/', posts_controller.getPosts);
postsRouter.get('/:id', posts_controller.getPostById);

module.exports = postsRouter;
