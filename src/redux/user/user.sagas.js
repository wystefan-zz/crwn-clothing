import { takeLatest, put, all, call} from 'redux-saga/effects';
import UserActionTypes from './user.types';
import {auth, googleProvider, createUserProfileDocument, getCurrentUser} from '../../firebase/firebase.utils';
import {
    signInSuccess,
    signInFailure,
    signOutFailure,
    signOutSuccess,
    signUpFailure,
    signUpSuccess
  } from './user.actions';

  
export function* getSnapshotFromUserAuth(userAuth, additionalData) {
    try {
        const userRef = yield call(createUserProfileDocument, userAuth, additionalData);
        const userSnapshot = yield userRef.get();
        yield put(signInSuccess({id: userSnapshot.id, ...userSnapshot.data()}));
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signInWithGoogle() {
    try {
        const {user} = yield auth.signInWithPopup(googleProvider);
        yield getSnapshotFromUserAuth(user);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signInWithEmail({payload: {email, password}}) {
    try {
        const {user} = yield auth.signInWithEmailAndPassword(email, password);
        yield getSnapshotFromUserAuth(user);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

/*
    Because firebase method auth.onAuthStateChanged is not return a promise object which saga will need to rely on. We acheive that by creating a promise object 
    by creating a helper method in firebase utils which shows as below. In this getCurrentUser method, it will return a promise with resolved value of userAuth if
    userAuth returned by auth.onAuthStateChanged is not null. If it is null, the method will return a resolved value of null. If caught error, it will return reject value 
    of error.

    export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth);
        }, reject)
    })
}
*/
export function* isUserAuthenticated() {
    try {
        /*
         getCurrentUser is a helper method in firebase utils which created by wraping firebase auth.onAuthStateChanged method into method with a return value of promise type.
         */
        const {userAuth} = yield getCurrentUser(); 
        if (!userAuth) return; // if current user is null, directly return without updating the current user
        yield getSnapshotFromUserAuth(userAuth); // update the current user
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signOut() {
    try {
        yield auth.signOut();
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signOutFailure(error));
    }
}

export function* signUp({payload: {email, password, displayName}}) {
    try {
        // this creates user in authentication
        const {user} = yield auth.createUserWithEmailAndPassword(
            email,
            password
        );
        yield put(signUpSuccess({user, additionalData: {displayName}}));
    } catch (error) {
        yield put(signUpFailure(error));
    }
}

export function* signInAfterSignUp({payload: {user, additionalData}}) {
    yield getSnapshotFromUserAuth(user, additionalData);
}

export function* userSagas() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
    yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
    yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
    yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
    yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
    yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}
