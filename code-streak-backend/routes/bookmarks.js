const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');

// Get all bookmarks for user
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a new bookmark
router.post('/', auth, async (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ msg: 'Title and URL are required' });
  }
  try {
    const newBookmark = new Bookmark({
      userId: req.user.id,
      title,
      url,
    });
    await newBookmark.save();
    res.json(newBookmark);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a bookmark by id
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ msg: 'Bookmark not found' });
    }
    if (bookmark.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    await bookmark.remove();
    res.json({ msg: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
