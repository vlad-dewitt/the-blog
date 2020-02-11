import React from 'react';
import { Grid, Header, Icon, Image, Segment, Form, Container, Button, Message } from 'semantic-ui-react';

import { updateProfile, logout } from '../api/user';



export default function({ user, onAuth }) {
  const [mode, setMode] = React.useState('view');
  const [form, setForm] = React.useState({
    full_name: {
      value: user.profile.full_name || '',
      valid: null,
      validate: (value) => value.length >= 2
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({
    show: false,
    message: ''
  });



  const changeMode = (mode) => {
    setForm({
      full_name: { ...form.full_name, value: user.profile.full_name || '' }
    })
    setMode(mode);
  }

  const changeForm = e => {
    setForm({
      ...form,
      [e.target.name]: {
        ...form[e.target.name],
        valid: null,
        value: e.target.value
      }
    })
  }

  const onUpdateProfile = () => {
    let updated_form = { ...form };

    for (let key in form) {
      updated_form = {
        ...updated_form,
        [key]: {
          ...updated_form[key],
          valid: updated_form[key].validate(updated_form[key].value)
        }
      }
    }

    setForm(updated_form);

    if (updated_form.full_name.valid) {
      setLoading(true);
      const profile = {
        full_name: updated_form.full_name.value
      }
      updateProfile(profile).then(res => {
        setLoading(false);
        setError({ show: false, message: '' });
        onAuth(res);
        changeMode('view');
      }).catch(err => {
        setLoading(false);
        setError({ show: true, message: err })
      })
    }
  }

  const onLogout = async () => {
    await logout();
    onAuth(null);
  }



  return (
    <Grid centered container columns='12' style={{ minHeight: '80vh' }}>
      <Grid.Column width='6' verticalAlign='middle'>
        <Segment placeholder>
          <Header as='h3' icon textAlign='center' style={{ margin: '1em 0' }}>
            <Icon as={ Image } size='mini' circular src={ user.profile.avatar } style={{ width: 86, height: 86 }}/>
            { user.profile.full_name ? user.profile.full_name : user.username }
          </Header>
          <Form error={ error.show } loading={ loading } style={{ padding: '1em 0' }}>
            {
              mode === 'edit' ?
                <Container textAlign='left' style={{ marginBottom: '1em' }}>
                  <Form.Input
                    icon='user circle'
                    iconPosition='left'
                    name='full_name'
                    label='Full name'
                    placeholder='Your full name'
                    value={ form.full_name.value }
                    onChange={ changeForm }
                    error={ form.full_name.valid === false ? {
                      content: "Full name should contains minimum 2 symbols",
                      pointing: 'above'
                    } : false }
                  />
                  <Message
                    error
                    header='Error'
                    content={ error.message }
                    style={{ maxWidth: '15rem', margin: '0 auto' }}
                  />
                </Container>
              : null
            }
            {
              mode === 'view' ?
                <Button icon labelPosition='left' onClick={ () => changeMode('edit') }>
                  <Icon name='edit outline'/>
                  Update profile
                </Button>
              :
                <Container fluid textAlign='center' style={{ margin: '1em 0' }}>
                  <Button.Group>
                    <Button content='Save' primary onClick={ onUpdateProfile }/>
                    <Button.Or/>
                    <Button content='Cancel' secondary onClick={ () => changeMode('view') }/>
                  </Button.Group>
                </Container>
            }
            <Button size='small' compact icon labelPosition='right' onClick={ onLogout } style={{ marginTop: '3em' }}>
              <Icon name='log out'/>
              log out
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
