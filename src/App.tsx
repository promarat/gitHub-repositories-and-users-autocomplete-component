import AutoComplete from './components/autocomplete/AutoComplete';
import GITHUB_MARK from './assets/images/mark-github.svg';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="app-header">
        <img src={GITHUB_MARK} alt="" width={24} height={24} />
        <h1 className="app-title">GitHub User & Repository Search</h1>
      </header>
      <AutoComplete />
    </div>
  );
}

export default App;
