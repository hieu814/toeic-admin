import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import {
  persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import global from '../stores/global'
import { authApi } from 'src/api/auth';
import { usersApi } from 'src/api/user';
import { examCategoryApi } from 'src/api/exam_category';
import { examApi } from 'src/api/exam';
import { articleCategoryApi } from 'src/api/article_category';
import { questionApi } from 'src/api/question';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = {
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [examCategoryApi.reducerPath]: examCategoryApi.reducer,
  [examApi.reducerPath]: examApi.reducer,
  [articleCategoryApi.reducerPath]: articleCategoryApi.reducer,
  [questionApi.reducerPath]: questionApi.reducer,
  global: persistReducer(persistConfig, global),
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(
      {
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }
    ).concat(authApi.middleware, usersApi.middleware,
      examCategoryApi.middleware, examApi.middleware,
      articleCategoryApi.middleware, questionApi.middleware),
})

const persistor = persistStore(store)

export { store, persistor }
