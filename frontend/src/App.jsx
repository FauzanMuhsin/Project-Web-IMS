import Register from './component/register'
import Login from './component/login'
import Dashboard from './component/dashboard'
import DataBarang from "./component/DataBarang"
import DataOrder from "./component/DataOrder"
import DataUsers from "./component/DataUsers"
import LogActivity from "./component/LogActivity"
import Sidebar from './component/Sidebar'
import FormTambah from './component/form-add'
import FormEdit from './component/formEdit'
import {Routes, Route} from 'react-router-dom'
import { AdminOnly } from './controller/AdminOnly'
import FormEditUser from './component/formEditUser'
import DataStock from './component/DataStock'
import FormEditStock from './component/formEditStock'
import Detail from './component/Detail'

// selain pake cara ini kita bisa juga pake LAYOUT WRAPPER
const AppContent = () => {
}

function App() {
  
  return (
    <>
    <AppContent/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route  element={<Sidebar/>}>
            <Route path='/register' element={<Register/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/DataBarang' element={<DataBarang/>} />
            <Route path='/DataOrder' element={<DataOrder/>} />
            <Route path='/DataStock' element={<DataStock/>} />
            <Route path='/DataUsers' element={<DataUsers/>} />
            <Route path='/Stock/Detail/:id' element={<Detail/>} />
            <Route path='/FormBarang' element={<FormTambah/>} />
            <Route path='/FormEdit/:id' element={<FormEdit/>} />
            <Route path='/FormEditUser/:id' element={<FormEditUser/>} />
            <Route path='/LogActivity' element={<LogActivity/>} />
            <Route path='/Stock/FormEditStock' element={<FormEditStock/>} />
          </Route>
        </Routes>
    </>
  )
}

export default App