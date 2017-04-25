//Source d'erreur: -Les if avec bool / -L'event default / -La clé de l'API / -L'appel de l'api avec oraclize

//Contracts deployement
var abi =   [
    {
      "constant": true,
      "inputs": [
        {
          "name": "adresse",
          "type": "address"
        }
      ],
      "name": "getLengthSeller",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "insertElement",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "seller",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "buyer",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "adresse",
          "type": "address"
        }
      ],
      "name": "getLengthBuyer",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getNum",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "amount",
          "type": "string"
        },
        {
          "name": "currency",
          "type": "string"
        },
        {
          "name": "dueAt",
          "type": "string"
        },
        {
          "name": "issueAt",
          "type": "string"
        },
        {
          "name": "sellerAddress",
          "type": "address"
        },
        {
          "name": "buyerAddress",
          "type": "address"
        }
      ],
      "name": "createInvoice",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "adresse",
          "type": "address"
        }
      ],
      "name": "searchIndex",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "testNum",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getTabLength",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tab",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "changeValue",
      "outputs": [],
      "payable": false,
      "type": "function"
    }
  ];
var MyContract = web3.eth.contract(abi);
var central = MyContract.at('0x2f27d8de174ff9430e4d255e5807c18051cfba5c');

//Length of the array
var sellerLength = 0;
var buyerLength = 0;
var passed = false;

//Store the promise response (TCI)  /!\ Afficher le bouton "Pay" ssi !Rejected
var tmpTCI = {
  id:"",
  status:"",
  amount: 0,
  currency: ""
};

//Add Invoices
function addInvoice(invoice){ // /!\ Ne pas oublier de metrre les radio sur l'interface pour mettre à true par défaut si buyer ou seller
    central.createInvoice(invoice.amount, invoice.currency, invoice.dueAt, invoice.issueAt, invoice.sellerAddress, invoice.buyerAddress, {from : web3.eth.accounts[0]}, function(error,res){
      if (error != null)
        console.error(error);
      else{
      console.log("res:" + res);
      central.searchIndex(invoice.sellerAddress, function(error,lastIndex){
        console.log("index:" + lastIndex);
        console.log("invoice: " + invoice.sellerAddress);
        central.seller[invoice.sellerAddress][lastIndex].secondInitialisation(invoice.sellerHasValidate, {from : web3.eth.accounts[0]}, function(error,res){  // /!\ Ne pas oublier à ajouter buyerHasValidate à Invoice de l'interface ET il ya deux struct i,nvoice (ajouter et afficher)
          console.log("secondConstructor:" + res);
        });
      });
    }});
}

//Get Invoices (done)
function getInvoices(address, Page){
  var invoices = [];
  var invoice = {
    amount: 0,
    currency: "",
    dueAt: "",
    issueAt:"",
    sellerAddress:"",
    buyerAddress: "",
    sellerHasValidate: 0,
    buyerHasValidate: 0,
    sellerGotPaid: 0,
    HasTCI: 0,
    IsSeller: 0,
    indexSeller: 0,
    indexBuyer: 0,
    status : '', //just for the interface
    ServiceAttached: '',
    eventInvoice: null // erreur ?
  };

  console.log(address);
  //Get the length of the array
  central.getLengthBuyer(address, {from : web3.eth.accounts[0]}, function(res){
    buyerLength = res;
    console.log("buyerLength = " + res);
    central.getLengthSeller(address, {from : web3.eth.accounts[0]}, function(res){
      sellerLength = res;
      console.log("sellerLength = " + res);

      //Get the buyer content
      if(buyerLength == null){}
      else{
        //Parcours de buyer
        for (var i = 0; i < buyerLength; i++) {
          invoice.amount = central.buyer[address][i]._invoice.amount;
          invoice.currency = central.buyer[address][i]._invoice.currency;
          invoice.dueAt = central.buyer[address][i]._invoice.dueAt;
          invoice.issueAt = central.buyer[address][i]._invoice.issueAt;
          invoice.sellerAddress = central.buyer[address][i]._invoice.sellerAddress;
          invoice.buyerAddress = central.buyer[address][i]._invoice.buyerAddress;
          invoice.sellerHasValidate = central.buyer[address][i]._invoice.sellerHasValidate;
          invoice.buyerHasValidate = central.buyer[address][i]._invoice.buyerAddress;
          invoice.sellerGotPaid = central.buyer[address][i]._invoice.sellerGotPaid;
          invoice.HasTCI = central.buyer[address][i]._invoice.HasTCI;
          invoice.IsSeller = 0;
          invoice.indexSeller = central.buyer[address][i]._invoice.indexSeller;
          invoice.indexBuyer = central.buyer[address][i]._invoice.indexBuyer;
          var event = central.buyer[address][i]._tci.InDefault(function(error, result) {
            if (!error)
                console.log(result);
                alert(result);
          });
          invoice.eventInvoice = event;
          invoice.ServiceAttached = central.buyer[address][i]._tci.IdTransaction;
          //Ajout au tableau
          invoices.concat(invoice);
        }
      }
      //Get the seller content
      if(sellerLength == null){}
      else{
        //Parcours de seller
        for (var i = 0; i < sellerLength; i++) {
          invoice.amount = central.seller[address][i]._invoice.amount;
          invoice.currency = central.seller[address][i]._invoice.currency;
          invoice.dueAt = central.seller[address][i]._invoice.dueAt;
          invoice.issueAt = central.seller[address][i]._invoice.issueAt;
          invoice.sellerAddress = central.seller[address][i]._invoice.sellerAddress;
          invoice.buyerAddress = central.seller[address][i]._invoice.buyerAddress;
          invoice.sellerHasValidate = central.seller[address][i]._invoice.sellerHasValidate;
          invoice.buyerHasValidate = central.seller[address][i]._invoice.buyerAddress;
          invoice.sellerGotPaid = central.seller[address][i]._invoice.sellerGotPaid;
          invoice.HasTCI = central.seller[address][i]._invoice.HasTCI;
          invoice.IsSeller = 1;
          invoice.indexSeller = central.seller[address][i]._invoice.indexSeller;
          invoice.indexBuyer = central.seller[address][i]._invoice.indexBuyer;
          var event = central.seller[address][i]._tci.InDefault(function(error, result) {
            if (!error)
                console.log(result);
                echo(result);
          });
          invoice.eventInvoice = event;
          //Ajout au tableau
          invoices.concat(invoice);
        }
      }
      //Return invoices
      Page.state.invoices = invoices;
      Page.state.passed = true;
      Page.forceUpdate();
    });
  });
}

