import { createStore as reduxCreateStore } from "redux"
import reducer from './reducer';

const createStore = () => reduxCreateStore(reducer)
export default createStore