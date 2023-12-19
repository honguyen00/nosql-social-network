const router = require('express').Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:id
router.route('/:id').get(getUserById).put(updateUserById).delete(deleteUserById);

module.exports = router;