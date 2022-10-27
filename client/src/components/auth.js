import React, {useState} from 'react'
import {signinUser, signupUser} from '../reducers/authReducer'
import {useDispatch, useSelector} from 'react-redux'
function Auth() {
    const dispatch = useDispatch()
    const {loading, error} = useSelector(state => state.user)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [auth, setAuth] = useState('Sign in')
    const authenticate = () =>{
        if(auth === 'Sign in'){
            dispatch(signinUser({email, password}))
        }
        else{
            dispatch(signupUser({email,password}))
        }
    }
    
    return (
        <div>
            {
                loading &&
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            }
            <h1>Please {auth}</h1>
            <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            {
                error &&
                <h6 style={{color: "red"}}>{error}</h6>
            }

            {
                auth === "Sign in"?
                <h6 onClick={() =>{setAuth("Sign up")}}> Don't have an account?</h6>:
                <h6 onClick={() =>{setAuth("Sign in")}}> Already have an account?</h6>
            }

            <button 
            className="btn"
            onClick={() => authenticate()}>
                {auth}
            </button>
        </div>
    )
}

export default Auth