import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { IFindPackages } from '../interfaces/package.interface';
import { createPackageSchema, getPackagesSchema, updatePackageSchema } from '../schemas/package.schema';
import { createPackage, deletePackage, findPackageById, findPackages, updatePackage, updatePackageApprover } from '../services/package.service';
import { deletePackageAccommodationByPackageId } from '../services/package-accommodation.service';
import { deletePackageAirfareByPackageId } from '../services/package-airfare.service';
import { UserType } from '@prisma/client';

const packageRouter = express.Router();

packageRouter.get('/', validate(getPackagesSchema), async (req: Request, res: Response) => {
  try {
    const query = {
      skip: Number(req.query.skip),
      take: Number(req.query.take),
      search: req.query.search,
      branch: req.query.branch,
      type: req.query.type
    } as IFindPackages;

    const packages = await findPackages(query);
    if (!packages) throw new Error('Failed to get packages');

    res.status(200).json(packages);

  } catch (error) {
    res.status(500).json(error);
  }
});

packageRouter.get('/:id', validate(getPackagesSchema), async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    const foundPackage = await findPackageById(id);
    if (!foundPackage) throw new Error('Failed to get package');

    res.status(200).json(foundPackage);

  } catch (error) {
    res.status(500).json(error);
  }
});

packageRouter.post('/', validate(createPackageSchema), async (req: Request, res: Response) => {
  try {
    const creatorId = req.user?.id;
    const created = await createPackage({creatorId, ...req.body});
    if (!created) throw new Error('Failed to create packages');

    res.status(200).json(created);

  } catch (error) {
    res.status(500).json(error);
  }
});

packageRouter.put('/:id', validate(updatePackageSchema), async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const updated = await updatePackage({id, ...req.body});
    if (!updated) throw new Error('Failed to update packages');

    res.status(200).json({
      message: 'Updated successfully'
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

packageRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedAccommodation = await deletePackageAccommodationByPackageId(id);
    if (!deletedAccommodation) {
      throw new Error('Failed to deleted package accommodations');
    }

    const deletedAirfare = await deletePackageAirfareByPackageId(id);
    if (!deletedAirfare) {
      throw new Error('Failed to deleted package airfare');
    }

    const deletedPackages = await deletePackage(id);
    if (!deletedPackages) {
      throw new Error('Failed to deleted packages');
    }

    res.status(200).json({
      message: 'Delete successfully'
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

packageRouter.patch('/:id/approver', async (req: Request, res: Response) => {
  try {
    const approverId = String(req.user?.id);
    const id = req.params.id;

    const update = await updatePackageApprover({ id, approverId });
    if (!update) {
      throw new Error('Failed to approve package');
    }

    return res.status(200).json({
      message: 'Package approved successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

export default packageRouter;
