export type SearchResultType = {
  type: string,
  login: string,
  name: string,
};

export interface GithubResponse {
  status: number,
  result: SearchResultType[],
};
