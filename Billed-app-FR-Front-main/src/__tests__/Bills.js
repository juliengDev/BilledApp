/**
 * @jest-environment jsdom
 */

// import { ROUTES } from "../constants/routes";
import "bootstrap";
import "@testing-library/jest-dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { screen, waitFor } from "@testing-library/dom";
import { bills } from "../fixtures/bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
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
    window.onNavigate(ROUTES_PATH.Bills);

    document.body.innerHTML = BillsUI({ data: bills });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When I am on Bills Page", () => {
    it("Should highlight the Bill icon in the vertical layout", async () => {
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      expect(windowIcon.className).toBe("active-icon");
    });

    it("Should render the Mail icon", async () => {
      await waitFor(() => screen.getByTestId("icon-mail"));
      const windowIcon = screen.getByTestId("icon-mail");

      expect(windowIcon).toBeTruthy();
    });

    it("Should render the New Bill button", async () => {
      await waitFor(() => screen.getByTestId("btn-new-bill"));
      const newBillButton = screen.getByTestId("btn-new-bill");

      expect(newBillButton).toBeTruthy();
    });

    it("Should render the list of all Bills", async () => {
      await waitFor(() => screen.getByTestId("tbody"));
      const billsTableBody = screen.getByTestId("tbody");

      expect(billsTableBody).toBeTruthy();
    });

    it("Should ordered the bills from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML)
        .sort(antiChrono);
      const datesSorted = [...dates];
      expect(dates).toEqual(datesSorted);
    });
  });

  describe("My class Bills", () => {
    document.body.innerHTML = BillsUI({ data: bills });

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    let billTest = new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    it("should assign the properties object correctly", () => {
      expect(billTest.document).toEqual(document);
      expect(billTest.onNavigate).toEqual(onNavigate);
      expect(billTest.store).toEqual(mockStore);
      expect(billTest.localStorage).toBe(undefined);
    });

    it("should call handleClickNewBill when buttonNewBill is clicked", () => {
      let handleClickNewBillTest = jest.fn(() => billTest.handleClickNewBill);
      let buttonNewBillTest = document.querySelector(
        `button[data-testid="btn-new-bill"]`
      );
      if (buttonNewBillTest)
        buttonNewBillTest.addEventListener("click", handleClickNewBillTest);
      userEvent.click(buttonNewBillTest);
      expect(handleClickNewBillTest).toHaveBeenCalled();
    });

    it("should call handleClickIconEye for each iconEye element", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      let iconEyeTest;
      let billTest;
      let handleClickIconEyeTest;

      billTest = new Bills({
        document,
        onNavigate: jest.fn(),
        store: {},
        localStorage: {},
      });

      handleClickIconEyeTest = jest.fn();

      iconEyeTest = document.querySelectorAll(`div[data-testid="icon-eye"]`);

      if (iconEyeTest) {
        iconEyeTest.forEach((iconTest) => {
          iconTest.addEventListener("click", () =>
            handleClickIconEyeTest(iconTest)
          );
        });
        userEvent.click(iconEyeTest[1]);
        expect(handleClickIconEyeTest).toHaveBeenCalledWith(iconEyeTest[1]);
      }
    });

    describe("handleClickNewBill()", () => {
      it("should call onNavigate with the NewBill route path", () => {
        let billTest = new Bills({
          document: document,
          onNavigate,
          store: {},
          localStorage: {},
        });
        billTest.onNavigate = jest.fn();
        billTest.handleClickNewBill();

        expect(billTest.onNavigate).toHaveBeenCalledWith(
          ROUTES_PATH["NewBill"]
        );
      });
    });

    describe("When the page is loading", () => {
      it("Should rend the Loading page", () => {
        document.body.innerHTML = BillsUI({ loading: true });
        expect(screen.getAllByText("Loading...")).toBeTruthy();
      });
    });

    describe("When I am on Bills page but back-end send an error message", () => {
      test("Then, Error page should be rendered", () => {
        document.body.innerHTML = BillsUI({ error: "some error message" });
        expect(screen.getAllByText("Erreur")).toBeTruthy();
      });
    });
  });
});

// test d'intégration GET

describe("When I navigate to Bills", () => {
  test("fetches bills from mock API GET", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "employee@test.tld" })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.Bills);

    await waitFor(() => screen.getByText("Mes notes de frais"));
    const contentPending = await screen.getByText("En attente");
    const contentRefused = await screen.getAllByText("Refused");
    const openNewBill = await screen.getByText("Nouvelle note de frais");

    expect(contentPending).toBeTruthy();
    expect(contentRefused).toBeTruthy();
    expect(openNewBill).toBeTruthy();
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
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
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

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
