import { useCallback, useRef, useState } from 'react';
import Spinner from '../spinner/Spinner';
import { searchUsers, searchRepositories } from '../../api/api';
import { SearchResultType } from '../../types/types';
import './AutoComplete.css';
import SEARCH_ICON from '../../assets/images/search.svg';

const DISPLAY_LIMIT = 50;
const SEARCH_THRESHOLD = 3;

const AutoComplete = () => {
  const [filtered, setFiltered] = useState<SearchResultType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);
  const queryRef = useRef<HTMLInputElement>(null);

  const debounce = (func: Function, timeout: number) => {
    let timerId: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => func.apply(this, args), timeout);
    };
  };

  const onQuery = async (query: string) => {
    setError(false);
    if (!query || query.length < SEARCH_THRESHOLD) {
      setFiltered([]);
      return;
    }

    setLoading(true);
    const [users, repos] = await Promise.all([
      searchUsers(query),
      searchRepositories(query),
    ]);

    setLoading(false);
    if (users.status !== 200 || repos.status !== 200) {
      setError(true);
      return;
    }

    const suggestions: SearchResultType[] = [...users.result, ...repos.result]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(DISPLAY_LIMIT);
    setFiltered(suggestions);
    setActive(0);
  }

  const handleChange = useCallback(debounce(onQuery, 500), []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) { // enter
      const suggestion: SearchResultType = filtered[active];
      const url = `https://github.com/${suggestion.login}${suggestion.type === 'repo' ? `/${suggestion.name}` : ""}`;
      if (queryRef?.current) {
        queryRef.current.value = suggestion.name;
      }
      const win = window.open(url, '_blank');
      if (win != null) {
        win.focus();
      }
    } else if (e.keyCode === 38) { // arrow up
      return active === 0 ? null : setActive(active - 1);
    } else if (e.keyCode === 40) { // arrow down
      return active - 1 === filtered.length ? null : setActive(active + 1);
    }
  }

  const renderSuggestions = () => {
    if (queryRef?.current?.value && queryRef.current.value.length >= SEARCH_THRESHOLD) {
      if (filtered.length) {
        return (
          <ul className="suggestions">
            {filtered.map((suggestion, index) => (
              <li
                key={`suggestion-${index}`}
                className={`${index === active ? "suggestion-active" : ""}`}
              >
                <a
                  href={`https://github.com/${suggestion.login}${suggestion.type === 'repo' ? `/${suggestion.name}` : ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="suggestion"
                >
                {suggestion.name}
                </a>
              </li>
            ))}
          </ul>
        );
      } else if (error) {
        return (
          <div className="api-error">
            <em>API error</em>
          </div>
        )
      } else if (!loading) {
        return (
          <div className="no-suggestion">
            <em>Not found</em>
          </div>
        );
      }
    } else {
      return <></>;
    }
  }

  return (
    <div className="searchform">
      <input
        type="text"
        placeholder="Search for github users and repositories"
        className="searchform-input"
        ref={queryRef}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {loading ? (
        <div className="searchform-icon">
          <Spinner />
        </div>
      ) : (
        <img src={SEARCH_ICON} alt="" className="searchform-icon" />
      )}
      {renderSuggestions()}
    </div>
  );
}

export default AutoComplete;
