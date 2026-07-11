const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Categories
  const catMens = await prisma.category.upsert({
    where: { slug: 'mens' },
    update: {},
    create: { name: "Men's Fashion", slug: 'mens' },
  });

  const catWomens = await prisma.category.upsert({
    where: { slug: 'womens' },
    update: {},
    create: { name: "Women's Fashion", slug: 'womens' },
  });

  const catAccessories = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: { name: 'Accessories', slug: 'accessories' },
  });

  // 2. Create Admin and Test User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: {
      email: 'admin@shop.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const userPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'user@shop.com' },
    update: {},
    create: {
      email: 'user@shop.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // 3. Create Products (at least 20-30)
  const products = [
    // Men's Products
    { name: "Classic White Tee", description: "A classic cotton white tee.", price: 15.99, stock: 100, categoryId: catMens.id, size: "M" },
    { name: "Black Denim Jacket", description: "Stylish black denim jacket.", price: 49.99, stock: 50, categoryId: catMens.id, size: "L" },
    { name: "Slim Fit Blue Jeans", description: "Everyday slim fit blue jeans.", price: 39.99, stock: 75, categoryId: catMens.id, size: "32x32" },
    { name: "Plaid Flannel Shirt", description: "Cozy red and black flannel.", price: 29.99, stock: 60, categoryId: catMens.id, size: "M" },
    { name: "Grey Pullover Hoodie", description: "Warm and comfortable grey hoodie.", price: 34.99, stock: 80, categoryId: catMens.id, size: "L" },
    { name: "Khaki Chino Pants", description: "Versatile khaki chinos.", price: 45.00, stock: 40, categoryId: catMens.id, size: "34x32" },
    { name: "Leather Moto Jacket", description: "Premium leather moto jacket.", price: 120.00, stock: 15, categoryId: catMens.id, size: "L" },
    { name: "Athletic Running Shorts", description: "Lightweight running shorts.", price: 20.00, stock: 90, categoryId: catMens.id, size: "M" },
    { name: "Vintage Graphic Tee", description: "Retro style graphic t-shirt.", price: 18.50, stock: 120, categoryId: catMens.id, size: "XL" },
    { name: "Formal Dress Shirt", description: "Crisp white button-down.", price: 42.00, stock: 50, categoryId: catMens.id, size: "M" },
    
    // Women's Products
    { name: "Floral Summer Dress", description: "Lightweight dress with floral print.", price: 35.00, stock: 65, categoryId: catWomens.id, size: "S" },
    { name: "High-Waisted Skinny Jeans", description: "Black high-waisted skinny jeans.", price: 45.00, stock: 80, categoryId: catWomens.id, size: "28" },
    { name: "Oversized Knit Sweater", description: "Cozy beige oversized sweater.", price: 55.00, stock: 45, categoryId: catWomens.id, size: "M" },
    { name: "Silk Camisole", description: "Elegant black silk cami.", price: 28.00, stock: 70, categoryId: catWomens.id, size: "S" },
    { name: "Yoga Leggings", description: "Stretchy athletic leggings.", price: 30.00, stock: 100, categoryId: catWomens.id, size: "M" },
    { name: "Denim Skirt", description: "Classic blue denim mini skirt.", price: 25.00, stock: 60, categoryId: catWomens.id, size: "M" },
    { name: "Trench Coat", description: "Classic beige trench coat.", price: 95.00, stock: 25, categoryId: catWomens.id, size: "M" },
    { name: "Linen Wide-Leg Pants", description: "Breezy white linen pants.", price: 40.00, stock: 55, categoryId: catWomens.id, size: "M" },
    { name: "Crop Top Hoodie", description: "Pink cropped hoodie.", price: 22.00, stock: 85, categoryId: catWomens.id, size: "S" },
    { name: "Evening Gown", description: "Elegant red evening gown.", price: 150.00, stock: 10, categoryId: catWomens.id, size: "M" },

    // Accessories
    { name: "Canvas Tote Bag", description: "Eco-friendly canvas tote.", price: 12.00, stock: 200, categoryId: catAccessories.id, size: "One Size" },
    { name: "Classic Aviator Sunglasses", description: "Gold frame aviator sunglasses.", price: 25.00, stock: 100, categoryId: catAccessories.id, size: "One Size" },
    { name: "Leather Belt", description: "Genuine brown leather belt.", price: 30.00, stock: 75, categoryId: catAccessories.id, size: "M" },
    { name: "Silver Hoop Earrings", description: "Simple and elegant silver hoops.", price: 18.00, stock: 150, categoryId: catAccessories.id, size: "One Size" },
    { name: "Knit Beanie", description: "Warm winter beanie.", price: 15.00, stock: 120, categoryId: catAccessories.id, size: "One Size" },
    { name: "Minimalist Watch", description: "Black dial minimalist watch.", price: 65.00, stock: 40, categoryId: catAccessories.id, size: "One Size" },
    { name: "Crossbody Bag", description: "Black leather crossbody bag.", price: 45.00, stock: 60, categoryId: catAccessories.id, size: "One Size" },
    { name: "Baseball Cap", description: "Cotton baseball cap.", price: 15.00, stock: 100, categoryId: catAccessories.id, size: "One Size" }
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });
    
    if (!existingProduct) {
      await prisma.product.create({
        data: {
          ...product,
          imageUrl: `https://placehold.co/400x500?text=${encodeURIComponent(product.name)}`
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
