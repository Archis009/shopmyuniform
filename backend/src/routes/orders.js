const express = require('express');
const prisma = require('../prisma');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get user orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by id
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Place new order
router.post('/', async (req, res) => {
  try {
    const { shippingName, shippingAddress, shippingCity, shippingZip } = req.body;

    if (!shippingName || !shippingAddress || !shippingCity || !shippingZip) {
      return res.status(400).json({ error: 'All shipping details are required' });
    }

    // Get user's cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock for all items
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Not enough stock for ${item.product.name}` 
        });
      }
      totalAmount += item.quantity * item.product.price;
    }

    // Use transaction to ensure consistency
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount,
          status: 'PLACED',
          shippingName,
          shippingAddress,
          shippingCity,
          shippingZip,
          orderItems: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price
            }))
          }
        },
        include: {
          orderItems: true
        }
      });

      // Update product stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear user cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user.id }
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
