/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { ROUTES } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    //====================================================
    beforeAll(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    //====================================================

    describe("The new bill form", () => {
      describe("Input of a new bill form", () => {
        it("'Service en ligne' from select menu should be renderer", async () => {
          const inputSelectTest = screen.getByTestId("expense-type");
          userEvent.selectOptions(inputSelectTest, ["Services en ligne"]);
          await expect(inputSelectTest).toHaveValue("Services en ligne");
        });
      
        it("Should store the text value in the name input", async () => {
          const inputNameTest = screen.getByTestId("expense-name");
          userEvent.type(inputNameTest, "Nouvelle facture test");
          await expect(inputNameTest).toHaveValue("Nouvelle facture test");
        });
      
        it("Should store the date value in the date input", async () => {
          const inputDateTest = screen.getByTestId("datepicker");
          userEvent.type(inputDateTest, "2023-06-17");
          await expect(inputDateTest).toHaveValue("2023-06-17");
        });
      
        it("Should store the chosen amount value in the amount input", async () => {
          const inputAmountTest = screen.getByTestId("amount");
          userEvent.type(inputAmountTest, "99");
          await expect(inputAmountTest.value).toBe("99");
        });
      
        it("Should store the chosen amount value in the VAT input", async () => {
          const inputVATAmountTest = screen.getByTestId("vat");
          userEvent.type(inputVATAmountTest, "40");
          await expect(inputVATAmountTest.value).toBe("40");
        });
      
        it("Should store the chosen amount value in the VAT Pourcentage input", async () => {
          const inputVATPourcentageTest = screen.getByTestId("pct");
          userEvent.type(inputVATPourcentageTest, "21");
          await expect(inputVATPourcentageTest.value).toBe("21");
        });

        it("Should store the typed text in the VAT commentary input", async () => {
          const inputCommentaryTest = screen.getByTestId("commentary");
          userEvent.type(inputCommentaryTest, "Ceci est un commentaire de test");
          await expect(inputCommentaryTest).toHaveValue("Ceci est un commentaire de test");
        });
      })

      it("should render a new bill form", async () => {
        // document.body.innerHTML = NewBillUI();
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
  
        await waitFor(() => screen.getByTestId("form-new-bill"));
        const newBillForm = screen.getByTestId("form-new-bill");
  
        expect(newBillForm).toBeTruthy();
      });
  
      it("Should have a submit button on the page", () => {
        document.body.innerHTML = NewBillUI();
        const submitButton = document.getElementById("btn-send-bill");
        expect(submitButton).toBeDefined();
      });
    });   
  });



  describe("handleChangeFile()", () => {
    it("should prevents default behavior", () => {
      document.body.innerHTML = NewBillUI();
      let newBillTest;
      const onNavigateTest = jest.fn();
      const storeTest = {};

      newBillTest = new NewBill({
        document,
        onNavigate: onNavigateTest,
        store: storeTest,
        localStorage,
      });

      const eventTest = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\path\\to\\file.txt",
          setCustomValidity: jest.fn(),
          reportValidity: jest.fn(),
        },
      };

      newBillTest.handleChangeFile(eventTest);

      expect(eventTest.preventDefault).toHaveBeenCalled();
    });

    it("Should throw an error if the incorrect file format is attached", () => {
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      document.body.innerHTML = NewBillUI();

      let newBillTest;
      const storeTest = {};

      newBillTest = new NewBill({
        document,
        onNavigate,
        store: storeTest,
        localStorage: window.localStorage,
      });

      const handleChangeFileTest = jest.fn((e) => newBillTest.handleChangeFile);
      const fileInputTest = screen.getByTestId("file");

      fileInputTest.addEventListener("change", handleChangeFileTest);
      fireEvent.change(fileInputTest, {
        target: {
          files: [
            new File(["test wrong file format"], "intro.txt", {
              type: "text/txt",
            }),
          ],
        },
      });
      expect(handleChangeFileTest).toHaveBeenCalled();
    });
  });
});
