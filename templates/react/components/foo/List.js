import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset, page } from '../../actions/{{{ lc }}}/list';
import { success } from '../../actions/{{{ lc }}}/delete';
import { paginationRoute, itemToLinks } from '../../utils/helpers';

class List extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    page: PropTypes.func.isRequired,
  };

  pagination() {
    return (
      <span>
        <button
          type="button"
          className="btn btn-basic btn-sm"
          onClick={() => this.props.page(paginationRoute(this.props.view['{{{ hydraPrefix }}}first']))}
          disabled={!this.props.view['{{{ hydraPrefix }}}previous']}
        >First</button>
        &nbsp;
        <button
          type="button"
          className="btn btn-basic btn-sm"
          onClick={() => this.props.page(paginationRoute(this.props.view['{{{ hydraPrefix }}}previous']))}
          disabled={!this.props.view['{{{ hydraPrefix }}}previous']}
        >Previous</button>
        &nbsp;
        <button
          type="button" className="btn btn-basic btn-sm"
          onClick={() => this.props.page(paginationRoute(this.props.view['{{{ hydraPrefix }}}next']))}
          disabled={!this.props.view['{{{ hydraPrefix }}}next']}
        >Next</button>
        &nbsp;
        <button
          type="button" className="btn btn-basic btn-sm"
          onClick={() => this.props.page(paginationRoute(this.props.view['{{{ hydraPrefix }}}last']))}
          disabled={!this.props.view['{{{ hydraPrefix }}}next']}
        >Last</button>
        &nbsp;
      </span>
    );
  }

  componentDidMount() {
    this.props.list();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    return <div>
      <h1>{{{ title }}} List</h1>

      {this.props.loading && <div className="alert alert-info">Loading...</div>}
      {this.props.deletedItem && <div className="alert alert-success">{this.props.deletedItem['@id']} deleted.</div>}
      {this.props.error && <div className="alert alert-danger">{this.props.error}</div>}
      {this.pagination()}

      <div className="table-responsive">
          <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Id</th>
{{#each fields}}
              <th>{{name}}</th>
{{/each}}
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {this.props.items.map(item =>
            <tr className={item['@id']} key={item['@id']}>
              <td><Link to={`show/${encodeURIComponent(item['@id'])}`}>{item['@id']}</Link></td>
{{#each fields}}
              <td>{item['{{{ name }}}'] ? itemToLinks(item['{{{ name }}}']) : ''}</td>
{{/each}}
              <td>
                <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                  <span className="glyphicon glyphicon-search" aria-hidden="true"/>
                  <span className="sr-only">Show</span>
                </Link>
              </td>
              <td>
                <Link to={`edit/${encodeURIComponent(item['@id'])}`}>
                  <span className="glyphicon glyphicon-pencil" aria-hidden="true"/>
                  <span className="sr-only">Edit</span>
                </Link>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      <Link to="create" className="btn btn-default">Create</Link>
    </div>;
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.{{{ lc }}}.list.items,
    error: state.{{{ lc }}}.list.error,
    loading: state.{{{ lc }}}.list.loading,
    deletedItem: state.{{{ lc }}}.del.deleted,
    view: state.{{{ lc }}}.list.view,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    list: () => dispatch(list()),
    page: (arg) => dispatch(page(arg)),
    reset: () => {
      dispatch(reset());
      dispatch(success(null));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
