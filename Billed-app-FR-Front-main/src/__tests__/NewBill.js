/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })

  describe("My Class", () => {
    it("should correctly initialize instance properties", () => {
      // containers/NewBill.js l6-8
    })

    it("should correctly assign the formNewBill property", () => {
      // containers/NewBill.js 9
    })

    it("should add submit event listener to formNewBill", () => {
       // containers/NewBill.js 12
    })

    it("should select 'file' input element", () => {
       // containers/NewBill.js 13
    })

    it("should add change event listener to file input", () => {
      // containers/NewBill.js 14
    })

    it("should initialize fileUrl, fileName, and billId to null", () => {
      // containers/NewBill.js 15-17
    })

    it("should create a new instance of Logout", () => {
      // containers/NewBill.js 18
    })    
  })

  describe("handleChangeFile()", () => {

    it("should prevents default behavior", () => {
      // containers/NewBill.js 21
    })

    it("should gets 'file' from document", () => {
       // containers/NewBill.js 22
    })

    it("should logs 'file' to console", () => {
      // containers/NewBill.js 24
    })

    it("should splits file path", () => {
       // containers/NewBill.js 25
    })

    it("should logs 'Raw filePath' to console", () => {
      // containers/NewBill.js 26
    })

    it("should logs 'filePath after split' to console", () => {
      // containers/NewBill.js 27
    })

    it("extracts file name", () => {
       // containers/NewBill.js 28
    })

    it("appends file and email to formData", () => {
       // containers/NewBill.js 33-34
    })

    it("logs formData to console", () => {
       // containers/NewBill.js 35
    })

  })
})
