import React from 'react';
import './sign-in-and-sign-up.styles.scss';
import SignIn from '../../components/sign-in/sign-in.component';
import {signInWithGoogle} from '../../firebase/firebase.utils';

const SignInAndSignUpPage = () => (
    <div className='sign-in-and-sign-up'>
        <SignIn />
    </div>
);

export default SignInAndSignUpPage;