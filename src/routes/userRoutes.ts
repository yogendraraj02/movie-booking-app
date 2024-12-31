
import express from 'express';
import * as userController from '../controllers/userController';
import { checkLogin } from '../middlewares/auth';

const router = express.Router();
// router.use(checkLogin);
router.get('/bookings', userController.getUserWithBookings);

// router.post('/:id/editProfile',userController)

// router.post('/edit_profile', userController.edit)
/**
 * @swagger
 * /yogendraA:
 *   get:
 *     summary: Root Endpoint.
 *     description: Retorna una lista de todos los ítems disponibles.
 *     responses:
 *       200:
 *         description: Éxito. Retorna la lista de ítems.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/yogendRA', (req:any,res:any)=>{
    res.send("my name");
})

export default router;