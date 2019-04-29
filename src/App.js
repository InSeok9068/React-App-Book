import React, { Component } from 'react';
import axios from 'axios'
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
  _isMounted = false

  constructor(props){
    super(props)

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error : null,
    }

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    console.log(result)
    const{ hits, page } = result;
    const{ searchKey, results } = this.state

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ]

    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey : searchTerm})

    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);  
    }
  
    //event.preventDefault(); 
  }

  componentDidMount(){
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey : searchTerm})
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillMount(){
    this._isMounted = false;
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({error}));
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm]
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
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hit: updatedHits, page}
      }
    });
  }

  onSearchChange(event){
    this.setState({ searchTerm : event.target.value });
  }

  render(){
    const { searchTerm, 
            results,
            searchKey,
            error
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0 ;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

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
        { error 
          ? <div className="interactions">
              <p>Something went wrong.</p>
            </div>    
          : <Table 
          list={list}
          onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
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
