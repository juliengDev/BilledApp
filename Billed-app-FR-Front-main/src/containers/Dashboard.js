import { formatDate } from "../app/format.js";
import DashboardFormUI from "../views/DashboardFormUI.js";
import BigBilledIcon from "../assets/svg/big_billed.js";
import { ROUTES_PATH } from "../constants/routes.js";
import USERS_TEST from "../constants/usersTest.js";
import Logout from "./Logout.js";

export const filteredBills = (data, status) => {
  return data && data.length
    ? data.filter((bill) => {
        let selectCondition;

        // in jest environment
        if (typeof jest !== "undefined") {
          selectCondition = bill.status === status;
        } else {
        /* istanbul ignore next */
          // in prod environment
          const userEmail = JSON.parse(localStorage.getItem("user")).email;
          selectCondition =
            bill.status === status &&
            ![...USERS_TEST, userEmail].includes(bill.email);
        }

        return selectCondition;
      })
    : [];
};

export const card = (bill) => {
  const firstAndLastNames = bill.email.split("@")[0];
  const firstName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[0]
    : "";
  const lastName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[1]
    : firstAndLastNames;

  return `
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${
    bill.id
  }'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `;
};

export const cards = (bills) => {
  return bills && bills.length ? bills.map((bill) => card(bill)).join("") : "";
};

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending";
    case 2:
      return "accepted";
    case 3:
      return "refused";
  }
};

