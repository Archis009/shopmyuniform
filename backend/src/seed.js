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
    { name: "Classic White Tee", description: "A classic cotton white tee.", price: 699, stock: 100, categoryId: catMens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&auto=format" },
    { name: "Black Denim Jacket", description: "Stylish black denim jacket.", price: 2999, stock: 50, categoryId: catMens.id, size: "L", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&auto=format" },
    { name: "Slim Fit Blue Jeans", description: "Everyday slim fit blue jeans.", price: 1999, stock: 75, categoryId: catMens.id, size: "32x32", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop&auto=format" },
    { name: "Plaid Flannel Shirt", description: "Cozy red and black flannel.", price: 1499, stock: 60, categoryId: catMens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&h=500&fit=crop&auto=format" },
    { name: "Grey Pullover Hoodie", description: "Warm and comfortable grey hoodie.", price: 1799, stock: 80, categoryId: catMens.id, size: "L", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&auto=format" },
    { name: "Khaki Chino Pants", description: "Versatile khaki chinos.", price: 1599, stock: 40, categoryId: catMens.id, size: "34x32", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop&auto=format" },
    { name: "Leather Moto Jacket", description: "Premium leather moto jacket.", price: 4999, stock: 15, categoryId: catMens.id, size: "L", imageUrl: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=500&fit=crop&auto=format" },
    { name: "Athletic Running Shorts", description: "Lightweight running shorts.", price: 899, stock: 90, categoryId: catMens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop&auto=format" },
    { name: "Vintage Graphic Tee", description: "Retro style graphic t-shirt.", price: 799, stock: 120, categoryId: catMens.id, size: "XL", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScEQI4lKoydr46GqjtFpPvjVXEnWGoNSTUEZ_IOfXDvg&s=10" },
    { name: "Formal Dress Shirt", description: "Crisp white button-down.", price: 1899, stock: 50, categoryId: catMens.id, size: "M", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcvzBGOL4PtIzbSSIQaNxUEz_eR2yFK6fugWDJHtvcOw&s=10" },
    
    // Women's Products
    { name: "Floral Summer Dress", description: "Lightweight dress with floral print.", price: 1799, stock: 65, categoryId: catWomens.id, size: "S", imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop&auto=format" },
    { name: "High-Waisted Skinny Jeans", description: "Black high-waisted skinny jeans.", price: 2199, stock: 80, categoryId: catWomens.id, size: "28", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop&auto=format" },
    { name: "Oversized Knit Sweater", description: "Cozy beige oversized sweater.", price: 2499, stock: 45, categoryId: catWomens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&auto=format" },
    { name: "Silk Camisole", description: "Elegant black silk cami.", price: 1299, stock: 70, categoryId: catWomens.id, size: "S", imageUrl: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop&auto=format" },
    { name: "Yoga Leggings", description: "Stretchy athletic leggings.", price: 999, stock: 100, categoryId: catWomens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop&auto=format" },
    { name: "Denim Skirt", description: "Classic blue denim mini skirt.", price: 1199, stock: 60, categoryId: catWomens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop&auto=format" },
    { name: "Trench Coat", description: "Classic beige trench coat.", price: 3999, stock: 25, categoryId: catWomens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&auto=format" },
    { name: "Linen Wide-Leg Pants", description: "Breezy white linen pants.", price: 1699, stock: 55, categoryId: catWomens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&auto=format" },
    { name: "Crop Top Hoodie", description: "Pink cropped hoodie.", price: 999, stock: 85, categoryId: catWomens.id, size: "S", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&auto=format" },
    { name: "Evening Gown", description: "Elegant red evening gown.", price: 4999, stock: 10, categoryId: catWomens.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop&auto=format" },

    // Accessories
    { name: "Canvas Tote Bag", description: "Eco-friendly canvas tote.", price: 599, stock: 200, categoryId: catAccessories.id, size: "One Size", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=500&fit=crop&auto=format" },
    { name: "Classic Aviator Sunglasses", description: "Gold frame aviator sunglasses.", price: 1499, stock: 100, categoryId: catAccessories.id, size: "One Size", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=500&fit=crop&auto=format" },
    { name: "Leather Belt", description: "Genuine brown leather belt.", price: 899, stock: 75, categoryId: catAccessories.id, size: "M", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&auto=format" },
    { name: "Silver Hoop Earrings", description: "Simple and elegant silver hoops.", price: 799, stock: 150, categoryId: catAccessories.id, size: "One Size", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop&auto=format" },
    { name: "Knit Beanie", description: "Warm winter beanie.", price: 599, stock: 120, categoryId: catAccessories.id, size: "One Size", imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=500&fit=crop&auto=format" },
    { name: "Minimalist Watch", description: "Black dial minimalist watch.", price: 2999, stock: 40, categoryId: catAccessories.id, size: "One Size", imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop&auto=format" },
    { name: "Crossbody Bag", description: "Black leather crossbody bag.", price: 1999, stock: 60, categoryId: catAccessories.id, size: "One Size", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop&auto=format" },
    { name: "Baseball Cap", description: "Cotton baseball cap.", price: 699, stock: 100, categoryId: catAccessories.id, size: "One Size", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5F-Ax4OT7iWZR74eeyfNw0zAQhCQ_u7BYaxOcg75-zA&s=10" }
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });
    
    if (!existingProduct) {
      await prisma.product.create({
        data: product
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
