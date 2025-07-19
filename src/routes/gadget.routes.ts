import { Router } from 'express';
import { createGadget, deleteGadget, getAllGadgets, getGadgetById, updateGadget, triggerSelfDestruct } from '../controllers/gadget.controller';
import { authMiddleware as authenticate } from '../middleware/auth.middleware';
import { checkJsonContentType } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createGadget);
router.get('/', authenticate,  getAllGadgets);
router.get('/:id', authenticate, getGadgetById);
router.patch('/:id', authenticate, checkJsonContentType, updateGadget);
router.delete('/:id', authenticate, deleteGadget);
router.post('/:id/self-destruct', authenticate, triggerSelfDestruct);

export default router;
