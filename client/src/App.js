import React,{useEffect} from 'react';
import './App.css';
import {useSelector,useDispatch} from 'react-redux'
import Todo from './components/todo'
import Auth from './components/auth'
import {addToken} from './reducers/authReducer'


function App() {
  const {token}= useSelector(state => state.user)

  const dispatch = useDispatch()
  
  useEffect(()=>{
    dispatch(addToken())
  },[dispatch])
  return (
    <div className="App">
    {
      token ===null ?
      <Auth /> :
      <Todo />
    }
      
    </div>
  );
}

export default App;
