import { takeLatest, put, all, call} from 'redux-saga/effects';
import UserActionTypes from './user.types';
import {auth, googleProvider, createUserProfileDocument, getCurrentUser} from '../../firebase/firebase.utils';
import {
    signInSuccess,
    signInFailure,
    signOutFailure,
    signOutSuccess
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

export function* onGoogleSignInStart() {
    yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle)
}

export function* signInWithEmail({payload: {email, password}}) {
    try {
        const {user} = yield auth.signInWithEmailAndPassword(email, password);
        yield getSnapshotFromUserAuth(user);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* onEmailSignInStart() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail)
}

export function* userSagas() {
    yield all([call(onGoogleSignInStart), call(onEmailSignInStart), call(onCheckUserSession), call(onSignOutStart)]);
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

export function* onCheckUserSession() {
    yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* signOut() {
    try {
        yield auth.signOut();
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signOutFailure(error));
    }
}

export function* onSignOutStart() {
    yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}