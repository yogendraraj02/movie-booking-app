
import express from 'express';
import * as movieController from '../controllers/movieController';

const router = express.Router();

router.post('/', movieController.createMovie);

export default router;