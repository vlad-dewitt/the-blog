import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Feed, Placeholder, Icon, Label } from 'semantic-ui-react';



export default function({ post, placeholder }) {
  if (placeholder) {
    return (
      <Placeholder fluid style={{ margin: '4em 0' }}>
        <Placeholder.Header image>
          <Placeholder.Line/>
          <Placeholder.Line length='full'/>
        </Placeholder.Header>
      </Placeholder>
    )
  }

  return (
    <Feed.Event style={{ margin: '2em 0' }}>
      <Feed.Label>
        <img src={ post.author.profile.avatar } alt={ post.author.profile.full_name || post.author.username }/>
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          { post.author.profile.full_name || post.author.username }
          <Feed.Date>{ moment(post.date_created).format('MMM Do YYYY, h:mm a') }</Feed.Date>
        </Feed.Summary>
        <Feed.Extra as={ Link } to={ `/feed/${ post.id }` } text>
          <p style={{ margin: '.5em 0' }}>{ post.text }</p>
        </Feed.Extra>
        <Label>
          <Icon name='comment'/>
          { post.comments }
        </Label>
      </Feed.Content>
    </Feed.Event>
  )
}
