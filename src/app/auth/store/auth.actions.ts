import { Action } from '@ngrx/store';


export const LOGIN_START = 'LOGIN_START';
export const AUTHENTICATE_SUCCESS = 'LOGIN';
export const AUTHENTICATE_FAIL = 'LOGIN_FAILED';
export const LOGOUT = 'LOGOUT';
export const SIGNUP_START = 'SIGNUP_START';
export const SIGNUP = 'SIGNUP';
export const CLOSE_ALERT = 'CLOSE_ALERT';
export const AUTOLOGIN = 'AUTOLOGIN';

export class authenticateSuccess implements Action{
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {email:string, userId: string, token: string, expirationDate: Date, redirect: boolean}) {}
}

export class logout implements Action {
    readonly type = LOGOUT;
}

export class loginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class authenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
    constructor(public payload: string) {}
}

export class signupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class closeAlert implements Action {
    readonly type = CLOSE_ALERT;
}

export class autoLogin implements Action {
    readonly type = AUTOLOGIN;
}
export type AuthActions = authenticateSuccess | logout | loginStart | authenticateFail | signupStart | closeAlert | autoLogin;