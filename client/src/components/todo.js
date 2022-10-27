import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ADD_TODO, GET_TODO, DELETE_TODO, UPDATE_TODO} from '../reducers/todoReducer'
import {Logout} from '../reducers/authReducer'

function Todo() {
    const [myTodo, setTodo]  = useState("")
    const [todoHandle, settodoHandle] = useState("ADD TODO")
    const [key, setKey] = useState("")
    const dispatch = useDispatch()
    const Todo = useSelector(state=>state.todo)
    const addTodo = (myTodo) => {
        dispatch(ADD_TODO({todo:myTodo}))
    }

    const deleteTodo = (id) => {
        dispatch(DELETE_TODO(id))
    }

    const UpdateTodo = (key,myTodo) => {
        dispatch(UPDATE_TODO({id: key,todo:myTodo}))
    }

  useEffect((state)=>{
    dispatch(GET_TODO())
 
  },[dispatch])
    return (
        <div>
            
             <input
            type="text"
            placeholder="Enter todo here"
            value={myTodo}
            onChange={(e) => setTodo(e.target.value)}
            />
            
            <button 
            className="btn"
            
                
                onClick={() =>{
                    todoHandle === "ADD TODO"?
                    addTodo(myTodo):
                    UpdateTodo(key,myTodo)
                } 
                }
                
                
            
            >
            {todoHandle}
            </button>
            

           
            <ul className="collection with-header">
                <li className="collection-header"><h4>Todo List</h4></li>

                
                {
                    Todo.map((item) => {
                        return (
                            <li className="collection-item" key={item._id}><div>{item.todo}
                        <a href="#!" className="secondary-content">
                        <i className="material-icons" onClick={() => {
                            settodoHandle("UPDATE TODO")
                            setKey(item._id)
                        }} >edit</i> 
                        <i className="material-icons" onClick={() => {deleteTodo(item._id)}}>delete</i>
                        </a></div></li>
                        )
                    })
                }     
            </ul>
                
            

            <button 
            className="btn"
            onClick={() =>{dispatch(Logout())}} >
            Logout
            </button>
                
            
            
        </div>
    )
}

export default Todo
