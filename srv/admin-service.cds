using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'admin') {
  entity Books as projection on my.Books
    actions {
      @(
        cds.odata.bindingparameter.name: '_it',
        cds.odata.bindingparameter.collection
      )
      action deepCreateBook(data : String) returns Books;
    };
  entity Authors as projection on my.Authors;
}
