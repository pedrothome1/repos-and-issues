import React, { Component } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { Loading, Owner, IssueList } from './styles';
import Container from '../../components/Container';
import Paginator from '../../components/Paginator';
import Button from '../../components/Button';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    filter: 'all',
    page: 1,
  };

  async componentDidMount() {
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${this.getRepoName()}`),
      this.fetchIssues(),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  getRepoName = () => {
    const { match } = this.props;
    return decodeURIComponent(match.params.repository);
  };

  fetchIssues = async (page = 1) => {
    const { filter } = this.state;

    return api.get(`/repos/${this.getRepoName()}/issues`, {
      params: {
        state: filter,
        per_page: 5,
        page,
      },
    });
  };

  handleFilterChange = async event => {
    const filter = event.target.value;
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filter,
        per_page: 5,
      },
    });

    this.setState({
      filter,
      issues: response.data,
    });
  };

  async handlePageChange(page) {
    if (page < 1) {
      return;
    }

    const response = await this.fetchIssues(page);

    this.setState({
      issues: response.data,
      page,
    });
  }

  render() {
    const { repository, issues, loading, filter, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          <select onChange={this.handleFilterChange} value={filter}>
            <option value="all">Todas</option>
            <option value="open">Abertas</option>
            <option value="closed">Fechadas</option>
          </select>

          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>

        <Paginator>
          <Button
            onClick={() => this.handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <FaAngleLeft />
            Anterior
          </Button>
          <Button onClick={() => this.handlePageChange(page + 1)}>
            Próximo
            <FaAngleRight />
          </Button>
        </Paginator>
      </Container>
    );
  }
}
