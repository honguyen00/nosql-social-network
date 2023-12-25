const { User, Thought, Reaction } = require('../models');

module.exports = {
    async getAllThought(req, res) {
        try {
            const thoughts = await Thought.find();
            res.status(200).json(thoughts);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getThoughtById(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.id });
            !thought ? res.status(404).json({ message: 'No thought match' }) : res.status(200).json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const updateUser = await User.findOneAndUpdate({
                _id: req.body.userId
            }, {$push: {thoughts: thought._id}}, {new: true});
            res.status(200).json(thought, updateUser);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({_id: req.param.id}, req.body, {new: true});
            !thought ? res.status(404).json({message: 'Update unsuccessfully'}) : res.status(200).json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOne({_id: req.params.id})
            if(!thought) {
                return res.status(404).json({message: 'Cannot find thought by id'});
            }
            await Thought.deleteOne({ _id: req.params.id });
            res.status(200).json({message: 'Delete successfully'});
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$addToSet: { reactions: req.body }},
                { runValidators: true, new: true}
            );
            if(!thought) {
                return res.status(404).json({ message: 'No thought with given ID' });
            }
            res.status(200).json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reations: {reactionId: req.pararms.reactionId}}},
                {runValidators: true, new: true}
            );

            if(!thought) {
                return res.status(404).json({ message: 'No thought found' });
            }
            res.status(200).json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}