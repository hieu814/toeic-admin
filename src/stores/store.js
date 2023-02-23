import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import global from '../stores/global'
import { authApi } from 'src/api/auth';
import { usersApi } from 'src/api/user';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = {
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  global: persistReducer(persistConfig, global),
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware),
})

const persistor = persistStore(store)

export { store, persistor }