//Declare Payement (done)
function payementDeclaration(sellerAddress, buyerAddress, indexSeller){
  central.seller[sellerAddress][indexSeller].gotPaid(true);
}

//Form TCI
function TCI_form(invoice){
  //Open the popup
  var haut=(screen.height-500)/2;
  var gauche=(screen.width-900)/2;
  var fenetre = open("tci_form.html", "target", "top="+haut+", left="+gauche+", toolbar=0, center=1, directories=1, status=1, menubar=1, width=900, height=500, scrollbars=1, location=0, resizable=1")
  fenetre.focus();
  //Search the names from the adress
  var sellerName = "";
  var buyerName = "";
  for (var i = 0; i < ACCOUNTSNAME.length; i++) {
    if (invoice.sellerAddress == ACCOUNTSNAME[i].address) {
      sellerName = ACCOUNTSNAME[i].name;
    }
    if (invoice.buyerAddress == ACCOUNTSNAME[i].address) {
      buyerName = ACCOUNTSNAME[i].name;
    }
  }
  //Display the information
  document.getElementById('body').innerHTML =
  '<div className="dapp-flex-content">'
    +  '<aside className="dapp-aside">'
    +  '</aside>'
    + ' <main className="dapp-content">'

    +    '<div className="dapp-container">'
    +      '<h1>Your invoice info:</h1>'
    +      '<div>'
    +        '<form method="post">'
    +          '<div>'
    +            '<p>'
    +              '<label for="seller">Seller</label><br/>'
    +              '<input type="text" name="seller"  className= "seller" id="seller" value=""+sellerName+"" disabled/>'
    +            '</p>'

    +            '<p>'
    +              '<label for="buyer">Buyer</label><br/>'
    +              '<input type="text" name="buyer"  className= "buyer" id="buyer" value=""+buyerName+"" disabled/>'
    +            '</p>'

    +             '<p>'
    +              '<label for="amount">Amount</label><br/>'
    +              '<input type="text" name="amount"  className= "amount" id="amount" value=""+invoice.amount+invoice.currency +"" disabled/>'
    +            '</p>'

    +            '<p>'
    +              '<label for="issueDate">Due Date</label><br/>'
    +              '<input type="text" name="issueDate" id="issueDate" value=""+invoice.issueAt+"" disabled/>'
    +            '</p>'

    +            '<p>'
    +              '<label for="dueDate">Due Date</label><br/>'
    +              '<input type="text" name="dueDate" id="dueDate" value=""+invoice.dueAt+"" disabled/>'
    +            '</p>'
    +          '</div>'
    +          '<input type="submit" name="Submit" value="Estimate TCI" onClick="display_request(invoice)"/>'
    +        '</form>'
    +      '</div>'
    +    '</div>'

    +  '</main>'
    +'</div>';

}

