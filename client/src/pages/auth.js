import React from 'react';

import { Grid, Container, Header, Icon, Segment, Form, Message, Button } from 'semantic-ui-react'

import { login, signUp } from '../api/user';



export default function({ onAuth }) {
  const [form, setForm] = React.useState({
    username: {
      value: '',
      valid: null,
      validate: (value) => value.length >= 4
    },
    password:  {
      value: '',
      valid: null,
      validate: (value) => value.length >= 6
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({
    show: false,
    message: ''
  });



  const changeForm = e => {
    setForm({
      ...form,
      [e.target.name]: {
        ...form[e.target.name],
        valid: null,
        value: e.target.value.replace(/[^A-z0-9._-]/g, "")
      }
    })
  }

  const submit = (type) => {
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

    if (updated_form.username.valid && updated_form.password.valid) {
      const action = type === 'login' ? login : signUp;
      setLoading(true);
      action(updated_form.username.value, updated_form.password.value).then(res => {
        setError({ show: false, message: '' });
        onAuth(res);
      }).catch(err => {
        setLoading(false);
        setError({ show: true, message: err })
      })
    }
  }



  return (
    <Grid centered container columns='12' verticalAlign='middle' style={{ minHeight: '90vh' }}>
      <Grid.Column width='6'>
        <Header as='h2' icon textAlign='center'>
          <Icon name='user outline'/>
          Authentication Page
          <Header.Subheader>
            Please login or sign up to continue.
          </Header.Subheader>
        </Header>
        <Segment placeholder style={{ margin: '3em 0', padding: '0' }} >
          <Form error={ error.show } loading={ loading } style={{ padding: '5em 0' }}>
            <Form.Input
              icon='user'
              iconPosition='left'
              name='username'
              label='Username'
              placeholder='Username'
              value={ form.username.value }
              onChange={ changeForm }
              error={ form.username.valid === false ? {
                content: "Username should contains minimum 4 symbols",
                pointing: 'above'
              } : false }
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
              value={ form.password.value }
              onChange={ changeForm }
              error={ form.password.valid === false ? {
                content: "Password should contains minimum 6 symbols",
                pointing: 'above'
              } : false }
            />
            <Message
              error
              header='Error'
              content={ error.message }
              style={{ maxWidth: '15rem', margin: '0 auto' }}
            />
            <Container fluid textAlign='center' style={{ marginTop: '2em' }}>
              <Button.Group>
                <Button content='Login' primary onClick={ () => submit('login') }/>
                <Button.Or/>
                <Button content='Sign up' secondary onClick={ () => submit('sign_up') }/>
              </Button.Group>
            </Container>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
