import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { potholesReducer, singlePotholeReducer } from './potholes'
import report from './report'
import user from './user'

const reducer = combineReducers({
  potholes: potholesReducer,
  singlePothole: singlePotholeReducer,
  report,
  user,
})

const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
))
const store = createStore(reducer, middleware)

export default store


export * from './potholes'
export * from './user'
