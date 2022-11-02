# Github User & Repository Search

Search and view users via the Github API - https://github-user-repo-search.web.app/

GitHub allows everyone to check user pages, public repositories. Github API require auth token to fetch datas from github and it is stored in .env file.

You should set `REACT_APP_USER_SEARCH_OAUTH` as your github auth token.

## How to generate github auth token?

Register GitHub, then click on your avatar in the upper right corner, enter `Settings`, click on the left to enter `Developer Settings`, and generate a `Personal Access Token`.

Remember: You should check `repo`:`public_repo` and `user`:`user:user` to read public repositories and user profile data.

## Match requirements

* Don’t use an existing autocomplete library (even if in real life this would be preferred).
* Minimal chars number to initialize search: 3.
* Result items are combined and displayed alphabetically using repository and profile name as ordering keys.
* Number of result items should be limited to 50 per request.
* The component should give visual feedback for when the data is being fetched, the results are empty, or the request resulted in an error.
* The component supports keyboard strokes (up and down arrows to browse the results, enter to open a new tab with the repository/user page).
* The solution should also display a meaningful snippet of your ability to test the code.

## Tech stack

* React
* TypeScript
