import React from "react";

import Typography from '@material-ui/core/Typography';

import CustomInput from "components/CustomInput/CustomInput.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from 'components/CustomButtons/Button.jsx';

class Valve extends React.Component {
  state = { name: '', serial: '' }
  handleChange = e => this.setState({ [e.target.id]: e.target.value });
  handleSubmit = _ => this.props.handleSubmit(this.state);
  render() {
    const { name, serial } = this.state;
    const isDisabled = !name || !serial;
    const formControlProps = { fullWidth: true, onChange: this.handleChange, style: { margin: 0 } };
    return (
      <Card>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variable="title">Register a New Valve</Typography>
            <Button justIcon round color="transparent" size="sm" onClick={this.props.closeForm}><i class="material-icons">close</i></Button>
          </div>
          <CustomInput labelText="Serial Number" id="serial" formControlProps={formControlProps} />
          <CustomInput labelText="Name" id="name" formControlProps={formControlProps} />
          <Button color="info" onClick={this.handleSubmit} disabled={isDisabled}>Submit</Button>
        </CardBody>
      </Card>
    );
  }
}

export default Valve;
