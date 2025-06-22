const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Idea = require('../models/Idea');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/:ideaId/request', auth, upload.single('resume'), async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);
  if (!idea || req.user.role !== 'investor') return res.status(400).send('Invalid');
  const request = new Request({
    idea: idea._id,
    investor: req.user.id,
    resumePath: req.file.path
  });
  await request.save();
  res.json(request);
});

router.get('/:ideaId/requests', auth, async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);
  if (!idea || idea.author.toString() !== req.user.id) return res.status(403).send('Forbidden');
  const requests = await Request.find({ idea: idea._id }).populate('investor', 'name');
  res.json(requests);
});

router.post('/:requestId/:action', auth, async (req, res) => {
  const request = await Request.findById(req.params.requestId).populate('idea');
  if (!request || request.idea.author.toString() !== req.user.id) return res.status(403).send('Forbidden');
  request.status = req.params.action;
  await request.save();
  res.json(request);
});

module.exports = router;