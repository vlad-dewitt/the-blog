import React from 'react';
import { Container, Form, Message, Button, Icon } from 'semantic-ui-react';

import { commentPost } from '../api/feed';



export default function({ post_id, onPostComment }) {
  const [form, setForm] = React.useState({
    text: {
      value: '',
      valid: null,
      validate: (value) => value.length >= 2
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
      commentPost(post_id, updated_form.text.value).then(res => {
        setError({ show: false, message: '' });
        onPostComment();
        setForm({
          text: {
            value: '',
            valid: null,
            validate: (value) => value.length >= 2
          }
        })
        setLoading(false);
      }).catch(err => {
        setLoading(false);
        setError({ show: true, message: err })
      })
    }
  }



  return (
    <Form error={ error.show } loading={ loading } style={{ marginTop: '2em' }}>
      <Form.TextArea
        name='text'
        placeholder='Write your comment...'
        value={ form.text.value }
        onChange={ changeForm }
        error={ form.text.valid === false ? {
          content: "Comment should contains minimum 2 symbols",
          pointing: 'above'
        } : false }
      />
      <Message error header='Error' content={ error.message }/>
      <Container fluid textAlign='right'>
        <Button primary icon labelPosition='left' onClick={ submit }>
          Post comment
          <Icon name='edit'/>
        </Button>
      </Container>
    </Form>
  )
}
