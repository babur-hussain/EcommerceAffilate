import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireCustomer } from '../middlewares/rbac';
import { Address } from '../models/address.model';

const router = Router();

router.get('/addresses', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const addresses = await Address.find({ userId: user.id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch addresses', message: error.message });
  }
});

router.post('/addresses', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { name, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } =
      (req.body as any) ?? {};

    const required = { name, phone, addressLine1, city, state, pincode, country };
    for (const [k, v] of Object.entries(required)) {
      if (typeof v !== 'string' || v.trim().length === 0) {
        return res.status(400).json({ error: `${k} is required` });
      }
    }

    if (isDefault === true) {
      await Address.updateMany({ userId: user.id, isDefault: true }, { $set: { isDefault: false } });
    }

    const created = await Address.create({
      userId: user.id,
      name: String(name).trim(),
      phone: String(phone).trim(),
      addressLine1: String(addressLine1).trim(),
      addressLine2: typeof addressLine2 === 'string' ? addressLine2.trim() : undefined,
      city: String(city).trim(),
      state: String(state).trim(),
      pincode: String(pincode).trim(),
      country: String(country).trim(),
      isDefault: !!isDefault,
    });

    res.status(201).json(created);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Default address already exists' });
    }
    res.status(500).json({ error: 'Failed to create address', message: error.message });
  }
});

router.put('/addresses/:id', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid address id' });
    }

    const { name, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } =
      (req.body as any) ?? {};

    const address = await Address.findOne({ _id: id, userId: user.id });
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    if (typeof name === 'string') address.name = name.trim();
    if (typeof phone === 'string') address.phone = phone.trim();
    if (typeof addressLine1 === 'string') address.addressLine1 = addressLine1.trim();
    if (typeof addressLine2 === 'string' || addressLine2 === null) address.addressLine2 = addressLine2 ?? undefined;
    if (typeof city === 'string') address.city = city.trim();
    if (typeof state === 'string') address.state = state.trim();
    if (typeof pincode === 'string') address.pincode = pincode.trim();
    if (typeof country === 'string') address.country = country.trim();

    if (isDefault === true) {
      await Address.updateMany({ userId: user.id, isDefault: true, _id: { $ne: address._id } }, { $set: { isDefault: false } });
      address.isDefault = true;
    } else if (isDefault === false) {
      address.isDefault = false;
    }

    const saved = await address.save();
    res.json(saved);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Default address already exists' });
    }
    res.status(500).json({ error: 'Failed to update address', message: error.message });
  }
});

router.delete('/addresses/:id', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid address id' });
    }

    const deleted = await Address.findOneAndDelete({ _id: id, userId: user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete address', message: error.message });
  }
});

router.post('/addresses/:id/default', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid address id' });
    }

    const address = await Address.findOne({ _id: id, userId: user.id });
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await Address.updateMany({ userId: user.id, isDefault: true, _id: { $ne: id } }, { $set: { isDefault: false } });
    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Default address already exists' });
    }
    res.status(500).json({ error: 'Failed to set default address', message: error.message });
  }
});

export default router;
