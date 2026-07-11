const express = require('express');
const prisma = require('../prisma');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Create Category
router.post('/categories', async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await prisma.category.create({
      data: { name, slug }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Admin create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl, size } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        imageUrl,
        size
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Admin create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Product
router.put('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, stock, categoryId, imageUrl, size } = req.body;
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        imageUrl,
        size
      }
    });
    res.json(product);
  } catch (error) {
    console.error('Admin update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Admin delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders (Admin view)
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true } },
        orderItems: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Admin fetch orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body; // PLACED, PROCESSING, SHIPPED, DELIVERED

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    console.error('Admin update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
