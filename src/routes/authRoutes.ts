import { Router } from 'express';

import {editUserProfile, login, logout, register} from "../controllers/authController"
import { checkLogin } from '../middlewares/auth';

const router = Router();

// router.post('/login', login as any);
// router.post('/register', register);
// router.post('/logout', logout)
// export default router;


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post('/login', login as any);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', register);


router.post('/logout', logout);

router.post('/editprofile',checkLogin as any, editUserProfile);
export default router;