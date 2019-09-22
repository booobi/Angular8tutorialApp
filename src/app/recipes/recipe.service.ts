import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingridient } from '../shared/ingridient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingLit from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
    // recipes: Recipe[] = [
    //     new Recipe("Schznitzel with fries", 
    //     "Best schnitzel EU", 
    //     "https://cdn.pixabay.com/photo/2016/11/19/02/22/schnipo-1837703_960_720.jpg",
    //     [new Ingridient("Meat", 1),new Ingridient("French Fries", 20)]),
        
    //     new Recipe("Burger", 
    //     "This is the tastiest burger", 
    //     "https://live.staticflickr.com/1939/30724632707_aa69612b75_b.jpg",
    //     [new Ingridient("Buns", 2), new Ingridient("Meat", 1)])
    //   ];
    recipes: Recipe[] = [];
    recipesChanged = new Subject<Recipe[]>();
    
    constructor(private slService: ShoppingListService, private store: Store<fromShoppingLit.AppState>){
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipe(id: number) {
        return this.recipes[id];
    }

    getRecipes() {
        return this.recipes.slice();
    }

    addIngridientsToShoppingList(ingridients: Ingridient[]) {
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingridients));
        // this.slService.addIngridients(ingridients);
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    } 
}