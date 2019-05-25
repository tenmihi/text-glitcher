import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    color: 'white',
  },
});

class OutlinedTextFields extends React.Component {
  state = {
    text: this.props.text,
  }

  handleChange = text => event => {
    const text = event.target.value
    this.setState({ text });
    this.props.updateText(text)
  };


  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="standard-name"
          label="Text"
          className={classes.input}
          value={this.state.text}
          onChange={this.handleChange('text')}
          margin="normal"
        />
      </form>
    );
  }
}

OutlinedTextFields.propTypes = {
  classes: PropTypes.object.isRequired,
  updateText: PropTypes.func.isRequired,
};

export default withStyles(styles)(OutlinedTextFields);