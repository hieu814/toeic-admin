import { configureStore } from '@reduxjs/toolkit'
import global from '../stores/global'

const rootReducer = {
  global,
}

const store = configureStore({
  reducer: rootReducer,
})
export default store
