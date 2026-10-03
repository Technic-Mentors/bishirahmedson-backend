import { Router } from 'express';
import * as settingsController from '../../controllers/shop/settings.controller.js';
import { validate } from '../../middleware/validate.js';
import { shippingQuoteQuerySchema } from '../../validation/shipping.schema.js';

export const settingsRouter = Router();

settingsRouter.get('/', settingsController.getPublicSettings);
settingsRouter.get('/shipping-quote', validate(shippingQuoteQuerySchema), settingsController.getShippingQuote);
