import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import Likes from './models/Likes';

/* Global state of the app
- search object
- current recipe object
- shopping list object
- liked recipes
*/
const state = {};
window.state = state;

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch(error) {
            alert('Error processing recipe');
        }
        
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/*
****** LIST CONTROLLER *****
*/
const controlList = () => {
    //create a new list is there is none yet    
    if(!state.list) state.list = new List();

    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete state
        state.list.deleteItem(id);

        //delete form ui
        listView.deleteItem(id);

    //handle count update
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});

/*
****** LIKE CONTROLLER *****
*/
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        //add likes to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //toggle the like button
        likesView.toggleLikeBtn(true);


        //add like to UI list
        likesView.renderLike(newLike);

    //user has liked current recipe
    } else {
        //remove likes to the state
        state.likes.deleteLike(currentID);

        //toggle the like button
        likesView.toggleLikeBtn(false);

        //remove like to UI list
        likesView.deleteLike(currentID);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


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
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //add ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //like controller
        controlLike();
    }
});

window.l = new List();