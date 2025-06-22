const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const idea = new Idea({ ...req.body, author: req.user.id });
  await idea.save();
  res.json(idea);
});

router.get('/', async (_, res) => {
  const ideas = await Idea.find().populate('author', 'name');
  res.json(ideas);
});

router.get('/:id', async (req, res) => {
  const idea = await Idea.findById(req.params.id).populate('author', 'name');
  res.json(idea);
});

module.exports = router;