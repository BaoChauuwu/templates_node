const express = require('express');
const { loginUserService, registerUserService } = require('../services/authService');

const loginUser = async (req, res) => {
    try{
        const {username, password} = req.body;
        if(!username || !password){
        return res.status(400).json({ message: 'user and password are required'})
        }
        const result = await loginUserService(username,password);
        return res.status(200).json({result})

    }catch(error){
        return res.status(401).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const result = await registerUserService(username, password, role);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
module.exports= {loginUser ,registerUser};