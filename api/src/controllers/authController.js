const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const config = require('../config/env');
const createError = require('http-errors');

const SALT_ROUNDS = 10;

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;


    if (!name || !email || !password) {
      throw createError(400, 'Name, email and password are required');
    }

    if (password.length < 6) {
      throw createError(400, 'Password must be at least 6 characters long');
    }

 
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw createError(400, 'User with this email already exists');
    }

  
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const validRoles = ['USER', 'ADMIN', 'MANAGER'];
    const userRole = role && validRoles.includes(role.toUpperCase()) 
      ? role.toUpperCase() 
      : 'USER';

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: passwordHash,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });


    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser,
    });
  } catch (err) {
   
    if (err.code === 'P2002') {
      return next(createError(400, 'User with this email already exists'));
    }

    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError(400, 'Email and password are required');

    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });

    if (!user) throw createError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw createError(401, 'Invalid credentials');

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register };