interface ActiveTab extends Tab {
  id?: number;
  url: string;
  title: string;
  favIconUrl?: string;
  windowId?: number;
}

interface Tab {
  id?: number;
  url: string;
  title: string;
  favIconUrl?: string;
}
