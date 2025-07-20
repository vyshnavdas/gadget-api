import { Router } from 'express';
import { createGadget, deleteGadget, getAllGadgets, getGadgetById, updateGadget, triggerSelfDestruct } from '../controllers/gadget.controller';
import { authMiddleware as authenticate } from '../middleware/auth.middleware';
import { checkJsonContentType } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /gadget:
 *   post:
 *     summary: Create a new gadget with optional name, status, and successRate fields
 *     tags: [Gadget]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Optional custom name/codename for the gadget
 *                 example: "The Falcon"
 *               status:
 *                 type: string
 *                 enum: [Available, Deployed, Destroyed, Decommissioned]
 *                 description: Optional status for the gadget
 *                 example: Available
 *               successRate:
 *                 type: number
 *                 format: float
 *                 description: Optional mission success rate (60–100)
 *                 example: 82.5
 *     responses:
 *       201:
 *         description: Gadget successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gadget created
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, createGadget);

/**
 * @swagger
 * /gadget:
 *   get:
 *     summary: Retrieve a list of all gadgets
 *     tags:
 *       - Gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Deployed, Destroyed, Decommissioned]
 *         description: Filter gadgets by status
 *     responses:
 *       200:
 *         description: A list of gadgets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *                   successRate:
 *                     type: string
 *                     example: "85.30%"
 *                   decommissionedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get('/', authenticate,  getAllGadgets);

/**
 * @swagger
 * /gadget/{id}:
 *   get:
 *     summary: Get gadget details by ID
 *     tags:
 *       - Gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the gadget
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Gadget details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *                 successRate:
 *                   type: string
 *                   example: "72.45%"
 *                 decommissionedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, getGadgetById);

/**
 * @swagger
 * /gadget/{id}:
 *   patch:
 *     summary: Update gadget details
 *     tags:
 *       - Gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the gadget to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Available, Deployed, Destroyed, Decommissioned]
 *               successRate:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Invalid input or no valid fields provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', authenticate, checkJsonContentType, updateGadget);

/**
 * @swagger
 * /gadget/{id}:
 *   delete:
 *     summary: Decommission a gadget
 *     description: Marks a gadget as Decommissioned and records the decommission timestamp.
 *     tags:
 *       - Gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the gadget to decommission
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Gadget successfully decommissioned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Gadget already decommissioned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, deleteGadget);

/**
 * @swagger
 * /gadget/{id}/self-destruct:
 *   post:
 *     summary: Trigger gadget self-destruct sequence
 *     description: Simulates the self-destruct sequence of a gadget. Requires a valid confirmation code as query parameter.
 *     tags:
 *       - Gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the gadget to self-destruct
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: code
 *         required: false
 *         description: Confirmation code to authorize the self-destruct
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Self-destruct sequence triggered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 confirmationCode:
 *                   type: string
 *       400:
 *         description: Missing or invalid confirmation code
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Server error
 */
router.post('/:id/self-destruct', authenticate, triggerSelfDestruct);

export default router;
