import React from 'react';
import { Grid, Header, Icon, Segment, List, Label } from 'semantic-ui-react';



export default function() {
  return (
    <Grid centered container columns='12' style={{ minHeight: '80vh' }}>
      <Grid.Column width='6' verticalAlign='middle'>
        <Segment placeholder style={{ padding: '1em 0 2em' }}>
          <Header as='h3' icon textAlign='center' style={{ margin: '1em 0' }}>
            <Icon name='home'/>
            Welcome to The Blog!
            <Header.Subheader>
              This application is developed as a test task.<br/>What features does this app have:
            </Header.Subheader>
          </Header>
          <List>
            <List.Item content='Sign up/Login, edit Profile'/>
            <List.Item content='Create posts in a shared feed'/>
            <List.Item content='View posts feed'/>
            <List.Item content='Comment posts'/>
          </List>
          <List>
            <Label>
              <Icon name='bitbucket'/>
              <a href='https://bitbucket.org/vlad-dewitt/the-blog' target='_blank' rel='noopener noreferrer'>Source Code</a>
            </Label>
            <Label>
              <Icon name='mail'/>
              <a href='mailto:dewitt.official@gmail.com'>dewitt.official@gmail.com</a>
            </Label>
          </List>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
