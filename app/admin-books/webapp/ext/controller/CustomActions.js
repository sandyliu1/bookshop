sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {
        onDeepCreateBook: function (oEvent) {
            return new Promise(async function (fnResolve, fnReject) {
                let oExtensionAPI = this;
                let oListItemsBinding = oExtensionAPI.getModel().aBindings.filter(it => it.sPath === "/Books")[0];
                let data = {
                    book: {
                        title: "CAP actions 2024 A01",
                        descr: "A practical & working sample of custom action implemented with JavaScript UI extension which safes a consultant's life :p",
                        author: {
                            name: "Sky Mu"
                        }
                    }
                };
                let sActionName = "AdminService.deepCreateBook";
                let mParameters = {
                    applicableContexts: null,
                    bStaticAction: true,
                    contexts: null,
                    controlId: "fe::table::Books::LineItem",
                    entitySetName: "Books",
                    invocationGrouping: "Isolated",
                    isNavigable: false,
                    model: oExtensionAPI.getModel(),
                    notApplicableContexts: null,
                    parameterValues: [
                        {
                            name: 'data', value: JSON.stringify(data)
                        }
                    ],
                    skipParameterDialog: true,
                    operationAvailableMap: {}
                };
                oExtensionAPI.editFlow.invokeAction(sActionName, mParameters).then(
                    function (oContext) {
                        oListItemsBinding.requestRefresh();
                        MessageToast.show("Book Create Success");
                        fnResolve();
                    }).catch((err) => {
                        fnReject(err);
                    });
            }.bind(this));
        }
    };
});
