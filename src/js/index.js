import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
- search object
- current recipe object
- shopping list object
- liked recipes
*/
const state = {};

const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput();

    if(query) {
        // new search object and add to state
        state.search = new Search(query);               //create new search object 

        //prepare UI for results
        searchView.clearInput();                        //clear textfields
        searchView.clearResults();                      //clear search results
        renderLoader(elements.searchRes);               //load spinner


        //search for recipes
        await state.search.getResults();                //get search result and return a promise

        //render results on UI
        clearLoader();                                  //clear spinner
        searchView.renderResults(state.search.result);  //load results

    }
}

elements.searchForm.addEventListener('submit', e => {   //button click event
    e.preventDefault();                                 //prevent page from reloading
    controlSearch();                                    //init
});
