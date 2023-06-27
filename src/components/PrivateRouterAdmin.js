import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

const PrivateRouterAdmin = ({ component: Component, auth, ...rest }) => {
    const token = useSelector((state) => state.auth.data.token);
    const level = useSelector((state) => state.auth.data.level);
    return (
      <Route
        {...rest}
        render={(props) =>
          (token == null || level != 2) ? <Redirect to="/admin/login" /> : <Component {...props} />
        }
      />
    );
  };
  
  const mapStateToProps = ({ auth }) => {
    return {
      auth,
    };
  };
  
  export default connect(mapStateToProps)(PrivateRouterAdmin);