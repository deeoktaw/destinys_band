export type Track = {
  id: string;
  title: string;
  src: string;
  albumId: string;
};

export type Album = {
  id: string;
  title: string;
  note?: string;
  tracks: Track[];
};

export type Catalog = {
  albums: Album[];
};
