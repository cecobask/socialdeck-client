import Users from '../fixtures/Users'
import { logOut, getRandomInt } from '../support/helpers'

describe('Authentication page', () => {
  context('When a user enters the log in page', () => {
    beforeEach(function () {
      cy.visit('/', { timeout: 15000 })
    })
    describe('and is an invalid user', () => {
      it('should fail if the password doesn\'t match db record', () => {
        cy.get('#email').type(Users.invalidPasswordUser.email)
        cy.get('#password').type(Users.invalidPasswordUser.password)
        cy.get('#submitBtn').click()
        cy.url().should('include', '/auth')
        cy.get('#error')
          .should('exist')
          .contains('Incorrect password!')
      })
      it('should fail if the email doesn\'t exist in the db', () => {
        cy.get('#email').clear().type(Users.invalidEmailUser.email)
        cy.get('#password').type(Users.invalidEmailUser.password)
        cy.get('#submitBtn').click()
        cy.url().should('include', '/auth')
        cy.get('#error')
          .should('exist')
          .contains(`No user with email ${Users.invalidEmailUser.email}!`)
      })
      it('should fail if the email is not of valid format', () => {
        cy.get('#email').clear().type(Users.invalidEmailFormatUser.email)
        cy.get('#password').clear().type(Users.invalidEmailFormatUser.password)
        cy.get('#submitBtn').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Email is invalid!')
      })
      it('should fail if the password is not of valid format', () => {
        cy.get('#email').clear().type(Users.invalidPasswordFormatUser.email)
        cy.get('#password').clear().type(Users.invalidPasswordFormatUser.password)
        cy.get('#submitBtn').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Password must be at least 6 characters long!')
      })
      it('should fail if the password and email are not of valid format', () => {
        cy.get('#password').clear().type(Users.invalidPasswordFormatUser.password)
        cy.get('#email').clear().type(Users.invalidEmailFormatUser.email)
        cy.get('#submitBtn').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Email is invalid!')
        cy.contains('* Password must be at least 6 characters long!')
      })
      it('should fail to submit an empty form', () => {
        cy.get('#password').clear()
        cy.get('#email').clear()
        cy.get('#submitBtn').should('be.disabled')
          .url().should('include', '/auth')
      })
      it('should fail to navigate to other routes', () => {
        cy.visit('/dashboard')
          .url().should('include', '/auth')
      })
    })
    describe('and is a valid user', () => {
      it('should be able to navigate to sign up form', () => {
        cy.url().should('include', '/auth')
        cy.get('#container > a').should('exist')
          .should('have.text', 'Don\'t have an account? Click here to register!')
          .click()
        cy.get('h1').should('have.text', 'SIGN UP')
      })
      it('should be able to log in', () => {
        cy.get('#email').type(Users.validUser.email)
        cy.get('#password').type(Users.validUser.password)
        cy.get('#submitBtn').click()
        cy.url().should('include', '/dashboard')
        logOut()
      })
    })
  })

  context('When a user enters the sign in page', () => {
    beforeEach(function () {
      cy.visit('/')
      cy.get('#container > a').click()
    })
    describe('and is an invalid user', () => {
      it('should fail if the email already exists in the db', () => {
        cy.get('#email').type(Users.validUser.email)
        cy.get('#fullName').type(Users.validUser.fullName)
        cy.get('#password').type(Users.validUser.password)
        cy.get('#confirmPass').type(Users.validUser.password)
        cy.get('form > button').click()
        cy.url().should('include', '/auth')
        cy.get('#error')
          .should('exist')
          .contains(`User with email ${Users.validUser.email} already exists!`)
      })
      it('should fail if the email is not of valid format', () => {
        cy.get('#email').type(Users.invalidEmailFormatUser.email)
        cy.get('#fullName').type(Users.validUser.fullName)
        cy.get('#password').type(Users.validUser.password)
        cy.get('#confirmPass').type(Users.validUser.password)
        cy.get('form > button').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Email is invalid!')
      })
      it('should fail if the full name is not of valid format', () => {
        cy.get('#email').type(Users.validUser.email)
        cy.get('#fullName').type(Users.invalidFullNameFormatUser.fullName)
        cy.get('#password').type(Users.validUser.password)
        cy.get('#confirmPass').type(Users.validUser.password)
        cy.get('form > button').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Full name must consist of two words!')
      })
      it('should fail if the password is not of valid format', () => {
        cy.get('#email').type(Users.validUser.email)
        cy.get('#fullName').type(Users.validUser.fullName)
        cy.get('#password').type(Users.invalidPasswordFormatUser.password)
        cy.get('#confirmPass').type(Users.invalidPasswordFormatUser.password)
        cy.get('form > button').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Password must be at least 6 characters long!')
      })
      it('should fail if the password and email are not of valid format', () => {
        cy.get('#email').type(Users.invalidEmailFormatUser.email)
        cy.get('#fullName').type(Users.validUser.fullName)
        cy.get('#password').type(Users.invalidPasswordFormatUser.password)
        cy.get('#confirmPass').type(Users.invalidPasswordFormatUser.password)
        cy.get('form > button').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Email is invalid!')
        cy.contains('* Password must be at least 6 characters long!')
      })
      it('should fail if the passwords don\'t match', () => {
        cy.get('#email').type(Users.validUser.email)
        cy.get('#fullName').type(Users.validUser.fullName)
        cy.get('#password').type(Users.validUser.password)
        cy.get('#confirmPass').type(Users.invalidPasswordUser.password)
        cy.get('form > button').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Passwords must match!')
      })
      it('should fail if none of the fields are valid', () => {
        cy.get('#email').type(Users.invalidEmailFormatUser.email)
        cy.get('#fullName').type(Users.invalidFullNameFormatUser.fullName)
        cy.get('#password').type(Users.invalidPasswordFormatUser.password)
        cy.get('#confirmPass').type(Users.validUser.password)
        cy.get('form > button').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Passwords must match!')
        cy.contains('* Email is invalid!')
        cy.contains('* Password must be at least 6 characters long!')
        cy.contains('* Full name must consist of two words!')
      })
      it('should fail to submit an empty form', () => {
        cy.get('#fullName').clear()
        cy.get('#password').clear()
        cy.get('#confirmPass').clear()
        cy.get('#email').clear()
        cy.get('form > button').should('be.disabled')
          .url().should('include', '/auth')
      })
      it('should fail to navigate to other routes', () => {
        cy.visit('/dashboard')
          .url().should('include', '/auth')
      })
    })
    describe('and is a valid user', () => {
      it('should be able to navigate to log in form', () => {
        cy.get('#container > a').should('exist')
          .should('have.text', 'Have an account? Click here to log in!')
          .click()
        cy.get('h1').should('have.text', 'LOG IN')
      })
      it('should be able to sign up', () => {
        cy.get('#email').type('new' + getRandomInt(1, 100) + '@random.com')
        cy.get('#fullName').type(Users.newUser.fullName)
        cy.get('#password').type(Users.newUser.password)
        cy.get('#confirmPass').type(Users.newUser.password)
        cy.get('form > button').click()
        cy.url().should('include', '/dashboard')
        logOut()
      })
    })
  })
})
