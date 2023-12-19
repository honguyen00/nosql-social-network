const { User } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
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
            : res.json(user)

        } catch (error) {
            
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
            const user = await User.findOneAndUpdate({_id: req.param.id}, req.body, {new: true})
            !user ? res.status(404).json({ message: 'Update unsuccessfully'}) : res.json(user)
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteUserById(req, res) {
        try {
            const result = await User.findOneAndDelete({ _id: req.params.id });
            result.deletedCount ? res.status(200).json({ message: 'Delete successfully '}) : res.status(404).json({ message: 'No user found' })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}