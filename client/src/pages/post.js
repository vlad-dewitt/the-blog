import React from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Grid, Item, Icon, Label, Container, Comment as SComment, Header, Placeholder } from 'semantic-ui-react';

import WriteComment from '../components/write_comment';
import Comment from '../components/comment';

import { getPost } from '../api/feed';



export default function() {
  const params = useParams();
  const [loading, setLoading] = React.useState(true);
  const [post, setPost] = React.useState({});



  const updatePost = React.useCallback(async () => {
    const post_data = await getPost(params.id);
    setPost(post_data);
    setLoading(false);
  }, [params.id])



  React.useEffect(() => {
    updatePost()
  }, [updatePost])



  return (
    loading ?
      <Grid centered container columns='12' style={{ minHeight: '80vh' }}>
        <Grid.Column width='8' verticalAlign='middle'>
          <Placeholder fluid>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line/>
              <Placeholder.Line/>
              <Placeholder.Line/>
              <Placeholder.Line/>
              <Placeholder.Line/>
              <Placeholder.Line/>
              <Placeholder.Line length='short'/>
            </Placeholder.Paragraph>
          </Placeholder>
        </Grid.Column>
      </Grid>
    :
      <Grid centered container columns='12' style={{ minHeight: '80vh', paddingTop: '20vh' }}>
        <Grid.Column width='8' verticalAlign='middle'>
          <Item.Group>
            <Item>
              <Item.Image size='small' src={ post.author.profile.avatar } alt={ post.author.profile.full_name || post.author.username }/>
              <Item.Content style={{ marginTop: '2em', textAlign: 'left' }}>
                <Item.Header>{ post.author.profile.full_name || post.author.username }</Item.Header>
                <Item.Meta>
                  { moment(post.date_created).format('MMM Do YYYY, h:mm a') }
                </Item.Meta>
                <Item.Description style={{ margin: '1em 0' }}>
                  <p>{ post.text }</p>
                </Item.Description>
                <Label style={{ marginRight: '.5em' }}>
                  <Icon name='comment'/>
                  { post.comments.length }
                </Label>
              </Item.Content>
            </Item>
          </Item.Group>
          <Container textAlign='left' style={{ margin: '10em 0 6em' }}>
            <SComment.Group minimal>
              <Header as='h3' dividing>Comments</Header>
              {
                post.comments.length === 0 ?
                  <p>No comments yet</p>
                :
                  post.comments.map((comment, num) => {
                    return (
                      <Comment key={ num } data={ comment }/>
                    )
                  })
              }
              <WriteComment post_id={ post.id } onPostComment={ updatePost }/>
            </SComment.Group>
          </Container>
        </Grid.Column>
      </Grid>
  );
}
