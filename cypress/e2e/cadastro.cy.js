import { faker } from "@faker-js/faker/locale/pt_BR"

describe('Teste de cadastro de usuário', ()=>{
    const usuario = {
        nome: faker.name.fullName(),
        email: faker.internet.email(),
        senha: faker.internet.password()
    }

    it('Deve permitir cadastrar um usuário com sucesso', ()=>{
        cy.viewport(1366, 768)
        cy.visit('/')
        cy.getByData('botao-cadastro').click()
        cy.getByData('nome-input').type(usuario.nome)
        cy.getByData('email-input').type(usuario.email)
        cy.getByData('senha-input').type(usuario.senha)
        cy.getByData('checkbox-input').check()
        cy.getByData('botao-enviar').click()

        cy.getByData('mensagem-sucesso').should('exist').contains('Usuário cadastrado com sucesso!')

        cy.request('GET', 'http://localhost:8000/users').then((response)=>{
            expect(response.body).to.have.lengthOf.at.least(1)
            expect(response.body[response.body.length -1]).to.deep.include(usuario)
        })
    })
})