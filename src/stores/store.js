import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import global from '../stores/global'
import { authApi } from 'src/api/auth';
import { usersApi } from 'src/api/user';
const rootReducer = {
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  global,
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(authApi.middleware,usersApi.middleware),
})
export default store

