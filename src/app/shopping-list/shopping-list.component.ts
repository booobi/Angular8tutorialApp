import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingridient } from '../shared/ingridient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingridients: Observable<{ingridients: Ingridient[]}>;
  private subscription: Subscription;

  constructor(private slService: ShoppingListService, public store: Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    this.ingridients = this.store.select('shoppingList')
    // this.subscription = this.slService.ingridientsChanged.subscribe((ingridients)=>this.ingridients = ingridients);
    // this.ingridients = this.slService.getIngridients();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  onEditItem(index) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index)); 
  }
}
