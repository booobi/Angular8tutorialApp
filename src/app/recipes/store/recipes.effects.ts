import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipes.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipesEffects {
    @Effect() fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(()=>{
            return this.http.get<Recipe[]>(
                'https://ng-recipe-tutorial-53907.firebaseio.com/recipes.json');
        }),
        map(recipes => {
            console.log(recipes);
            return recipes.map( recipe => {
                
                return {...recipe, ingridients: recipe.ingridients ? recipe.ingridients : []};
            });
        }),
        map(recipes => {
            console.log("in next map");
            
            return new RecipesActions.SetRecipes(recipes);
        })
    );


    @Effect({dispatch: false}) 
    storeRecipes = this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.http.put('https://ng-recipe-tutorial-53907.firebaseio.com/recipes.json', recipesState.recipes); 
      })
    )

    // @Effect({dispatch: false})
    // storeRecipes = this.actions$.pipe(
    //   ofType(RecipesActions.STORE_RECIPES),
    //   withLatestFrom(this.store.select('recipes')),
    //   switchMap(([actionData, recipesState]) => {
    //     return this.http.put(
    //       'https://ng-course-recipe-book-65f10.firebaseio.com/recipes.json',
    //       recipesState.recipes
    //     );
    //   })
    // );

    constructor(private actions$: Actions, private http: HttpClient, private store:Store<fromApp.AppState>) {}
}