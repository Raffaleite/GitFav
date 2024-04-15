import { GithubUser } from "./GithubUser.js"
// class que vai conter a logica dos dados
//como os dados serao estruturados
export class Favorites {
    constructor(root) { // essa root vai ser a div app
        this.root = document.querySelector(root)
        this.load()


    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }
    _
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if (userExists) {
                throw new Error('Usuario ja cadastrado')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuario nao encontrado!')
            }

            // ele recebe um novo usuario que eh um array (user) e ainda espalha os elementos (outros usuarios - ...this.entries) que ja estavam dentro do array(entries), assim criando um novo array com a nova entrada e as entradas antigas
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
        console.log(user)
    }

    delete(user) {
        // filter eh Higher-order function (map, filter, find, reduce), sao funcoes que sao usadas constantemente
        const filteredEntries = this.entries.filter(entry => // ele cria um array a partir de uma logica onde os elementos desse array sao inseridos se satisfazerem esta condicao(true), se false nao eh inserido no array
            entry.login !== user.login) // ele nao tira do array entries, ele cria um novo, principio da imutabilidade

        this.entries = filteredEntries // ele destroi todo o conteudo e substitui por o nosso novo array, ele nao muda pois ele ja eh um novo array - sem quebrar o principio da imutabilidade
        this.update()
        this.save()

        if (this.entries[length] == undefined) {
            this.noUser()
        }
    }
}


//classe que vai criar a visualzacao e eventos do html
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()

    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input') //desestruturacao do objeto (input) para pegar somente o value

            this.add(value)
        }
    }

    update() {
           
        this.removeAllTr()
    
        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => { // se precisarmos fazer mais de um evento diferente de remove, usaremos sempre o addEventListener, aqui como na aplicacao somente tem um evento de click podemos utilizar o onclick mesmo
                const isOK = confirm('Tem certeza que deseja deletar a linha') // retorna um boolean
                if (isOK) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)

        })
    }


    createRow() {

        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/Raffaleite.png" alt="">
                <a href="https://github.com/Raffaleite" target="_blank">
                    <p>Rafael Leite Da Silva Cireli</p>
                    <span>Raffaleite</span>
                </a>
            </td>
            <td class="repositories">27</td>
            <td class="followers">10</td>
            <td><button class="remove">&times;</button></td>
        `


        return tr
    }

    noUser() {
        const noUsertr = document.createElement('tr')

        noUsertr.innerHTML = `

        <td colspan="4">
        <div class="no-user">
            <img src="./assets/bigstar.svg" alt="oooooooooooo star">
            <h1>Nenhum favorito ainda</h1>
        </div>
    </td>`

        this.tbody.append(noUsertr)
    
    }

    removeAllTr() {

        this.tbody.querySelectorAll('tr').
            forEach((tr) => {
                tr.remove()
            })


    }
}