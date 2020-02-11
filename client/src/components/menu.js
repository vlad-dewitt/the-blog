import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Label, Icon, Button } from 'semantic-ui-react';

import { getFeedLength } from '../api/feed';



export default function({ feed_length, setFeedLength }) {
  const { pathname: activePage } = useLocation();



  React.useEffect(() => {
    const updateFeedLength = async () => {
      const feed_length = await getFeedLength();
      setFeedLength(feed_length)
    }
    updateFeedLength()
  }, [setFeedLength]);



  return (
    <Menu fixed='top' borderless style={{ padding: '6px 10%' }}>
      <Menu.Item>
        <img src='/logo.png' alt="The Blog Logo"/>
      </Menu.Item>
      <Menu.Item as={ Link } to='/' name='home' active={ activePage === '/' }/>
      <Menu.Item as={ Link } to='/feed' name='feed' active={ activePage === '/feed' }>
        Feed
        <Label color='blue'>{ feed_length }</Label>
      </Menu.Item>
      <Menu.Menu position='right'>
        {
          activePage !== '/feed/create' ?
            <Menu.Item>
              <Button as={ Link } to='/feed/create' primary icon labelPosition='right'>
                Write Post
                <Icon name='write square'/>
              </Button>
            </Menu.Item>
          : null
        }
        <Menu.Item as={ Link } to='/profile' name='profile' active={ activePage === '/profile' }>
          <Icon name='user'/>
          Profile
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}
