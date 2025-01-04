import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from "react-icons/fa"
import {Container, DeleteButton, Form, List, SubmitButton} from "./styles"
import { useCallback, useEffect, useState } from "react"
import api from "../../services/api"
import { Link } from "react-router-dom"

export default function Main(){

    const [novoRepo, setNovoRepo] = useState("")
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false)
    const [alerta, setAlerta] = useState(null)

    useEffect(() => {
        const repos = localStorage.getItem("@repositorios")

        if(repos){
            setRepositorios(JSON.parse(repos))
        }

    }, [])

    useEffect(() => {
        localStorage.setItem("@repositorios", JSON.stringify(repositorios))
    }, [repositorios])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        setLoading(true)
        async function submit(){
            try{

                if (novoRepo === ""){
                    throw new Error("Digite um repositório")
                }

                const temRepo = repositorios.find(repo => repo.name === novoRepo.name)

                if (temRepo){
                    throw new Error("Este repositório já foi adicionado!")
                }

                const response = await api.get(`repos/${novoRepo}`)
    
                const data = {
                    name: response.data.full_name
                }
        
                setRepositorios([...repositorios, data])
                setNovoRepo('')
            } catch(error){
                setAlerta(true)
                console.log(error)
            } finally{
                setLoading(false)
            }
        }

        submit()
    }, [novoRepo, repositorios])

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find)
    }, [repositorios])

    function handleInput(e){
        setNovoRepo(e.target.value)
    }

    return(
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus repositórios
            </h1>
            

            <Form onSubmit={handleSubmit} error={alerta}>
                <input 
                type="text" 
                placeholder="Adicionar um repositório"
                value={novoRepo}
                onChange={handleInput}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <DeleteButton onClick={() => {handleDelete(repo.name)}}>
                            <FaTrash size={14} />
                        </DeleteButton>
                        <span>{repo.name}</span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>

        </Container>
    )
}