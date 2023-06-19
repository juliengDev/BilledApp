/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import { billTest } from "../__mocks__/bill.js";
import mockStore from "../__mocks__/store";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import userEvent from "@testing-library/user-event";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("New bill form", () => {
      describe("Inputs of a new bill form", () => {
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
          userEvent.type(
            inputCommentaryTest,
            "Ceci est un commentaire de test"
          );
          await expect(inputCommentaryTest).toHaveValue(
            "Ceci est un commentaire de test"
          );
        });
      });
      describe("Display of a new bill form", () => {
        it("Should highlight the Mail icon in the vertical layout", async () => {
          await waitFor(() => screen.getByTestId("icon-mail"));
          const emailIconTest = screen.getByTestId("icon-mail");

          expect(emailIconTest).toHaveClass("active-icon");
        });
        it("Should render a new bill form", async () => {
          await waitFor(() => screen.getByTestId("form-new-bill"));
          const newBillForm = screen.getByTestId("form-new-bill");

          expect(newBillForm).toBeDefined();
        });

        it("Should render a submit button on the page", () => {
          const submitButton = document.getElementById("btn-send-bill");
          expect(submitButton).toBeDefined();
        });
      });
    });
  });

  describe("handleChangeFile() method", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "employee@test.tld",
        status: "connected",
      })
    );

    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.NewBill);

    let newBillTest = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    it("Should call handleChangeFile method with preventDefault behavior", () => {
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

    it("Sould render the Bill page if the form is correctly submit", async () => {
      const handleSubmit = jest.fn((e) => newBillTest.handleSubmit(e));

      await waitFor(() => screen.getByTestId("form-new-bill"));
      const newBillFormTest = screen.getByTestId("form-new-bill");
      newBillFormTest.addEventListener("submit", handleSubmit);
      fireEvent.submit(newBillFormTest);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("Should throw an error if the incorrect file format is attached", () => {
      document.body.innerHTML = NewBillUI();

      const handleChangeFileTest = jest.fn((e) =>
        newBillTest.handleChangeFile(e)
      );
      const fileInputTest = screen.getByTestId("file");

      fileInputTest.addEventListener("change", handleChangeFileTest);
      fireEvent.change(fileInputTest, {
        target: {
          files: [
            new File(["intro.txt"], "intro.txt", {
              type: "text/txt",
            }),
          ],
        },
      });

      expect(fileInputTest.files[0].name).toBe("intro.txt");
      expect(fileInputTest.files[0].name.endsWith("jpeg")).not.toBeTruthy();
      expect(fileInputTest.files[0].name.endsWith("jpg")).not.toBeTruthy();
      expect(fileInputTest.files[0].name.endsWith("png")).not.toBeTruthy();
      expect(handleChangeFileTest).toHaveBeenCalled();
      expect(fileInputTest.validationMessage).toBe(
        "Formats acceptés : jpg, jpeg et png"
      );
    });
  });
});

// test d'intégration POST
describe("Given I am a user connected as en Employee", () => {
  describe("When a valid bill is submit", () => {
    it("Should trown the bill to the back end", async () => {
      document.body.innerHTML = NewBillUI();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const newBillTest = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      // importer cet objet depuis un fichier dedier depuis le repertoire __mocks__/bill.js
      

      //click submit
      const submit = screen.queryByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBillTest.handleSubmit(e));

      //apply to the DOM
      document.querySelector(`select[data-testid="expense-type"]`).value =
        billTest.type;
      document.querySelector(`input[data-testid="expense-name"]`).value =
        billTest.name;
      document.querySelector(`input[data-testid="datepicker"]`).value =
        billTest.date;
      document.querySelector(`input[data-testid="amount"]`).value =
        billTest.amount;
      document.querySelector(`input[data-testid="vat"]`).value = billTest.vat;
      document.querySelector(`input[data-testid="pct"]`).value = billTest.pct;
      document.querySelector(`textarea[data-testid="commentary"]`).value =
        billTest.commentary;
      newBillTest.fileUrl = billTest.fileUrl;
      newBillTest.fileName = billTest.fileName;
      newBillTest.id = billTest.id;

      submit.addEventListener("click", handleSubmit);

      fireEvent.click(submit);

      //verify if handleSubmit was called
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@test.tld",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      document.body.innerHTML = BillsUI({ error: "Erreur 404" });
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      document.body.innerHTML = BillsUI({ error: "Erreur 500" });
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
