describe('Realizando requisisções para a API', () => {
  context('GET/user', () => {
    it('Deve retornar uma lista de usuários', ()=>{
        cy.request('GET', 'http://localhost:8000/users').then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).length.to.be.greaterThan(1)
        })
    })
  });

  context('GET /user/:userId', ()=>{
    it('Deve retornar um único usuário', ()=>{
        cy.request({
            method: 'GET',
            url:'http://localhost:8000/users/40a41438-84a6-4b4d-ae1d-7f1713d0a9fe',
        }).then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('nome')
        })
    })

    it('Deve retornar erro quando o usuário for inválido', ()=>{
        cy.request({
            method: 'GET',
            url:'http://localhost:8000/users/438-84a6-4b4d-ae1d-7f1713d0a9fe',
            failOnStatusCode: false
        }).then((response)=>{
            expect(response.status).to.eq(404)
            expect(response.body).to.eq('Not Found')
        })
    })
  })
  
  context('Interceptando solicitações de rede', ()=>{
    it('Deve fazer interceptação do POST para users/login', ()=>{
        cy.intercept('POST', 'users/login').as('loginRequest')
        cy.login('alexandre@alura.com', '123456')
        cy.wait('@loginRequest').then((interception)=>{
            interception.response = {
                statusCode: 200,
                body: {
                    success: true,
                    message: 'Login bem sucedido!'
                }
            }
        })
        cy.visit('/home')

        cy.getByData('titulo-boas-vindas').should('contain.text', 'Bem vindo de volta!')
    })
  })

  context('Realizando login via API', ()=>{
    it('Deve permitir login do usuário Alexandre', ()=>{
        cy.request({
            method: 'POST',
            url: 'http://localhost:8000/users/login',
            body:Cypress.env(),
        }).then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).is.not.empty
            expect(response.body.user).to.have.property('nome')
            expect(response.body.user.nome).to.be.equal('Alexandre Alves')
        })
    })
  })
});
