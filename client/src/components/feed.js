import React from 'react';
import { Route } from 'react-router-dom';
import { Grid, Feed, Segment, Header, Icon, Button } from 'semantic-ui-react';

import WritePost from '../components/write_post';
import Post from '../components/post';

import { getFeedLength, getPosts } from '../api/feed';



export default function({ feed_length, setFeedLength }) {
  const [loading, setLoading] = React.useState(true);
  const [feed, setFeed] = React.useState([]);



  React.useEffect(() => {
    updateFeed()
  }, []);

  React.useEffect(() => {
    const updateFeedLength = async () => {
      const feed_length = await getFeedLength();
      setFeedLength(feed_length)
    }
    updateFeedLength()
  }, [feed, setFeedLength]);



  const updateFeed = async () => {
    const posts = await getPosts();
    setFeed(posts);
    setLoading(false);
  }

  const loadMore = async () => {
    const new_posts = await getPosts(feed.length);
    setFeed([
      ...feed,
      ...new_posts
    ])
  }



  return (
    <Grid centered container columns='12' style={{ minHeight: '80vh' }}>
      <Grid.Column width='8' verticalAlign='middle'>
        {
          loading ?
            [1, 2, 3, 4, 5].map((num) => {
              return (
                <Post key={ num } placeholder/>
              )
            })
          :
            <>
              <Route path='/feed/create' render={ () => <WritePost onPostCreated={ updateFeed }/> }/>
              {
                feed.length === 0 ?
                  <Segment placeholder>
                    <Header as='h3' icon textAlign='center' style={{ margin: '1em 0' }}>
                      <Icon name='circle outline'/>
                      No posts found yet.
                    </Header>
                  </Segment>
                :
                  <Feed size='large'>
                    {
                      feed.map((post, num) => {
                        return (
                          <Post key={ post.id + num } post={ post }/>
                        )
                      })
                    }
                    {
                      feed_length > feed.length ?
                        <Button primary icon labelPosition='left' onClick={ loadMore }>
                          <Icon name='sort'/>
                          Show more
                        </Button>
                      : null
                    }
                  </Feed>
              }
            </>
        }
      </Grid.Column>
    </Grid>
  )
}
