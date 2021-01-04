import {signOutSuccess} from '../user/user.actions';
import UserActionTypes from '../user/user.types';
import { all, call, takeLatest, put } from 'redux-saga/effects';
import {clearCart} from './cart.actions';

export function* clearCartOnSignOut() {
    yield put(clearCart());
}

export function* cartSagas() {
    yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}