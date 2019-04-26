import React, { Component } from 'react';
import './App.css';
import { timeout } from 'q';

const list = [
  {
    title         : 'React',
    url           : 'https://reactjs.org/',
    author        : 'Jordan Walke',
    num_comments  : 3,
    points        : 4,
    objectID      : 0
  },
  {
    title         : 'Redux',
    url           : 'https://github.com/reactjs/redux',
    author        : 'Dan Abramov, Andrew Clark',
    num_comments  : 2,
    points        : 5,
    objectID      : 1
  }
]


// ES5
// function isSearched(searchTerm){
//   return function(item){
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

// ES6
const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      list,
      searchTerm: '',
    }
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    // 1번
    // const updatedList = this.state.list.filter(function isNotId(item){
    //   return item.objectID !== id;
    // })

    // 2번
    // function isNotId(item){
    //   return item.objectID !== id;
    // }
    // const updatedList = this.state.list.filter(isNotId);

    // 3번
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list : updatedList });
  }

  onSearchChange(event){
    this.setState({ searchTerm : event.target.value });
  }

  render(){
    const { searchTerm, list } = this.state;
    return(
      <div className="App">
        <form>
          <input
            type="text"
            value={searchTerm}
            onChange={this.onSearchChange}
          />
        </form>
        {list.filter(isSearched(searchTerm)).map(item =>
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <spam>
                <button onClick={() => this.onDismiss(item.objectID)}
                  type="button"
                >
                  dismiss
                </button>
              </spam>
            </div>  
        )}
      </div>
    );
  }
}

export default App;
