sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        'sap/m/MessageBox',
        "sap/m/MessageToast"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("bookshop.bookscreate.controller.Main", {
            onInit: function () {
                this.getView().setModel(
                    new JSONModel({
                        ui: {
                        },
                        state: {
                        },
                        settings: {
                        }
                    }),
                    "view"
                );
                this.getOwnerComponent().getRouter()
                    .getRoute("mainRoute")
                    .attachMatched(this.onRouteMatched, this);
            },

            onRouteMatched: function (oEvent) {

            },

            onDeepCreateBook: function (oEvent) {
                let oModel = this.getView().getModel();
                let oList = this.getView().byId("booksList");
                let oListBinding = oList.getBinding("items")
                let data = {
                    book: {
                        title: "CAP actions 2024 A02",
                        descr: "A practical & working sample of custom action implemented with JavaScript UI extension which safes a consultant's life :p",
                        author: {
                            name: "Sky Mu"
                        }
                    }
                };
                let oAction = oModel.bindContext("/Books/AdminService.deepCreateBook(...)");
                oAction.setParameter("data", JSON.stringify(data));
                oAction.execute().then(
                    () => {
                        let oResult = oAction.getBoundContext().getObject();
                        oListBinding.requestRefresh();
                        MessageToast.show("Book Create Success by author " + oResult.author.name);
                    },
                    (oError) => {
                        if (!oError.canceled)
                            MessageBox.alert(oError.message, { icon: MessageBox.Icon.ERROR, title: "Error" });
                    }
                );
            }

        });
    }
);