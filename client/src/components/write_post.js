import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Form, Message, Button, Icon } from 'semantic-ui-react';

import { createPost } from '../api/feed';



export default function({ onPostCreated }) {
  const history = useHistory();
  const [form, setForm] = React.useState({
    text: {
      value: '',
      valid: null,
      validate: (value) => value.length >= 20
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
        value: e.target.value
      }
    })
  }

  const submit = () => {
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

    if (updated_form.text.valid) {
      setLoading(true);
      createPost(updated_form.text.value).then(res => {
        setError({ show: false, message: '' });
        onPostCreated();
        history.push('/feed');
      }).catch(err => {
        setLoading(false);
        setError({ show: true, message: err })
      })
    }
  }



  return (
    <Container textAlign='left'>
      <Form error={ error.show } loading={ loading } style={{ padding: '5em 0 2em' }}>
        <Form.TextArea
          name='text'
          label='Post text'
          placeholder='Write something here...'
          value={ form.text.value }
          onChange={ changeForm }
          error={ form.text.valid === false ? {
            content: "Post should contains minimum 20 symbols",
            pointing: 'above'
          } : false }
        />
        <Message error header='Error' content={ error.message }/>
        <Container fluid textAlign='right' style={{ marginTop: '2em' }}>
          <Button primary icon labelPosition='left' onClick={ submit }>
            <Icon name='share square'/>
            Post it
          </Button>
          <Button as={ Link } to='/feed'>
            Cancel
          </Button>
        </Container>
      </Form>
    </Container>
  )
}
