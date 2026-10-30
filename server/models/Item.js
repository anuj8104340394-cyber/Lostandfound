const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Type is required (Lost or Found)'],
      enum: {
        values: ['Lost', 'Found'],
        message: '{VALUE} is not a valid type'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Phone', 'Wallet', 'ID Card', 'Bag', 'Keys', 'Books', 'Other'],
        message: '{VALUE} is not a valid category'
      }
    },
    location: {
      type: String,
      required: [true, 'Location where item was lost/found is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date of event is required']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact phone or email is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed'],
      default: 'Open'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Item', itemSchema);
