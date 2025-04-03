import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a new inventory entry
  const newInventory = await prisma.inventory.create({
    data: {
      productId: 1, // Replace with the actual product ID
      stockLevel: 100, // Replace with the initial stock level
    },
  });

  console.log("Created inventory:", newInventory);

  // Fetch all inventory entries
  const allInventory = await prisma.inventory.findMany();
  console.log("All inventory:", allInventory);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });