export interface CardItem extends Tab {
  id?: number;
  title: string;
  url: string;
  favIconUrl?: string;
  cardId: number;
  createdAt: Date;
  updatedAt: Date;
}
