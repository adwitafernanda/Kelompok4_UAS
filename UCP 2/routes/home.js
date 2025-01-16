const express = require('express');
const router = express.Router();


// Route for home page
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

module.exports = router;
