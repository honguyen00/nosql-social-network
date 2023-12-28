const { Schema, model } = require('mongoose');
require('datejs')
const reactionSchema = require('./Reaction')

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            validate: [
                function(val) {
                    return val.length >= 1 && val.length <= 280
                },
                'Thought must be between 1 and 280 characters long' 
            ],
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function(date) {
                return date.toString("d-MMM-yyyy, HH:mm")
            }
        },
        username: {
            type: String,
            required: true,
        }, 
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
