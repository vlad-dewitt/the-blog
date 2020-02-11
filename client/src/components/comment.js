import React from 'react';
import moment from 'moment';
import { Comment } from 'semantic-ui-react';



export default function({ data }) {
  return (
    <Comment style={{ margin: '1em 0' }}>
      <Comment.Avatar as='a' src={ data.author.profile.avatar }/>
      <Comment.Content>
        <Comment.Author as='a'>
          { data.author.profile.full_name || data.author.username }
        </Comment.Author>
        <Comment.Metadata>
          <span>{ moment(data.date_created).format('MMM Do YYYY, h:mm a') }</span>
        </Comment.Metadata>
        <Comment.Text>{ data.text }</Comment.Text>
      </Comment.Content>
    </Comment>
  )
}
