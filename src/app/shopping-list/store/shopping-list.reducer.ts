import { Ingridient } from '../../shared/ingridient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingridients: Ingridient[],
    editedIngredient: Ingridient,
    editedIngredientIndex: number 
}

export interface AppState {
    shoppingList: State
}

 const initialState: State = {
    ingridients: [
        new Ingridient("Apples", 5),
        new Ingridient("Tomatoes", 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(state: State=initialState, action: ShoppingListActions.ShoppingListActions) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: {
            return {
                ...state,
                ingridients: [
                    ...state.ingridients,
                    action.payload
                ]
            }
        }

        case ShoppingListActions.ADD_INGREDIENTS: {
            return {
                ...state,
                ingridients: [
                    ...state.ingridients,
                    ...action.payload
                ]
            };
        }

        case ShoppingListActions.UPDATE_INGREDIENT: {
            const ingredient = state.ingridients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };
            const updatedIngredientList = [...state.ingridients];
            updatedIngredientList[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingridients: updatedIngredientList
            }
        }

        case ShoppingListActions.DELETE_INGREDIENT: {
            return {
                ...state,
                ingridients: state.ingridients.filter((ingredient,index) => {
                    return index != state.editedIngredientIndex;
                }),
                editedIngredient: null,
                editedIngredientIndex: -1
            }
        }

        case ShoppingListActions.START_EDIT: {
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingridients[action.payload]}
            }
        }

        case ShoppingListActions.STOP_EDIT: {
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            }
        }

        default: return state;
    }
}