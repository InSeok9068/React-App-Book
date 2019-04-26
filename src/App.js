import React, { Component } from 'react';
import './App.css';
//import { timeout } from 'q';

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
      <div className="page">
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search
        </Search>
        <Table 
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

// class Search extends Component {
//   render(){
//     const { value, onChange, children } = this.props;
//     return (
//       <form>
//         {children} <input
//           type="text"
//           value={value}
//           onChange={onChange}
//         />
//       </form>
//     )
//   }
// }

// 비 상태 함수형 컴포넌트
const Search = ({value, onChange, children}) => {
  return (
    <form>
      {children} <input
        type="text"
        value={value}
        onChange={onchange}
      />
    </form>
  )
}

class Table extends Component {
  render(){
    const largeColumn = {
      width : '40%'
    }
    const midColumn = {
      width : '40%'
    }
    const smallColumn = {
      width : '40%'
    }
    const { list, pattern, onDismiss }  = this.props;
    return (
      <div className="table">
        {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width : '30%'}}>
              {item.author}
            </span>
            <span style={{ width : '10%'}}>
              {item.num_comments}
            </span>
            <span style={{ width : '10%'}}>
              {item.points}
            </span>
            <span style={{ width : '10%'}}>
              <Button onClick={() => onDismiss(item.objectID)}
                className="button-button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>  
        )}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const {
      onClick,
      className = '',
      children,
    } = this.props;

    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    )
  }
}

export default App;
