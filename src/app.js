import React, { Component } from "react";
import { render } from "react-dom";
import elasticsearch from "elasticsearch";

let client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace"
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { results: [] };
  }
  handleChange(event) {
    const search_query = event.target.value;

    client
      .search({
        q: search_query
      })
      .then(
        function(body) {
          this.setState({ results: body.hits.hits });
        }.bind(this),
        function(error) {
          console.trace(error.message);
        }
      );
  }
  render() {
    return (
      <div className="container">
        <input type="text" onChange={this.handleChange} />
        <SearchResults results={this.state.results} />
      </div>
    );
  }
}

class SearchResults extends Component {
  render() {
    const results = this.props.results || [];

    return (
      <div className="search_results">
        <hr />
        <ul>
          {results.map(result => {
            return (
              <li key={result._id}>
                {result._source.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

render(<App />, document.getElementById("main"));
