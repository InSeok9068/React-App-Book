import React, { Component } from 'react';
import './App.css';
//import { timeout } from 'q';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

console.log(url)

// const list = [
//   {
//     title         : 'React',
//     url           : 'https://reactjs.org/',
//     author        : 'Jordan Walke',
//     num_comments  : 3,
//     points        : 4,
//     objectID      : 0
//   },
//   {
//     title         : 'Redux',
//     url           : 'https://github.com/reactjs/redux',
//     author        : 'Dan Abramov, Andrew Clark',
//     num_comments  : 2,
//     points        : 5,
//     objectID      : 1
//   }
// ]


// ES5
// function isSearched(searchTerm){
//   return function(item){
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

// ES6
// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    const{ hits, page } = result;

    const oldHits = page !== 0
      ? this.state.result.hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ]

    this.setState({
      result: {hits : updatedHits, page}
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    //event.preventDefault();
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
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
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedList }
    });
  }

  onSearchChange(event){
    this.setState({ searchTerm : event.target.value });
  }

  render(){
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0 ;

    return(
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { result &&
          <Table 
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
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
const Search = ({value, onChange, children, onSubmit}) => 
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onchange}
      />
      <button type="submit">
        {children} 
      </button>
    </form>


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
    const { list, onDismiss }  = this.props;
    return (
      <div className="table">
        {list.map(item =>
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
