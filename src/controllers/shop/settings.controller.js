import { asyncHandler } from '../../utils/asyncHandler.js';
import * as settingsService from '../../services/settings.service.js';
import * as shippingService from '../../services/shipping.service.js';

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getPublicSettings();
  res.json({ success: true, data: settings });
});

export const getShippingQuote = asyncHandler(async (req, res) => {
  const shippingCharge = await shippingService.computeShippingCharge(req.query.city, req.query.subtotal);
  res.json({ success: true, data: { shippingCharge } });
});
