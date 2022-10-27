import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {fetch2} from './helper/fetch'
export const initialState = {
    token:"",
    loading: false,
    error:""
}

export const signupUser = createAsyncThunk(
    'signupuser',
    async(body, state)=>{
        state= initialState
      const result = await fetch2('/signup', body,"post")
      return result
    }
)

export const signinUser = createAsyncThunk(
    'signinuser',
    async(body)=>{
      const result = await fetch2('/signin', body,"post")
      return result
    }
)

export const authReducer = createSlice({
    name:"user",
    initialState,
    reducers:{
        addToken:(state, action) => {
            state.token = localStorage.getItem('token')
        },
        Logout:(state, action) => {
            state.token = null
            localStorage.removeItem('token')
        }
    },
    extraReducers:{
        [signupUser.fulfilled]:(state, action) => {
            state.loading = false
            if(action.payload.error){
                state.error = action.payload.error
            }
            else{
                state.error = action.payload.message
            }
        },
        [signupUser.pending]:(state, action) => {
            state.loading = true
        },
        [signinUser.fulfilled]:(state, action) => {
            state.loading = false
            if(action.payload.error){
                state.error = action.payload.error
            }
            else{
                state.token = action.payload.token
                localStorage.setItem('token', state.token)
            }
        },
        [signinUser.pending]:(state, action) => {
            state.loading = true
        },
    }
})
export const {addToken, Logout} = authReducer.actions 
export default authReducer.reducer