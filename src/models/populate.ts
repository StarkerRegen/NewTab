import { db } from "./db";

export async function populate() {
  const now = new Date();
  const cardId = await db.cards.add({
    title: "Card 1",
    description: "Card 1 description",
    createdAt: now,
    updatedAt: now,
  });

  const cardIdNumber = Number(cardId);

  await db.cardItems.bulkAdd([
    {
      cardId: cardIdNumber,
      title: "Item 1",
      url: "https://www.google.com",
      createdAt: now,
      updatedAt: now,
    },
    {
      cardId: cardIdNumber,
      title: "Item 2",
      url: "https://www.google.com",
      createdAt: now,
      updatedAt: now,
    },
  ]);
}
