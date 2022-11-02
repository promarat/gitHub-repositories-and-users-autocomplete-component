import axios from 'axios';
import { SearchResultType } from '../types/types';

export const PER_PAGE = 50;

const github = axios.create({
  baseURL: 'https://api.github.com/',
});

const token = process.env.USER_SEARCH_OAUTH;
if (token) {
  github.defaults.headers.common.Authorization = `token ${token}`;
}

const searchUsers = async (query: string): Promise<SearchResultType[]> => {
  const params = {
    q: query,
    per_page: PER_PAGE,
  };
  return github
    .get('/search/users', {
      params,
    })
    .then(response => {
      if (response.status === 200) {
        return response.data?.items.map((item: any) => {
          return {
            type: 'user',
            name: item.login,
            login: item.login,
          };
        });
      } else {
        return [];
      }
    });
}

const searchRepositories = async (query: string): Promise<SearchResultType[]> => {
  const params = {
    q: query,
    per_page: PER_PAGE,
  };
  return github
    .get('/search/repositories', {
      params,
    })
    .then(response => {
      if (response.status === 200) {
        return response.data?.items.map((item: any) => {
          return {
            type: 'repo',
            name: item.name,
            login: item.owner.login,
          };
        })
      } else {
        return [];
      }
    });
}

export {
  searchUsers,
  searchRepositories,
};
