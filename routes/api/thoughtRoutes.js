const router = require('express').Router();

const {
    getAllThought,
    getThoughtById,
    createReaction,
    createThought,
    updateThought,
    deleteReaction,
    deleteThought
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getAllThought).post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtById).put(updateThought).delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(createReaction);
// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;