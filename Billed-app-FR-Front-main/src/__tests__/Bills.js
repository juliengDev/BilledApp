/**
 * @jest-environment jsdom
 */
import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  // ************  Hooks  ************

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
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

  describe("containers Bills.js", () => {
    describe("My class", () => {
      

      beforeEach(() => {
        // On instancie un objet mocke depuis la classe Bills
               
      });

      it("should call handleClickNewBill when buttonNewBill is clicked", () => {
        // fireEvent est une fonction de la lib Testing-librairy
        // Permet de simuler des evenements
        // https://testing-library.com/docs/dom-testing-library/api-events
        // A noter qu'il est aussi possible d'utiliser la fonction userEvent ici
        // https://testing-library.com/docs/ecosystem-user-event/

        
      });

      it("should call handleClickIconEye for each iconEye element", () => {
        
      });

      it("should assign the properties object correctly", () => {
        // expect(classInstanceMockTest.document).toBe(documentMockTest);
        // expect(classInstanceMockTest.onNavigate).toBe(onNavigateMockTest);
        // expect(classInstanceMockTest.store).toBe(storeMockTest);
      });
      it("should add event listener to buttonNewBill", () => {
        // /src/containers/Bills.js l11
        // Testing pattern :
        // Arrange : Define the testing environnement & values
        // Act : Run actual code / function that should be tested
        // Assert : Evaluate the produced value / result and compage it to the expected value / result
      });

      it("should add event listeners to iconEye elements", () => {
        // /src/containers/Bills.js l13
      });

      it("should call handleClickIconEye when iconEye is clicked", () => {});
    });

    describe("handleClickNewBill()", () => {
      it("should call onNavigate with the NewBill route path", () => {});
    });

    describe("handleClickIconEye()", () => {
      it("should retrieve the data-bill-url attribute from the icon element", () => {
        // /src/containers/Bills.js l24
        // expect(votreVariable).toHaveAttribute('data-bill-url');
      });

      it("should calculate the image width based on #modaleFile width", () => {
        // /src/containers/Bills.js l25
        /*        
        Appeler l'extrait de code et stocker la valeur imgWidth résultante
        const imgWidth = Math.floor($('#modaleFile').width() * 0.5);

        Vérifier que la largeur de l'image (imgWidth) est calculée correctement
        expect(imgWidth).toEqual(960);
        */
      });

      it("should set the modal with the correct HTML element", () => {
        // /src/container.Bills.js l26
        // expect(modalBodyContent).toEqual(expectedHTML);
      });

      it("should set the <div> HTML element with the right class and attribute", () => {
        // /src/containers/Bills.js l26
        // expect(generatedDiv.hasClass('bill-proof-container')).toBeTruthy();
        // expect(generatedDiv.css('text-align')).toEqual('center');
      });

      it("should set the <img> HTML element with the rigth attribute", () => {
        // /src/container.Bills.js l26
        /*
        expect(generatedImg.attr('width')).toEqual(String(imgWidth));
        expect(generatedImg.attr('src')).toEqual(billUrl);
        expect(generatedImg.attr('alt')).toEqual('Bill');
        */
      });

      it("should find the element define with #modaleFile or .modal-body ", () => {
        // /src/container.Bills.js l26
        /* 
          expect(modalBodyContent).toBeNull();
          expect(generatedDiv.length).toBe(0);
        */
      });
    });
  });

  describe("Others", () => {
    describe("When click on new bill button", () => {
      it("Should open a NewBill page", () => {
        // /src/containers/Bills.js l20
      });
    });

    describe("When click on an Eye icon", () => {
      it("should open a new Bill modal", () => {});
    });
  });
});

// test d'intégration GET

describe("Given I am a user connected as an Employee", () => {
  describe("When I navigate to Dashboard", () => {
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

      // screen.getByText : full string match
      await waitFor(() => screen.getByText("Mes notes de frais"));

      // Recuperer depuis le fichier app/format.js
      const contentPending = await screen.getByText("En attente");
      const contentRefused = await screen.getByText("Refused");
      const contentAccepted = await screen.getByText("Accepté");

      expect(contentPending).toBeTruthy();
      expect(contentRefused).toBeTruthy();
      expect(contentAccepted).toBeTruthy();
      expect(screen.getByTestId("big-billed-icon")).toBeTruthy();
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

        window.onNavigate(ROUTES_PATH.Dashboard);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
