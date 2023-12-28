const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id})
            .populate({ path: 'thoughts', select: '-__v'})
            .populate({ path: 'friends', select: '-__v'});
            !user ? 
            res.status(404).json({ message: 'No user match given id' }) 
            : res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async updateUserById(req, res) {
        try {
            const user = await User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
            !user ? res.status(404).json({ message: 'Update unsuccessfully'}) : res.json(user)
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id })
            if (!user) {
                return res.status(404).json({ message: 'Cannot find user '});
            }
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            await User.deleteOne({ _id: req.params.id })
            res.status(200).json({ message: 'Delete successfully' });

        } catch (error) {
            res.status(500).json(error)
        }
    },
    async addFriend(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId });
            if(!user) {
                return res.status(404).json({ message: 'No user found' }); 
            }
            const friend = await User.findOne({ _id: req.params.friendId });
            if(!friend) {
                return res.status(404).json({ message: 'No friend found' });
            }
            const updateUser = await User.updateOne({ _id: req.params.userId}, { $addToSet: { friends: req.params.friendId }}, {new: true});
            const updateFriend = await User.updateOne({ _id: req.params.friendId}, { $addToSet : { friends: req.params.userId }}, {new: true});
            res.status(200).json({updateUser, updateFriend});
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteFriend(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId });
            if(!user) {
                return res.status(404).json({ message: 'No user found' });
            }
            const friend = await User.findOne({ _id: req.params.friendId });
            if(!friend) {
               return res.status(404).json({ message: 'No friend found' });    
            }
            const deleteFromUser = await User.updateOne({ _id: req.params.userId}, { $pull: { friends: req.params.friendId }}, {new: true});
            const deleteFromFriend = await User.updateOne({ _id: req.params.friendId}, { $pull: { friends: req.params.userId }}, {new: true});
            res.status(200).json({deleteFromUser, deleteFromFriend});
        } catch (error) {
            
        }
    }
}