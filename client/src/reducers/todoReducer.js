import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {fetch2, fetch3} from './helper/fetch'

const initialState =[]
   

export const ADD_TODO = createAsyncThunk(
    'addTodo',
    async (body) =>{
        const result = await fetch2('/createtodo', body, "post")
        return result
    }
)
export const GET_TODO = createAsyncThunk(
    'gettodo',
    async () => {
        const result = await fetch3('/gettodos',"get")
        return result
    } 
)

export const DELETE_TODO = createAsyncThunk(
    'deletetodo',
    async (id) => {
        const result = await fetch3(`/remove/${id}`,"delete")
        return result
    } 
)

export const UPDATE_TODO = createAsyncThunk(
    'updatetodo',
    async (body) => {
        console.log(body)
        const result = await fetch2(`/update/${body.id}`, body,"put")
        return result
    } 
)

export const todoReducer = createSlice({
    name:"todo",
    initialState,
    reducers:{
    },
    extraReducers:{
        [ADD_TODO.fulfilled]:(state, action) => {
            if(action.payload.message){
                state.push(action.payload.message)
            }
        },
        [ADD_TODO.pending]:(state, action) => {
           
        },
        [GET_TODO.fulfilled]:(state, {payload:{message}}) => {
            console.log(message)
            return message
        },
        
        [DELETE_TODO.fulfilled]:(state, {payload:{message}}) => {
            if(message){
                const removeTodo = state.filter((item) => {
                   return item._id !== message._id
                })
                 return removeTodo
            }
        },
        [UPDATE_TODO.fulfilled]:(state, {payload:{message}}) => {
            return message
        },
    }
})


export default todoReducer.reducer