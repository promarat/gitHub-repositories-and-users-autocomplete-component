import { useCallback } from 'react';
import { searchUsers, searchRepositories } from '../../api/api';
import { SearchResultType } from '../../types/types';
import './AutoComplete.css';
import SEARCH_ICON from '../../assets/images/search.svg';

const DISPLAY_LIMIT = 50;
const AutoComplete = () => {
  // const [query, setQuery] = useState<string>('');

  const debounce = (func: Function, timeout: number) => {
    let timerId: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => func.apply(this, args), timeout);
    };
  };

  const onQuery = async (query: string) => {
    if (!query || query.length < 3) {
      return;
    }

    const [users, repos] = await Promise.all([
      searchUsers(query),
      searchRepositories(query),
    ]);

    const suggestions: SearchResultType[] = [...users, ...repos]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(DISPLAY_LIMIT);
    console.log(suggestions);
  }

  const handleChange = useCallback(debounce(onQuery, 500), []);

  return (
    <div className="searchform">
      <input
        type="text"
        placeholder="Search for github users and repositories"
        className="searchform-input"
        onChange={(e) => handleChange(e.target.value)}
      />
      <img src={SEARCH_ICON} alt="" className="searchform-icon" />
    </div>
  );
}

export default AutoComplete;
