import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Feed from '../components/feed';
import Post from './post';



export default function(props) {
  return (
    <Switch>
      <Route exact path={ ['/feed', '/feed/create'] } render={ () => <Feed { ...props }/> }/>
      <Route path='/feed/:id' component={ Post }/>
      <Redirect from='*' to='/feed'/>
    </Switch>
  );
}
