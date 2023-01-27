import React from "react";

class Clock extends React.Component {
  state = {
    date: new Date(),
  };

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    // this.state.date = new Date(); - wrong way
    this.setState({ date: new Date() });
  }

  render() {
    return (
      <h2>
        <b>{this.state.date.toLocaleTimeString()}</b>
      </h2>
    );
  }
}
export default Clock;
