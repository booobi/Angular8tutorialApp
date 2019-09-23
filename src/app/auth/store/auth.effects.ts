import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    
    const expirationDate = new Date(new Date().getTime() + +expiresIn*1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
                return new AuthActions.authenticateSuccess({
                    email: email,
                    userId: userId, 
                    token: token, 
                    expirationDate: expirationDate,
                    redirect: true
                })
};
const handleError = (errorResponse: any) => {
    let errorMsg = "An uncommon error has occured!";
        console.log(errorResponse);
        if(!errorResponse.error && !errorResponse.error.error) {
            return of(new AuthActions.authenticateFail(errorMsg));
        }

        switch(errorResponse.error.error.message) {
            case "EMAIL_EXISTS":
                errorMsg = "This email already exists!";
                break;
            case "EMAIL_NOT_FOUND":
                errorMsg = "This email does not exist!";
                break;
            case "INVALID_PASSWORD":
                errorMsg = "This password is not correct!";
                break;
        }
                return of(new AuthActions.authenticateFail(errorMsg));
};


@Injectable()
export class AuthEffects {

    @Effect() authSignUp = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.signupStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {   
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
        }).pipe(
            tap(responseData => {
                this.authService.setLogoutTimer(+responseData*1000);
            }),
            map(responseData => {
                return handleAuthentication(+responseData.expiresIn, responseData.email, responseData.localId, responseData.idToken);
        }),
            catchError(errorResponse => {
                return handleError(errorResponse);
        })
            )
    })
)

    @Effect() authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData:AuthActions.loginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {   
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        }).pipe(
            tap(responseData => {
                this.authService.setLogoutTimer(+responseData.expiresIn*1000);
            }),
            map(responseData => {
                return handleAuthentication(+responseData.expiresIn, responseData.email, responseData.localId, responseData.idToken);
            }),
            catchError(errorResponse => {
                return handleError(errorResponse);
    }))
    }
    ))

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.authenticateSuccess)=> { 
            if(authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        }))

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT), 
        tap(()=>{
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTOLOGIN),
        map(()=> {
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'));
            if(!userData) {
                return {type: 'DUMMY'};
            }
    
            const userDate = new Date(userData._tokenExpirationDate);
            const loadedUser = new User(userData.email, userData.id, userData._token, userDate);
    
            if(loadedUser.token) {
                const expirationDuration = userDate.getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.authenticateSuccess({
                    email: loadedUser.email, 
                    userId: loadedUser.id, 
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                    });
            }

            return {type: 'DUMMY'};
        })
    );

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}