export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint) //retorna o dado que o fetch pego
        .then(data => data.json()) // tranforma o dado do fetch em JSON e retorna
        .then(({login, name, public_repos, followers}) => ({ // retorna esse dado tranformado em JSON, como um objeto tem que ser entre () pra ser um objeto realmente e nao um scopo da arrowFunction
            login,
            name,
            public_repos,
            followers
        })) 
    }
}
