/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from 'react-redux';

//option describe
//null  =>  Anyone Can go inside
//true  =>  only logged in user can go inside
//false =>  logged in user can't go inside

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      //To know my current status, send Auth request
      dispatch(auth()).then(response => {
        //Not Loggined in Status
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push('/login');
          }
          //Loggined in Status
        } else {
          //supposed to be Admin page, but not admin person wants to go inside
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push('/');
          }
          //Logged in Status, but Try to go into log in page
          else {
            if (option === false) {
              props.history.push('/');
            }
          }
        }
      });
    }, []);

    return <SpecificComponent {...props} user={user} />;
  }
  return AuthenticationCheck;
}

/*
  auth를 체크해서 user가 component에 들어갈 수 있는지의 자격을 체크해서
  auth인증이 된다면 해당 component로 보내주고 안된다면 다른 page로 보내는 역할
*/
