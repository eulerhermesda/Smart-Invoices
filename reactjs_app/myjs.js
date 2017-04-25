
//Import
var imported = document.createElement('script');
imported.src = './contract_interaction.js';
document.head.appendChild(imported);
// Loading web3
var Web3 = require('web3');
metamaskLoaded = 0;
if (typeof web3 !== 'undefined') {
  // If a web3 is already loaded i.e. metamask
  web3 = new Web3(web3.currentProvider);
  metamaskLoaded = 1;
} else {
  // Otherwise load the web3 provided in the html file and connect it to a local node
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var MENUDATA = {
  nameList:['Invoices', 'New invoice']  //Insérer les noms des nouvelles pages ici
};

var ACCOUNTSNAME = [
  {
    address : "0x76d499C529cc06323EA0c5d5edcf9B11c02597cB",
    id : "fdb3990c-b34e-4790-8233-b79358349e6c",
    name : "Total"
  },
  {
    address : "0x0041B7d47810bc4e82F4C2b82C962aFA53B3dC43",
    id : "b7663697-6c94-42b2-a11a-d842aa5ccdfa",
    name : "Air France"
  },
  {
    address : "0x8764eAD14051407D2761FeE6fab8597B07FE803c",
    id : "2df8ba88-4eb9-4151-aa41-64f10932e650",
    name : "Euler Hermes France"
  }
];

// The full page
class App extends React.Component{
  constructor(){
    super();
    this.state = {
      currentPage: 1,
      meName : null,
      himName : null,
      meAddress : null,
      himAddress : null,
      alert :[{}],

    };
  }

  handleMenuClick(i){
    this.setState({
      currentPage:i,
    })
  }

  handlePageClick(value,fields){
      if (this.state.currentPage == 0){

      }
      else if (this.state.currentPage == 1){

      }
      else if (this.state.currentPage == 2){

      }
  }

  render(){
    var tries = 0;
    while (web3.eth.accounts[0] == '' && tries < 100){sleep(100);tries++;}
    if (web3.eth.accounts[0] == ''){
      return (
        <div>
          <Menu
          entries = {this.props.menudata.nameList} onClick={(i)=>this.handleMenuClick(i)}
          accountsName = {this.props.accountsName}/>
          <span> Your web3 provider didnt return an account in time, are you sure you have one?</span>
        </div>
        );
    }
    return(
      <div>
        <Menu
          entries = {this.props.menudata.nameList} onClick={(i)=>this.handleMenuClick(i)}
          accountsName = {this.props.accountsName}/>
        <Page
          currentPage = {this.state.currentPage} currentAccount={web3.eth.accounts[0]}
          onClick={(value,fields)=> this.handlePageClick(value,fields)}
          accountsName = {this.props.accountsName}/>
      </div>
    );
  }
}
// The menu Bar
class Menu extends React.Component{
  render(){
    //console.log(web3.eth.accounts[0])
    //console.log(web3.eth.getTransactionsByAccount(web3.eth.accounts[0]))
    var menuEntries = this.props.entries.map(function(name,index){
      return (<a href="#" key={index} onClick={()=>this.props.onClick(index)}>
                  <i className="icon-envelope-letter"></i>
                  <span>{name}</span>
                </a>);

    },this);
    var nameOfAccount = this.props.accountsName[web3.eth.accounts[0]];
    return (
      <header className="dapp-header">

          <div className="menuOne">
            <nav>
              <ul>
                <li>
                  {menuEntries}
                </li>
              </ul>
            </nav>
          </div>
          <div className="menuTwo">
            Welcome {web3.eth.accounts[0]}!
          </div>

      </header>
      )
  }
}
// The content
class Page extends React.Component{
  constructor(){
    super();

    this.state = {
      invoices : null,
      passed : null,
      invoiceSelected: null,
    };

    getInvoices(web3.eth.accounts[0], this);
  }

  render(){
    console.log("before if : " + this.state.passed);
    if(!this.state.passed){
      getInvoices(web3.eth.accounts[0], this);
      console.log("Je suis entré dans le if");
    }
    this.state.passed = false;

    // Here we determine the status of the invoice
    console.log("Invoices: " + this.state.invoices);
    if(this.state.invoices != null){
      this.state.invoices.map(function(Id,index){
        var status = null;
        var sBuyerApproved = this.state.invoices[index].buyerHasValidate;
        //var sBuyerPaid = this.state.invoices[index].BuyerPaid;
        var sSellerApproved = this.state.invoices[index].sellerHasValidate;
        var sSellerGotPaid = this.state.invoices[index].sellerGotPaid;

        var parts = this.state.invoices[index].dueAt.split('/');
        var sInvoiceDueDate = new Date(parts[2],parts[1]-1,parts[0]);

        // Today's date
        var q = new Date();
        var m = q.getMonth();
        var d = q.getDate();
        var y = q.getFullYear();
        var date = new Date(y,m,d);

        // Invoice not approved if both parties didn't approve it. Going nowhere without that
        if (!sBuyerApproved || !sSellerApproved){
          status = "Waiting for Approval";
        }

        // Invoice approved but payment late
        else if ( sInvoiceDueDate < date && (!sSellerGotPaid)){
          status = "Late";
        }

        else if (sSellerGotPaid){
          //this.state.invoices[index].BuyerPaid = 1;
          status = "Paid";
        }

        else{
          status = 'Awaiting Payment';
        }

        this.state.invoices[index].status = status;

      },this
      );
    }

    if (this.props.currentPage == 1){
      return(<div>
          <InvoiceCreation onClick={(value,fields)=>this.props.onClick(value,fields)}
            />
        </div>
        );
    }


    else if (this.props.currentPage==0){
      return(<div>
          <InvoicesList onClick={(value,fields)=>this.props.onClick(value,fields)}
                        state = {this.state}
            />
        </div>
        );
    }
    else{
      return(<div>
          <Error
            />
        </div>
        );
    }

  }
}


// From now on those classes represent the different pages.

class InvoiceCreation extends React.Component{

  createInvoice(){
    //The owner is seller or not
    var indexOwner = searchOwner(web3.eth.accounts[0].toLowerCase());
    var buyerAddress = "";
    var sellerAddress = "";
    var sellerHasValidate_ = 0;
    //Set seller and buyer
    if(document.getElementById('seller').checked){
      sellerAddress = ACCOUNTSNAME[indexOwner].address;
      buyerAddress = counterpart.value;
      sellerHasValidate_ = 1;
    }
    else{
      sellerAddress = counterpart.value;
      buyerAddress = ACCOUNTSNAME[indexOwner].address;
      sellerHasValidate_ = 0;
    }

    var q = new Date();
    var m = q.getMonth();
    var d = q.getDate();
    var y = q.getFullYear();
    var date = new Date(y,m,d);

    var amount = document.getElementById('amount');
    var dueDate = document.getElementById('dueDate');
    var unit = document.getElementById('unit');

    var invoice = {
      Id : 0,
      buyerAddress: buyerAddress,
      sellerAddress: sellerAddress,
      amount : amount.value,
      currency : unit.value,
      dueAt: dueDate.value,
      issueAt : date,
      sellerHasValidate: sellerHasValidate_,
      Status:'',
      BuyerPaid : 0,
      SellerGotPaid: 0
      //ServiceAttached : [] // for the TCI but this will be after
    };
    console.log("Buyer Adress: " + invoice.buyerAddress);
    console.log("Seller Adress: " + invoice.sellerAddress);
    //Ajout d'invoice au contrat
    addInvoice(invoice);
  }

  render(){
    var buyerList = ACCOUNTSNAME.map(function(name,index){
      return(<option key={index} value={ACCOUNTSNAME[index].address}>{ACCOUNTSNAME[index].name}</option>);
    },this);
    return(<div className="dapp-flex-content">

        <aside className="dapp-aside">

        </aside>

        <main className="dapp-content">

          <div className="dapp-container">
            <h1>Enter your invoice info:</h1>
            <div>
             
                <div>
                  <p>
                    <label for='owner'>You are:</label><br/>
                    <input type="radio" name="type" id="seller" value="seller"> Seller </input> <br/>
                    <input type="radio" name="type" id="buyer" value="buyer"> Buyer </input>
                  </p>


                  <p>
                    <label for='counterpart'>Counterpart</label><br/>

                    <select name='counterpart' size='1' id='counterpart'>
                      {buyerList}
                    </select>
                  </p>

                   <p>
                    <label for='amount'>Amount</label><br/>
                    <input type="number" name="amount"  className= "amount" id="amount"/>

                    <select name='unit' className="unit" size='1' id='unit'>
                      <option value = "eur"> € </option>
                      <option value = "dol"> $ </option>
                      <option value = "pou"> £ </option>
                    </select>
                  </p>

                  <p>
                    <label for='dueDate'>Due Date</label><br/>
                    <input type="Date" name="dueDate" id="dueDate"/>
                  </p>
                </div>
                <button onClick={()=>this.createInvoice()}> Submit </button>
              
            </div>
          </div>

        </main>

        <aside className="dapp-actionbar">

        </aside>
      </div>
      );
  }
}

class InvoicesList extends React.Component{

  handleUpdate(){
    /* look for other alerts Ideally would show the status of the different
       invoices*/
  }

  handleClick(index){

    if (this.props.state.invoiceSelected == index){
      this.props.state.invoiceSelected = null;
    }
    else{
      this.props.state.invoiceSelected = index;
    }
    this.forceUpdate();
  }

  approveInvoice(index){
    console.log(this.props.state.invoices[index].sellerAddress);
    invoiceValidation(this.props.state.invoices[index].sellerAddress, this.props.state.invoices[index].buyerAddress, this.props.state.invoices[index].sellerHasValidate, this.props.state.invoices[index].indexSeller, this.props.state.invoices[index].indexBuyer);
  }

  declarePayment(index){
    console.log(this.props.state.invoices[index].sellerAddress);
    payementDeclaration(this.props.state.invoices[index].sellerAddress, this.props.state.invoices[index].buyerAddress, this.props.state.invoices[index].indexSeller);
  }

  subscribeTCI(index){
    TCI_form(this.props.state.invoices[index]);
  }

  declareClaim(index){
    console.log(this.props.state.invoices[index].sellerAddress);
    declareDefault (this.props.state.invoices[index].sellerAddress, this.props.state.invoices[index].indexSeller);
  }

  archive(index){
    alert('Invoice Archived');
  }

  statusAction(index){
    // Invoice statuses
    var waitingForApproval = this.props.state.invoices[index].status == "Waiting for Approval";
    var late = this.props.state.invoices[index].status == 'Late';
    var paid = this.props.state.invoices[index].status == 'Paid';
    var awaitingPayment = this.props.state.invoices[index].status == 'Awaiting Payment';

    var iAmBuyer = this.props.state.invoices[index].buyerAddress.toLowerCase() == web3.eth.accounts[0].toLowerCase();
    var buyerApproved = this.props.state.invoices[index].buyerHasValidate;
    var iAmSeller = this.props.state.invoices[index].sellerAddress.toLowerCase() == web3.eth.accounts[0].toLowerCase();
    var sellerApproved = this.props.state.invoices[index].sellerHasValidate;
    //var buyerPaid = this.props.state.invoices[index].BuyerPaid;
    var sellerGotPaid = this.props.state.invoices[index].sellerGotPaid;

    if (waitingForApproval){
        if ((iAmBuyer && !buyerApproved) ||( iAmSeller && !sellerApproved))
          return( <button className="invoiceActionInside" onClick={() => this.approveInvoice(index)}>Approve Invoice</button>);

        if(iAmBuyer && buyerApproved)
          return(<div className="invoiceActionInsideInactive" >Waiting Seller Approval</div>);

        if(iAmSeller && sellerApproved)
          return(<div className="invoiceActionInsideInactive" >Waiting Buyer Approval</div>);
      }
    if (late){
      if ((iAmSeller && !sellerGotPaid))
        return( <div className="invoiceActionInside" onClick={() => this.declarePayment(index)}>Declare Payment</div>);
      if ((iAmBuyer && !sellerGotPaid))
        return( <div className="invoiceActionInsideInactive" >Waiting for seller to get paid</div>);
    }

    if (paid){
        return( <div className="invoiceActionInside" onClick={() => this.archive(index)}>Archive</div>);
    }

    if (awaitingPayment){
      if (iAmSeller && !sellerGotPaid)
        return( <div className="invoiceActionInside" onClick={() => this.declarePayment(index)}>Declare Payment</div>);
      if ((iAmBuyer && !sellerGotPaid)){
        console.log('iAmBuyer')
        return( <div className="invoiceActionInsideInactive" >Waiting for seller to get paid</div>);
      }
    }



  }

  serviceAction(index){
    var iAmSeller = this.props.state.invoices[index].sellerAddress.toLowerCase() == web3.eth.accounts[0].toLowerCase();
    if (iAmSeller){
      if (!this.props.state.invoices[index].HasTCI){
        return(<div className="serviceActionInside" onClick={() => this.subscribeTCI(index)}>Subscribe to a TCI</div>);
      }
      else if (this.props.state.invoices[index].status == "Late"){
        return(<div className="serviceActionInside" onClick={() => this.declareClaim(index)}>Declare a claim</div>);
      }
      else
        return(<div className="serviceActionInsideInactive" >Insurance registered</div>);
    }

  }


  render(){

    var invoiceList = this.props.state.invoices.map(function(Id,index){
      var buyerTmp = this.props.state.invoices[index].buyerAddress;

      if (buyerTmp.toLowerCase() == web3.eth.accounts[0].toLowerCase())
        buyerTmp = "You";

      var sellerTmp = this.props.state.invoices[index].sellerAddress;
      if (sellerTmp.toLowerCase() == web3.eth.accounts[0].toLowerCase())
        sellerTmp = "You";

      var invoiceAction = this.statusAction(index);
      var serviceAction = this.serviceAction(index);

      if (buyerTmp == "You" || sellerTmp == "You"){
      if (this.props.state.invoiceSelected != index){
        return (<div key={index} >
                   <div className="invoiceSummary" onClick={()=>this.handleClick(index)}>
                    <div className="content">
                      <span className="buyer">Buyer : {buyerTmp}</span>
                      <span className="amount">Amount : {this.props.state.invoices[index].amount} {this.props.state.invoices[index].currency}</span>

                    </div>
                    <div className="content">
                      <span className="seller">Seller : {sellerTmp}</span>
                      <span className="amount">Due : {this.props.state.invoices[index].dueAt}</span>
                    </div>

                  </div>
                  <div className="invoiceAction">
                    {invoiceAction}
                  </div>


                  </div>);
      }
      else
        return (<div key={index}>
                   <div className="invoiceSummary" onClick={()=>this.handleClick(index)}>
                    <div className="content">
                      <span className="buyer">Buyer : {buyerTmp}</span>
                      <span className="amount">Amount : {this.props.state.invoices[index].amount} {this.props.state.invoices[index].currency}</span>

                    </div>
                    <div className="content">
                      <span className="seller">Seller : {sellerTmp}</span>
                      <span className="amount">Due : {this.props.state.invoices[index].dueAt}</span>
                    </div>

                    <div className="content">
                      <span className="sellerApproved">Seller approved : {this.props.state.invoices[index].sellerHasValidate? "Yes" : "No"}</span>
                      <span className="buyerApproved">Buyer approved: {this.props.state.invoices[index].buyerHasValidate? "Yes" : "No"}</span>
                    </div>

                    <div className="content">
                      <span className="sellerApproved">Seller got paid : {this.props.state.invoices[index].sellerGotPaid? "Yes" : "No"}</span>
                      //<span className="buyerApproved">Buyer paid: {this.props.state.invoices[index].BuyerPaid? "Yes" : "No"}</span>
                    </div>

                    <div className="content">
                      <span className="status">Status : {this.props.state.invoices[index].status}</span>

                    </div>

                  </div>
                  <div className="invoiceAction">
                    {invoiceAction}
                  </div>
                  <div className="serviceAction">
                    {serviceAction}
                  </div>
                  </div>);
    }

    },this);



    return(
      <div className="dapp-flex-content">

        <aside className="dapp-aside">

        </aside>

        <main className="dapp-content">
          <div className="dapp-container">
            <h1>Your invoices<em></em></h1>
              <div id="wrap">
                {invoiceList}
            </div>

          </div>

        </main>

        <aside className="dapp-actionbar">

        </aside>
      </div>
      );
  }

}

class Error extends React.Component{
  render(){
    return(
      <div className="dapp-flex-content">

        <aside className="dapp-aside">

        </aside>

        <main className="dapp-content">
          <div className="dapp-container">
            <h1>Error : The Page you requested does not exist</h1>


          </div>

        </main>

        <aside className="dapp-actionbar">

        </aside>
      </div>
      );
  }

}


ReactDOM.render(<App menudata={MENUDATA} accountsName = {ACCOUNTSNAME}/>,
document.getElementById('content') );
