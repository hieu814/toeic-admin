import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import global from '../stores/global'
import { api } from 'src/api/auth';
const rootReducer = {
  [api.reducerPath]: api.reducer,
  global,
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(api.middleware),
})
export default store
