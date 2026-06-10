import { RouterProvider } from 'react-router-dom'
import { appRouter } from '../routes'

const AppRouterProvider = () => {
  return <RouterProvider router={appRouter} />
}

export default AppRouterProvider
