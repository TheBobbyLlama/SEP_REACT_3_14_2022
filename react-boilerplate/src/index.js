import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";

class App extends React.Component {
  render() {
    return (
      <>
        <h1>Hello World!</h1>
        <p>This is a blank React app!</p>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
