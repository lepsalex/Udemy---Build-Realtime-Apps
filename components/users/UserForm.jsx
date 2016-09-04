import React, {Component} from 'react';

class UserForm extends React.Component {
  onSubmit(e) {
    e.preventDefault();
    const node = this.refs.userName;
    const userName = node.value;
    this.props.setUserName(userName);
    node.value = '';
  }

  render() {
    return(
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            placeholder='Set Your Name...'
            ref='userName'
          />
        </div>
      </form>
    );
  }
}

UserForm.propTypes = {
  setUserName: React.PropTypes.func.isRequired
};

export default UserForm;
