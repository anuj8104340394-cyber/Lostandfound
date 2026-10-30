const fs = require('fs');
const path = require('path');
const Item = require('../models/Item');
const cloudinary = require('../config/cloudinary');

/**
 * @desc    Get all items with optional search & filter
 * @route   GET /api/items
 * @access  Public
 */
const getItems = async (req, res) => {
  try {
    const { search, type, category, date, status, showClaimed } = req.query;

    const query = {};

    // 1. Filter by Type (Lost / Found)
    if (type && type !== 'All') {
      query.type = type;
    }

    // 2. Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // 3. Status filter: By default, show only "Open" items unless showClaimed is true or status is explicitly set
    if (status && status !== 'All') {
      query.status = status;
    } else if (showClaimed !== 'true') {
      query.status = 'Open';
    }

    // 4. Filter by Date (exact date match: from 00:00 to 23:59:59 of that date)
    if (date) {
      const selectedDate = new Date(date);
      if (!isNaN(selectedDate.getTime())) {
        const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999));
        query.date = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    // 5. Search keyword in title, description, or location
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { location: regex }
      ];
    }

    // Fetch items sorted by newest first
    const items = await Item.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error while fetching items', error: error.message });
  }
};

/**
 * @desc    Get single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error while fetching item', error: error.message });
  }
};

/**
 * @desc    Create a new lost/found report
 * @route   POST /api/items
 * @access  Private (or authenticated user)
 */
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      location,
      date,
      contactName,
      contactInfo
    } = req.body;

    // Required fields validation
    if (!title || !description || !type || !category || !location || !date || !contactName || !contactInfo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Prepare image data
    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      // If uploaded to Cloudinary, req.file.path starts with http/https
      if (req.file.path && (req.file.path.startsWith('http://') || req.file.path.startsWith('https://'))) {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename;
      } else {
        // Local storage fallback
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        imagePublicId = '';
      }
    }

    const newItem = new Item({
      title,
      description,
      type,
      category,
      location,
      date,
      imageUrl,
      imagePublicId,
      contactName,
      contactInfo,
      status: 'Open',
      createdBy: req.user ? req.user._id : null
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error while reporting item', error: error.message });
  }
};

/**
 * @desc    Update an item (owner only)
 * @route   PUT /api/items/:id
 * @access  Private
 */
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ownership check: only creator can edit
    if (item.createdBy && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this post' });
    }

    const {
      title,
      description,
      type,
      category,
      location,
      date,
      contactName,
      contactInfo,
      status
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (type) item.type = type;
    if (category) item.category = category;
    if (location) item.location = location;
    if (date) item.date = date;
    if (contactName) item.contactName = contactName;
    if (contactInfo) item.contactInfo = contactInfo;
    if (status) item.status = status;

    // If new image uploaded, delete old image
    if (req.file) {
      if (item.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(item.imagePublicId);
        } catch (cloudErr) {
          console.error('Error removing old Cloudinary image:', cloudErr);
        }
      }

      if (req.file.path && (req.file.path.startsWith('http://') || req.file.path.startsWith('https://'))) {
        item.imageUrl = req.file.path;
        item.imagePublicId = req.file.filename;
      } else {
        item.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        item.imagePublicId = '';
      }
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error while updating item', error: error.message });
  }
};

/**
 * @desc    Toggle item status between 'Open' and 'Claimed'
 * @route   PATCH /api/items/:id/claim
 * @access  Private
 */
const claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ownership check: only owner can mark as claimed
    if (item.createdBy && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Only the item reporter can change claim status' });
    }

    // Toggle status
    item.status = item.status === 'Open' ? 'Claimed' : 'Open';
    const updatedItem = await item.save();

    res.json(updatedItem);
  } catch (error) {
    console.error('Claim item error:', error);
    res.status(500).json({ message: 'Server error while toggling claim status', error: error.message });
  }
};

/**
 * @desc    Delete an item (owner only)
 * @route   DELETE /api/items/:id
 * @access  Private
 */
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ownership check: only creator can delete
    if (item.createdBy && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this post' });
    }

    // Delete image from Cloudinary if it exists
    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (cloudErr) {
        console.error('Cloudinary delete error:', cloudErr);
      }
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item successfully deleted' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error while deleting item', error: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  claimItem,
  deleteItem
};
