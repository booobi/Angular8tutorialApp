import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Ingridient } from 'src/app/shared/ingridient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editedItem: Ingridient;

  @ViewChild('f', {static:false}) form:NgForm; 

  constructor(private slService: ShoppingListService, private store: Store<fromShoppingList.AppState>) { }
 
  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex != -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
    // this.subscription = this.slService.startedEditing.subscribe((index: number) => {
    //   this.editMode = true;
    //   this.editedItemIndex = index;
    //   this.editedItem = this.slService.getIngridient(index);
    //   this.form.setValue({
    //     name: this.editedItem.name,
    //     amount: this.editedItem.amount
    //   })
    // });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngridient: Ingridient = new Ingridient(value.name, value.amount);
    if(this.editMode) {
      // this.slService.updateIngridient(this.editedItemIndex, newIngridient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngridient));
    } else {
      // this.slService.addIngridient(newIngridient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngridient));
    }
    this.editMode = false;
    this.form.reset();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.slService.deleteIngridient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.form.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
