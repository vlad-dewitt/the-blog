import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container, Dimmer, Loader } from 'semantic-ui-react';

import { verify } from './api/user';

import Menu from './components/menu';
import Auth from './pages/auth';
import Home from './pages/home';
import Feed from './pages/feed';
import Profile from './pages/profile';



export default function App() {
  const [user, setUser] = React.useState({
    isAuthenticated: false,
    userId: '',
    username: '',
    profile: {},
    token: ''
  });
  const [loading, setLoading] = React.useState(true);
  const [feed_length, setFeedLength] = React.useState('...');



  useEffect(() => {
    async function onMount() {
      const auth_data = await verify();
      if (auth_data) {
        auth(auth_data);
      }
      setLoading(false);
    }
    onMount()
  }, [])

  const auth = (data) => {
    if (data !== null) {
      setUser({
        isAuthenticated: true,
        ...data
      })
    } else {
      setUser({
        isAuthenticated: false,
        userId: '',
        token: ''
      })
    }
  }

  const feedLengthProps = {
    feed_length: feed_length,
    setFeedLength: (length) => setFeedLength(length)
  }



  return (
    loading ?
      <Dimmer active>
        <Loader/>
      </Dimmer>
    :
      user.isAuthenticated ?
        <Container style={{ padding: '64px 0' }}>
          <Menu { ...feedLengthProps }/>
          <Switch>
            <Route exact path='/' component={ Home }/>
            <Route path='/feed' render={ () => <Feed { ...feedLengthProps }/> }/>
            <Route path='/profile' render={ () => <Profile user={ user } onAuth={ auth }/> }/>
            <Redirect from='*' to='/'/>
          </Switch>
        </Container>
      :
        <Switch>
          <Route exact path='/login' render={ () => <Auth onAuth={ auth }/> }/>
          <Redirect from='*' to='/login'/>
        </Switch>
  );
}
