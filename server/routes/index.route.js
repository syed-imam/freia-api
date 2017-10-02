import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import bodyParser from 'body-parser';

const router = express.Router(); // eslint-disable-line new-cap


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