//Call the API
function API_Request( _sellerId, _buyerId, invoice_Amount, invoice_currency, invoice_dueAt, invoice_issueAt){
  // Example assumes the packages request and request-promise have been installed (npm install request request-promise)
  var rp = require('request-promise');

  var apiBaseUri = 'https://api.armadill.io/v2.0';
  var apikey = '01lIg2SjLOas61KpZX7fIF6VAhhZBZVkNcI3TkEKm8HFbyAvh5u6aREzoUZsi';

  rp({
    method: 'POST',
    uri: apiBaseUri + '/coverage',
    headers: {
      apikey: apikey,
    },
    body: {
      sellerid : _sellerId,
      buyerid : _buyerId,
      invoice : {
        amount: invoice_Amount,
        currency: invoice_currency, //ex: "eur"
        dueAt : invoice_dueAt, // ex: "2016-10-10"
        issuedAt : invoice_issueAt
      }
    },
    json: true
  })
    .then(function (res) {
      // request succeeded, the result is available in the res object
      tmpTCI.id = res.Id;
      tmpTCI.status = res.Status;
      tmpTCI.amount = res.Coverage.Amount;
      tmpTCI.currency = res.Coverage.Currency;
    })
    .catch(function (err) {
      // request failed, the error is available in the err object
      console.log(err);
    });
}

//Display the request
function display_request(invoice){
  //Search the id from the adress
  var sellerId = "";
  var buyerId = "";
  for (var i = 0; i < ACCOUNTSNAME.length; i++) {
    if (invoice.sellerAddress == ACCOUNTSNAME[i].address) {
      sellerId = ACCOUNTSNAME[i].id;
    }
    if (invoice.buyerAddress == ACCOUNTSNAME[i].address) {
      buyerId = ACCOUNTSNAME[i].id;
    }
  }

  //Call the API
  API_Request(sellerId, buyerId, invoice.amount, invoice.currency, invoice.dueAt, invoice.issueAt);
  //Reload for display_request
  window.location.reload();
  //Display the TCI
  if(tmpTCI.status == "Rejected"){
    document.getElementById('body').innerHTML =
      '<div>'
    +   '<p> Euler Hermes can not provide coverage for the supplied invoice. </p> '
    +   '<button id="false" onClick="TCI_Validation(this, invoice)"> Ok </button>'
    + '</div>';
  }
  else{
    document.getElementById('body').innerHTML =
    '<div className="dapp-flex-content">'
      +  '<aside className="dapp-aside">'
      +  '</aside>'
      + ' <main className="dapp-content">'

      +    '<div className="dapp-container">'
      +      '<h1>Your TCI:</h1>'
      +      '<div>'
      +        '<form method="post">'
      +          '<div>'

      +            '<p>'
      +              '<label for="status">Status: </label><br/>'
      +              '<p type="text" name="status" id="status">""+tmpTCI.status+"" </p>'
      +            '</p>'

      +            '<p>'
      +              '<label for="amount">Cover amount: </label><br/>'
      +              '<p type="text" name="amount" id="amount">""+invoice.amount+invoice.currency +""</p>'
      +            '</p>'

      +          '</div>'

      +          '<button type="submit" id="true" onClick="TCI_Validation(this, invoice)"> Pay for this TCI </button>'
      +          '<button type="submit" id="false" onClick="TCI_Validation(this, invoice)"> Cancel </button>'
      +        '</form>'
      +      '</div>'
      +    '</div>'

      +  '</main>'
      +'</div>';
  }
}

//Add or not the tci to the contract
function TCI_Validation(form, invoice){
  if(form.id == "false"){
    window.location.close();
  }
  else{
    addTCI (invoice.sellerAddress, invoice.indexSeller, tmpTCI.id, tmpTCI.amount, tmpTCI.currency);
    window.location.close();
  }
}

//Add TCI (when click "PAID")
function addTCI (sellerAdress, indexSeller, idTransaction, amount, currency){
  central.seller[sellerAdress][indexSeller].createTCI(idTransaction, amount, currency).then(function(res){
    console.log("res: " + res);
  });
}

//Validation (done)
function invoiceValidation ( sellerAdress, IsSeller, indexSeller){
  central.seller[sellerAdress][indexSeller].Validation(IsSeller).then(function(res){ console.log("res: " + res); });
}

//Modification Récupérer les données lors du click dans la page modification
//(adress, index, amount, dueDate, IsSeller) Faire les test si c'est vide ou pas pour appeler la bonne fonction
function modification ( sellerAdress, indexSeller, IsSeller, amount, dueDate){
  if(dueDate == ''){
    central.seller[sellerAdress][indexSeller].modifcation_Amount(amount, IsSeller).then(function(res){ console.log("res: " + res); });
  }
  else if(amount == ''){
    central.seller[sellerAdress][indexSeller].modifcation_DueDate(amount, IsSeller).then(function(res){ console.log("res: " + res); });
  }
  else{
    central.seller[sellerAdress][indexSeller].modifcation_Both(amount, IsSeller).then(function(res){ console.log("res: " + res); });
  }
}

//Default
function declareDefault (sellerAdress, indexSeller){
  var IsVerified = true; //A redéfinir
  central.seller[sellerAdress][indexSeller]._tci.defaultPayment(IsVerified).then(function(res){console.log("res: " + res);});
}

//Search the owner
function searchOwner(address){
  var indexOwner = 0;
  for (var i = 0; i < ACCOUNTSNAME.length; i++) {
    if (address == ACCOUNTSNAME[i].address) {
      indexOwner = i;
    }
  }
  return indexOwner;
}
