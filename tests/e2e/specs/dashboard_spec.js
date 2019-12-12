import Users from '../fixtures/Users'
import Posts from '../fixtures/Posts'
import { createPost, deleteFirstPost, logIn, logOut } from '../support/helpers'

describe('Dashboard page', () => {
  context('When a user tries to create a post', () => {
    before(function () {
      logIn(Users.validUser.email, Users.validUser.password)
    })
    it('should be successful if the message field is not empty', function () {
      cy.get('#postsFeed')
        .should('not.exist')
      cy.get('#postMessage')
        .should('be.empty')
        .type(Posts.shortPost)
      cy.get('#createPost')
        .should('not.be.disabled')
        .click()
      cy.wait(1000)
      cy.get('#postsFeed')
        .find('.card')
        .its('length')
        .should('eq', 1)
      cy.get(':nth-child(1) > .card-header > h6')
        .should('exist')
        .contains(Users.validUser.fullName)
      cy.get(':nth-child(1) > .card-header > .text-muted')
        .should('exist')
        .contains('a few seconds ago')
      cy.get(':nth-child(1) > .card-footer')
        .find('button')
        .its('length')
        .should('eq', 3)
      cy.get(':nth-child(1) > .card-footer > .btn-danger')
        .click()
      cy.get('body')
        .type('{enter}')
      cy.wait(300)
      cy.get('#postsFeed')
        .find('.card')
        .should('not.exist')
    })
    it('should fail if the message field is empty', function () {
      cy.get('#postMessage')
        .clear()
      cy.get('#createPost')
        .should('be.disabled')
      cy.get('#postsFeed')
        .find('.card')
        .should('not.exist')
    })
    after(function () {
      logOut()
    })
  })

  context('When a user tries to delete a post', () => {
    before(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      createPost(Posts.shortPost)
      logOut()
      logIn(Users.validUser.email, Users.validUser.password)
    })
    it('should be successful if the user is the post creator', function () {
      cy.get('#postMessage')
        .should('be.empty')
        .type(Posts.shortPost)
      cy.get('#createPost')
        .should('not.be.disabled')
        .click()
      cy.wait(500)
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer > .btn-danger')
        .click()
      cy.get('body')
        .type('{enter}')
      cy.wait(1000)
      cy.get('#postsFeed')
        .find('.card')
        .its('length')
        .should('eq', 1)
    })
    it('should fail if the user is not the post creator', function () {
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer')
        .find('.btn')
        .eq(1)
        .should('have.class', 'disabled')
      logOut()
    })
    after(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user tries to edit a post', () => {
    before(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      createPost(Posts.shortPost)
      logOut()
      logIn(Users.validUser.email, Users.validUser.password)
    })
    it('should be successful if the user is the post creator', function () {
      cy.get('#postMessage')
        .should('be.empty')
        .type(Posts.shortPost)
      cy.get('#createPost')
        .should('not.be.disabled')
        .click()
      cy.wait(500)
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer > .btn-primary')
        .click()
      cy.get('.modal-content')
        .should('be.visible')
      cy.get('#textarea')
        .should('have.value', Posts.shortPost)
        .clear()
        .type(Posts.editedPost)
      cy.get('.btn-success')
        .click()
      cy.wait(300)
      cy.get(':nth-child(1) > .card-body > .card-text')
        .contains(Posts.editedPost)
      cy.get('.card-footer > .btn-danger')
        .click()
      cy.get('body')
        .type('{enter}')
    })
    it('should fail if the user is not the post creator', function () {
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer')
        .find('.btn')
        .eq(1)
        .should('be.visible')
      logOut()
    })
    after(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user tries to share a post', () => {
    before(function () {
      logIn(Users.validUser.email, Users.validUser.password)
      createPost(Posts.shortPost)
      cy.wait(500)
    })
    it('should be successful if the user hasn\'t shared the post before',
      function () {
        cy.get('.btn-secondary')
          .should('contain', '0')
          .click()
        cy.wait(300)
        cy.get('.btn-secondary')
          .should('contain', '1')
          .and('be.visible')
      })
    it('should fail if the user has shared the post before', function () {
      cy.get('.btn-secondary')
        .should('contain', '1')
        .and('be.visible')
    })
    after(function () {
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user finds a long post', () => {
    it('should be able to view its full contents', function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      createPost(Posts.longPost)
      cy.get('#showMore')
        .click()
      cy.wait(500)
      cy.get('.modal-content')
        .should('be.visible')
      cy.get('.close')
        .click()
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer > .btn')
        .eq(1)
        .click()
      cy.get('body')
        .type('{enter}')
      logOut()
    })
  })

  context('When the dashboard is empty', () => {
    it('should display a message', function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      cy.get('#postsFeed')
        .find('.card')
        .should('not.exist')
      cy.get('.no-results')
        .should('exist')
        .contains('There are currently no posts')
      logOut()
    })
  })

  context('Navigation bar', () => {
    it('should display the right elements', function () {
      logIn(Users.validUser.email, Users.validUser.password)
      cy.wait(1000)
      cy.get('#nav_collapse ul')
        .its('length')
        .should('eq', 3)
      cy.get('#nav_collapse ul')
        .should('contain', 'Dashboard')
        .and('contain', 'Account')
        .and('contain', 'Log out')
        .and('contain', 'Your posts')
      logOut()
    })
  })
})
