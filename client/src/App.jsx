import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Registration from './Registration'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Home } from './Home'
import Login from './Login'
import Dashboard from './Dashboard'
import AddUsers from './AddUsers'
import Viewusers from './Viewusers'
import ProductDetails from './DetailsPage'
import UpdateProduct from './UpdateProduct'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/register' element={<Registration/> }></Route>
        <Route path='/login' element={<Login/> }></Route>
        <Route path='/dashboard' element={<Dashboard/> }></Route>
        <Route path='/addusers' element={<AddUsers/> }></Route>
        <Route path='/viewusers' element={<Viewusers/> }></Route>
        <Route path="/view/:id" element={<ProductDetails />} />
        <Route path="/update/:id" element={<UpdateProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
