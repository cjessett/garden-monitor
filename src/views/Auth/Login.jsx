import React from 'react';
import { connect } from 'react-redux';

import { login } from 'ducks/auth';

import CustomInput from 'components/CustomInput/CustomInput.jsx';
import Card from 'components/Card/Card.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import Button from 'components/CustomButtons/Button.jsx';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  handleChange = e => this.setState({ [e.target.id]: e.target.value });
  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const creds = { email, password };
    this.props.login(creds);
  }
  render() {
    const { email, password } = this.state;
    const isDisabled = !(email && password)
    const formControlProps = { type: 'password', fullWidth: true, onChange: this.handleChange, style: { margin: 0 } };
    return (
      <div style={{ margin: '0 auto', width: '25em' }}>
        <Card>
          <CardBody>
            <h3 style={{ margin: 0 }}>Login</h3>
            <CustomInput labelText="Email" id="email" formControlProps={formControlProps} />
            <CustomInput labelText="Password" id="password" formControlProps={formControlProps} inputProps={{ type: 'password' }}/>
            <Button style={{ float: 'right' }} color="info" onClick={this.handleSubmit} disabled={isDisabled}>Submit</Button>
          </CardBody>
        </Card>
        <p style={{ padding: '15px 20px', textAlign: 'center', border: '1px solid #d8dee2', borderRadius: '5px' }}>
          New to Garden Monitor? <a href="/signup">Create an Account</a>
        </p>
      </div>
    );
  }
}

export default connect(null, { login })(Login);
