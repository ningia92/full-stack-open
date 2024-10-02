describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const users = [
      {
        username: 'cypress',
        name: 'Cypress User',
        password: 'secret'
      },
      {
        username: 'cipresso',
        name: 'Utente Cipresso',
        password: 'segreta'
      }
    ]
    users.forEach(user => cy.request('POST', `${Cypress.env('BACKEND')}/users`, user))
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('blogs')
    cy.contains('log in to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'cypress', password: 'secret' })
    })

    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('testBlog')
      cy.get('#author').type('testAuthor')
      cy.get('#url').type('testUrl')
      cy.get('#login-button').click()
      cy.contains('testBlog testAuthor')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'testBlog1',
          author: 'testAuthor1',
          url: 'testUrl1'
        })
        cy.contains('logout').click()
        cy.login({ username: 'cipresso', password: 'segreta' })
        cy.createBlog({
          title: 'testBlog2',
          author: 'testAuthor2',
          url: 'testUrl2'
        })
        cy.createBlog({
          title: 'testBlog3',
          author: 'testAuthor3',
          url: 'testUrl3'
        })
        cy.contains('logout').click()
        cy.login({ username: 'cypress', password: 'secret' })
      })

      it('a user can like it', function () {
        cy.contains('show').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('the user who created a blog can delete it', function () {
        cy.contains('show').click()
        cy.contains('Cypress User')
        cy.get('#remove-button').click()
      })

      it('only the creator can see the delete button of a blog', function () {
        cy.contains('testBlog2 testAuthor2')
          .contains('show').click()
          .get('#remove-button')
          .should('not.exist')
      })

      it('the blogs are ordered by likes', function () {
        cy.contains('testBlog1 testAuthor1').contains('show').click()
        cy.contains('testBlog2 testAuthor2').contains('show').click()
        cy.contains('testBlog3 testAuthor3').contains('show').click()

        cy.contains('testBlog1 testAuthor1').parent().find('#like-button').as('blog1Like')
        cy.contains('testBlog2 testAuthor2').parent().find('#like-button').as('blog2Like')
        cy.contains('testBlog3 testAuthor3').parent().find('#like-button').as('blog3Like')

        cy.get('@blog2Like').click().wait(500)
        cy.get('@blog2Like').click().wait(500)
        cy.get('@blog2Like').click().wait(500)
        cy.get('@blog1Like').click().wait(500)
        cy.get('@blog1Like').click().wait(500)
        cy.get('@blog3Like').click().wait(500)

        cy.get('.blog').eq(0).should('contain', 'testBlog2 testAuthor2')
        cy.get('.blog').eq(1).should('contain', 'testBlog1 testAuthor1')
        cy.get('.blog').eq(2).should('contain', 'testBlog3 testAuthor3')
      })
    })
  })
})