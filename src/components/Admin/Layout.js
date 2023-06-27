import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import Navbar from '../Navbar'



const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />

      <div className="row mt-5">
        <div className='col-md-3'>
        <Sidebar />

        </div>
        <div className='col-md-9'>
          <main>{children}</main>
        </div>
      </div>
   

    </div>
  );
};

export default Layout;
