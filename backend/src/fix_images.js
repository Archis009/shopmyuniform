const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  
  const categoryImages = {
    1: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop', // Mens
    2: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop', // Womens
    3: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400&h=500&fit=crop'  // Accessories
  };

  for (const product of products) {
    const defaultImage = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=500&fit=crop';
    const newUrl = categoryImages[product.categoryId] || defaultImage;
    
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl }
    });
  }
  
  console.log('Images fixed successfully with real fashion photos!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
