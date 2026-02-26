interface AllEmbedDataset {
  name: string;
  value: string;
  url: string;
}
export type AllEmbedDatasetArray = AllEmbedDataset[];
export type AllEpisodeDatasetArray = {
  number: number;
  episode: string;
  embed: AllEmbedDatasetArray;
}[];
