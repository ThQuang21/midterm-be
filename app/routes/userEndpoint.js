const express = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/user')
const router = express.Router();
const auth = require('../controllers/authControllers')


router.get('/:email', auth.checkAuth, auth.checkUser, async (req, res) => {
    try {
        const email = req.params.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'User not found' });
        }

        const userData = await User.findOne({ email }).select('-password');
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/', auth.checkAuth, auth.checkUser, async (req, res) => {
    try{
       
        const email = req.body.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log(email)
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (req.body.password && !passwordRegex.test(req.body.password)) {
            return res.status(400).json({
                error: 'Invalid password format. It must have at least one lowercase letter, one uppercase letter, one special character, and be at least 6 characters long.',
            });
        }
        const userToUpdate = await User.findOne({ email });

        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.name) {
            const maxLength = 25;
            if (req.body.name.length > maxLength) {
                return res.status(400).json({ error: `Name should not be longer than ${maxLength} characters` });
            }
            userToUpdate.name = req.body.name;
        }
        if (req.body.age) {
            const age = parseInt(req.body.age);
            if (isNaN(age) || age <= 0 || age >= 150) {
                return res.status(400).json({ error: 'Invalid age value' });
            }
            userToUpdate.age = age;
        }
        if (req.body.job) {
            const maxLength = 25;
            if (req.body.job.length > maxLength) {
                return res.status(400).json({ error: `Job should not be longer than ${maxLength} characters` });
            }
            userToUpdate.job = req.body.job;
        }
        if (req.body.phone) {
            const maxLength = 25;
            if (req.body.phone.length > maxLength) {
                return res.status(400).json({ error: `Phone should not be longer than ${maxLength} characters` });
            }
            userToUpdate.phone = req.body.phone;
        }

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            userToUpdate.password = hashedPassword;
        }

        var savedUser = await userToUpdate.save()
        savedUser = savedUser.toObject()
        delete savedUser.password
        res.status(200).json(savedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = router;