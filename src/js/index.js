import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
- search object
- current recipe object
- shopping list object
- liked recipes
*/
const state = {};

/*
****** SEARCH CONTROLLER *****
*/
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

        try {
            //search for recipes
            await state.search.getResults();                //get search result and return a promise

            //render results on UI
            clearLoader();                                  //clear spinner
            searchView.renderResults(state.search.result);  //load results
        } catch(error) {
            alert('Something went wrong with the search');
            clearLoader();
        }
        

    }
}

elements.searchForm.addEventListener('submit', e => {   //button click event
    e.preventDefault();                                 //prevent page from reloading
    controlSearch();                                    //init
});

//event listener for button click that is closest
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');                    //click on prev or next btn
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);    //load results
    }
});

/*
****** RECIPE CONTROLLER *****
*/
const controlRecipe = async () => {
    // get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
        if(state.search){
            searchView.highLightSelected(id);
        }

        //create new recipe object
        state.recipe = new Recipe(id);

        try {
            //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            alert('Error processing recipe');
        }
        
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe btn clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) { //* - any child
        //Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
});