export default class {
  /*  le constructeur initialise les propriétés de l'objet créé et configure les gestionnaires d'événements pour les icônes de flèche. 
  Il crée également une instance de la classe Logout pour la gestion de la déconnexion.*/
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    $("#arrow-icon1").click((e) => this.handleShowTickets(e, bills, 1)); // index : pending
    $("#arrow-icon2").click((e) => this.handleShowTickets(e, bills, 2)); // index : accepted
    $("#arrow-icon3").click((e) => this.handleShowTickets(e, bills, 3)); // index : refused
    new Logout({ localStorage, onNavigate });
  }

  /* Récupère l'URL d'une image à partir d'un élément, la place dans une modale, 
 puis affiche la modale pour montrer l'image en plein écran. */
  handleClickIconEye = () => {
    const billUrl = $("#icon-eye-d").attr("data-bill-url");
    const imgWidth = Math.floor($("#modaleFileAdmin1").width() * 0.8);
    $("#modaleFileAdmin1")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`
      );
    if (typeof $("#modaleFileAdmin1").modal === "function")
      $("#modaleFileAdmin1").modal("show");
  };

  handleEditTicket(e, bill, bills) {
    let logTest = {
      fn_handleEditTicket_this_counter: this.counter,
      fn_handleEditTicket_this_id: this.id,
      fn_handleEditTicket_bill_id: bill.id,
      fn_handleEditTicket_this_index: this.index,
    };
    console.log(logTest);

    /* Vérifie si la propriété counter de l'instance est indéfinie ou si la propriété id de l'instance est différente de l'id de la facture fournie (bill.id). 
    Si l'une de ces conditions est vérifiée, elle initialise la propriété counter à 0 */
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0;

    /* Vérifie si la propriété id de l'instance est indéfinie ou si la propriété id de l'instance est différente de l'id de la facture fournie (bill.id). 
    Si l'une de ces conditions est vérifiée, elle initialise la propriété id a l'id de la facture (bill.id). */
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id;
    /*  */

    // Si la propriété counter de l'instance est pair
    if (this.counter % 2 === 0) {
      bills.forEach((b) => {
        /* Pour chaque facture b, on sélectionne l'élément HTML correspondant à l'ID open-bill suivi de l'id de la facture (#open-bill${b.id}) 
        et modifie sa couleur de fond en lui attribuant la valeur #0D5AE5 (bleu fonce) */
        $(`#open-bill${b.id}`).css({ background: "#0D5AE5" });
      });
      /* On sélectionne l'élément HTML correspondant à l'ID open-bill suivi de l'id de la facture actuelle (#open-bill${bill.id}) et modifie 
      sa couleur de fond en lui attribuant la valeur #2A2B35 (noir) */
      $(`#open-bill${bill.id}`).css({ background: "#2A2B35" });
      /* sélectionne tous les éléments <div> de la classe dashboard-right-container dans le document HTML et remplace leur contenu HTML par 
      celui généré par la fonction DashboardFormUI en utilisant la facture actuelle (bill) comme argument.*/
      $(".dashboard-right-container div").html(DashboardFormUI(bill));
      /* sélectionne tous les éléments de classe vertical-navbar dans le document HTML et modifie leur hauteur CSS en lui attribuant la valeur '150vh'. */
      $(".vertical-navbar").css({ height: "150vh" });
      // On incremente la variable counter de 1
      this.counter++;
    } else {
      /* On sélectionne l'élément HTML correspondant à l'ID open-bill suivi de l'id de la facture actuelle (#open-bill${bill.id}) et modifie 
      sa couleur de fond en lui attribuant la valeur #0D5AE5.*/
      $(`#open-bill${bill.id}`).css({ background: "#0D5AE5" });
      /* sélectionne tous les éléments <div> de la classe dashboard-right-container dans le document HTML et remplace leur contenu HTML par une chaîne 
      de caractères contenant une balise <div> avec l'ID big-billed-icon et un attribut data-testid égal à big-billed-icon. Cette balise contient 
      potentiellement une icône ou un contenu graphique lié à une facture importante.*/
      $(".dashboard-right-container div").html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `);
      /* On sélectionne tous les éléments de classe vertical-navbar dans le document HTML et modifie leur hauteur CSS en lui attribuant la valeur '120vh'. */
      $(".vertical-navbar").css({ height: "120vh" });
      // On incremente la variable counter de 1
      this.counter++;
    }
    /* On attache des gestionnaires d'événements au clic sur l'élément HTML avec l'ID icon-eye-d, 
    ainsi qu'aux boutons avec les ID btn-accept-bill et btn-refuse-bill. Les gestionnaires */
    $("#icon-eye-d").click(this.handleClickIconEye);
    $("#btn-accept-bill").click((e) => this.handleAcceptSubmit(e, bill));
    $("#btn-refuse-bill").click((e) => this.handleRefuseSubmit(e, bill));
  }

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "accepted",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "refused",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };

  /* la méthode handleShowTickets gère le comportement d'affichage des tickets dans l'interface utilisateur en fonction 
   de l'index fourni. Elle permet d'ouvrir ou de fermer un conteneur de tickets correspondant à un certain statut en modifiant 
   la rotation de l'icône, en mettant à jour le contenu du conteneur et en attachant des gestionnaires d'événements pour éditer 
   les tickets.*/
  handleShowTickets(e, bills, index) {
    console.log("Fn handleShowTickets - this.counter :", this.counter);
    console.log("Fn handleShowTickets - this.index :", this.index);
    if (this.counter === undefined || this.index !== index) this.counter = 0;
    if (this.index === undefined || this.index !== index) this.index = index;
    if (this.counter % 2 === 0) {
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(0deg)" });
      $(`#status-bills-container${this.index}`).html(
        cards(filteredBills(bills, getStatus(this.index)))
      );
      this.counter++;
    } else {
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(90deg)" });
      $(`#status-bills-container${this.index}`).html("");
      this.counter++;
    }
    // ########## [Bug Hunt] - Dashboard ##########
    bills.forEach((bill) => {
      // Supprime tous les gestionnaires d'evenements "click" attachés à l'élément avec l'ID open-bill suivi de l'ID spécifique du bill.
      $(`#open-bill${bill.id}`).off("click");
      // Attache un nouveau gestionnaire d'événements "click" à l'élément avec l'ID open-bill suivi de l'ID spécifique du bill.
      $(`#open-bill${bill.id}`).on("click", (e) =>
        this.handleEditTicket(e, bill, bills)
      );
    });

    // Default
    // bills.forEach(bill => {
    //   $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
    // })

    return bills;
  }

  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => ({
            id: doc.id,
            ...doc,
            date: doc.date,
            status: doc.status,
          }));
          return bills;
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .then((bill) => bill)
        .catch(console.log);
    }
  };
}
