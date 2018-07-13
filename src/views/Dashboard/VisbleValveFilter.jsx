import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { ALL, OPEN, CLOSED, getVisibilityFilter, setVisibilityFilter } from 'ducks/valves';

const styles = {
  group: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checked: {},
  size: {
    width: 40,
    height: 40,
  },
  sizeIcon: {
    fontSize: 20,
  },
};

class RadioButtonsGroup extends React.Component {
  handleChange = e => {
    const value = e.target.value;
    this.props.setFilter(value);
  };

  render() {
    const { classes, value } = this.props;

    return (
      <div className={classes.root}>
        <RadioGroup
          aria-label="visible"
          name="visible"
          className={classes.group}
          value={value}
          onChange={this.handleChange}
        >
          <FormControlLabel value={ALL} control={<Radio />} label="All" />
          <FormControlLabel value={OPEN} control={<Radio />} label="Open" />
          <FormControlLabel value={CLOSED} control={<Radio />} label="Closed" />
        </RadioGroup>
      </div>
    );
  }
}

const mapStateToProps = state => ({ value: getVisibilityFilter(state) });

const mapDispatchToProps = dispatch => ({
  setFilter: filter => dispatch(setVisibilityFilter(filter)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RadioButtonsGroup));
