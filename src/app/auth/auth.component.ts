import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import * as AuthActions from './/store/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../shopping-list/store/shopping-list.reducer';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit ,OnDestroy {
    storeSub: Subscription;
    
    ngOnInit(): void {
        this.storeSub = this.store.select('auth').subscribe(state => {
            this.isLoading = state.loading;
            this.error = state.authError;
            if(this.error) {
                this.showErrorAlert(this.error);
            }
        })
    }
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private errorSub: Subscription;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<AppState>) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        this.isLoading = true;
        const email = form.value.email;
        const password = form.value.password;

        if(this.isLoginMode) { 
            this.store.dispatch(new AuthActions.loginStart({email: email, password: password}));
         } else {
            this.store.dispatch(new AuthActions.signupStart({email: email, password: password}));
            }

        form.reset();
        
    }

    onHandleError(){
        this.store.dispatch(new AuthActions.closeAlert());
    }

    private showErrorAlert(errorMsg: string) {
        const alertComponentFactory = this
                                        .componentFactoryResolver
                                        .resolveComponentFactory(AlertComponent);

        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear()
        const compRef = hostViewContainerRef.createComponent(alertComponentFactory);

        compRef.instance.message = errorMsg;
        this.errorSub = compRef.instance.close.subscribe(()=> {
            this.errorSub.unsubscribe();
            hostViewContainerRef.clear();
        })

    }

    ngOnDestroy() {
        if(this.errorSub) {
            this.errorSub.unsubscribe();
        }
        if(this.storeSub) {
        this.storeSub.unsubscribe();
        }
    }
}