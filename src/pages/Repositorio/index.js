import { useEffect, useState } from "react";
import { BackButton, Container, FilterList, IssuesList, Loading, Owner, PageActions } from "./styles";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function Repositorio(){

    const {repositorio} = useParams()

    const [repositorios, setRepositorios] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [pages, setPages] = useState(1)
    const [filter, setFilter] = useState([
        {state: "all", label: "Todas", active: true},
        {state: "open", label: "Abertas", active: false},
        {state: "closed", label: "Fechadas", active: false}
    ])
    const [filterIndex, setFilterIndex] = useState(0)

    useEffect(() => {

        async function load(){

            // .repositorio é o parâmetro da rota especificado no arquivo routes
            const nomeRepositorio = decodeURIComponent(repositorio)

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepositorio}`),
                api.get(`/repos/${nomeRepositorio}/issues`, {
                    params: {
                        state: filter[filterIndex].state,
                        per_page: 5
                    }
                })
            ])
            setRepositorios(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }

        load()
    }, [repositorio, pages, filter, filterIndex])

    useEffect(() => {

        async function loadIssue(){
            const nomeRepositorio = decodeURIComponent(repositorio)
            const response = await api.get(`/repos/${nomeRepositorio}/issues`, {
                params: {
                    state: "open",
                    page: pages,
                    per_page: 5
                }
            })
            setIssues(response.data)
        }

        loadIssue()
    }, [repositorio, pages])

    function handlePage(action){
        setPages(action === "previous" ? pages - 1 : pages + 1)
    }

    function handleFilter(index){
        setFilterIndex(index)
    }

    // Necessário para que quando ele for buscar pelos dados da API ele não dê erro.
    if(loading){
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }

    return(
        <Container>
            <BackButton to="/">
                <FaArrowLeft color="#000" size={30} />
            </BackButton>
            <Owner>
                <img src={repositorios.owner.avatar_url} alt={repositorios.owner.login}/>
                <h1>{repositorios.name}</h1>
                <p>{repositorios.description}</p>
            </Owner>
            <FilterList active={filterIndex}>
                {filter.map((filters, index) => (
                    <button key={filters.label} onClick={() => handleFilter(index)}>{filters.label}</button>
                ))}
            </FilterList>
            <IssuesList>
                {issues.map (issue => (
                    // A key precisa ser uma String porém o id que vem padrão é um número
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login}/>
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(labels => (
                                    <span key={String(labels.id)}>
                                        {labels.name}
                                    </span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageActions>
                <button onClick={() => handlePage("previous")} disabled={pages === 1}>Voltar</button>
                <button onClick={() => handlePage("next")}>Próximo</button>
            </PageActions>
        </Container>
    )
}