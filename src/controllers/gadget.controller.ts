import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { generateCodename } from '../utils/generateCodename';
import { Status } from '@prisma/client';


const confirmationCodes = new Map<string, string>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export const createGadget = async (req: Request, res: Response) => { // post /gadget
  try {
    const user = (req as any).user;
    const userId = user?.id;
    const codename = generateCodename();
    const successRate = parseFloat((Math.random() * 40 + 60).toFixed(2)); // 60% to 100%

    const gadget = await prisma.gadget.create({
      data: {
        name: codename,
        userId,
        status: 'Available',
        successRate
      },
    });

    res.status(201).json({ message: 'Gadget created', gadget });
  } catch (err) {
    console.error('Error creating gadget:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllGadgets = async (req: Request, res: Response) => { // get /gadget
  try {
    const { status } = req.query;

    let whereClause = {};

    if (status) {
      if (typeof status !== 'string' || !Object.values(Status).includes(status as Status)) {
        return res.status(400).json({
          message: `Invalid status. Valid options are: ${Object.values(Status).join(', ')}.`,
        });
      }

      // Safe to cast now
      whereClause = { status: status as Status };
    }

    const gadgets = await prisma.gadget.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    const formatted = gadgets.map(gadget => ({
      id: gadget.id,
      name: gadget.name,
      status: gadget.status,
      successRate: `${gadget.successRate.toFixed(2)}%`,
      decommissionedAt: gadget.decommissionedAt,
      user: gadget.user,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching gadgets' });
  }
};

export const updateGadget = async (req: Request, res: Response) => {  // patch gadget/:id
  const { id } = req.params;
  const { name, status, successRate } = req.body;

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (status !== undefined) updateData.status = status;
  if (successRate !== undefined) updateData.successRate = successRate;

  console.log('Updating gadget with data:', updateData); // LOG THE OBJECT

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  try {
    const updated = await prisma.gadget.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating gadget:', error);
    res.status(500).json({ message: 'Error updating gadget'});
  }
};

export const deleteGadget = async (req: Request, res: Response) => { // delete gadget/:id
  const { id } = req.params;

  try {
    const updated = await prisma.gadget.update({
      where: { id },
      data: {
        status: Status.Decommissioned,
        decommissionedAt: new Date(),
      },
    });

    return res.json({
      message: 'Gadget successfully decommissioned',
      gadget: updated,
    });
  } catch (error) {
    console.error('❌ Error decommissioning gadget:', error);
    return res.status(500).json({
      message: 'Error decommissioning gadget',
      error: error instanceof Error ? error.message : error,
    });
  }
};


export const triggerSelfDestruct = async (req: Request, res: Response) => { //post gadget/:id/self-destruct
  const { id } = req.params;
  const codeFromQuery = req.query.code as string | undefined;

  // Step 1: If no code is provided, generate one
  if (!codeFromQuery) {
    const generatedCode = generateCode();
    confirmationCodes.set(id, generatedCode);

    return res.status(200).json({
      message: 'Confirmation code generated. Re-send the same request with ?code=XXXX',
      code: generatedCode, // ⚠️ For simulation only; hide in production
    });
  }

  // Step 2: Validate code
  const expectedCode = confirmationCodes.get(id);
  if (codeFromQuery !== expectedCode) {
    return res.status(403).json({ message: 'Invalid or expired confirmation code' });
  }

  try {
    const gadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: Status.Destroyed,
        decommissionedAt: new Date(),
      },
    });

    // Cleanup the used code
    confirmationCodes.delete(id);

    return res.status(200).json({
      message: 'Gadget successfully decommissioned',
      gadget,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to trigger self-destruct',
      error: error instanceof Error ? error.message : error,
    });
  }
}

export const getGadgetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const gadget = await prisma.gadget.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    const formatted = {
      id: gadget.id,
      name: gadget.name,
      status: gadget.status,
      successRate: `${gadget.successRate.toFixed(2)}%`,
      decommissionedAt: gadget.decommissionedAt,
      user: gadget.user,
    };

    return res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching gadget' });
  }
};