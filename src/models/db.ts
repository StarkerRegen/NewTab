import Dexie, { Table } from "dexie";
import { Card } from "./Card";
import { CardItem } from "./CardItem";
import { populate } from "./populate";
import * as DexieBackup from "dexie-export-import";

export class TabDB extends Dexie {
  cards!: Table<Card, string>;
  cardItems!: Table<CardItem, string>;

  constructor() {
    super("TabDB");

    // Define the schema
    this.version(1).stores({
      cards: "++id",
      cardItems: "++id, cardId",
    });
  }

  deleteCard(cardId: string) {
    return this.transaction("rw", this.cardItems, this.cards, () => {
      this.cardItems.where({ cardId }).delete();
      this.cards.delete(cardId);
    });
  }
}

export const db = new TabDB();

db.on("populate", populate);

export const exportDB = async () => {
  try {
    const blob = await DexieBackup.exportDB(db, { prettyJson: true });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Create a link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = `NewTab-${timestamp}.json`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    return blob;
  } catch (error) {
    console.error("" + error);
  }
};

export const importJson = async (file: File) => {
  await db.delete();
  await DexieBackup.importDB(file);
  window.location.reload();
};
