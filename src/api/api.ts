import axios from 'axios';
import { GithubResponse } from '../types/types';

export const PER_PAGE = 50;

const github = axios.create({
  baseURL: 'https://api.github.com/',
});

const token = process.env.USER_SEARCH_OAUTH;
if (token) {
  github.defaults.headers.common.Authorization = `token ${token}`;
}

const searchUsers = async (query: string): Promise<GithubResponse> => {
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
        const result = response.data?.items.map((item: any) => {
          return {
            type: 'user',
            name: item.login,
            login: item.login,
          };
        });
        return { status: response.status, result };
      } else {
        return { status: response.status, result: [] };
      }
    })
    .catch(error => {
      return { status: error.response.status, result: [] };
    });
}

const searchRepositories = async (query: string): Promise<GithubResponse> => {
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
        const result = response.data?.items.map((item: any) => {
          return {
            type: 'repo',
            name: item.name,
            login: item.owner.login,
          };
        });
        return { status: response.status, result };
      } else {
        return { status: response.status, result: [] };
      }
    })
    .catch(error => {
      return { status: error.response.status, result: [] };
    });
}

export {
  searchUsers,
  searchRepositories,
};
