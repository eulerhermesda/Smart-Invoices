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
  nameList:['Invoices', 'New invoice']
};
var ACCOUNTSNAME = [
  {address : '0x76d499C529cc06323EA0c5d5edcf9B11c02597cB',
   name : 'Air France'},  
  {address : '0xC30F6af2c92eFd81DC27D30ccD573B0dA675D3b1',
   name : 'Peugeot'},
  {address : '0x8764eAD14051407D2761FeE6fab8597B07FE803c',
   name : 'Seller'},
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
          <span> Your web3 provider didn't return an account in time, are you sure you have one?</span>
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

      invoices : [{
        Id : 0,
        Buyer: '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
        Seller:'0x76d499c529cc06323ea0c5d5edcf9b11c02597cb',
        Amount : 50,
        Unit : '€',
        DueDate:'13/04/2017',
        Status:'',
        SellerApproved: 1,
        BuyerApproved:0,
        BuyerPaid : 0,
        SellerGotPaid: 0,
        ServiceAttached : [] // for the TCI
      },
      {
        Id : 1,
        Buyer: '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
        Seller:'0x8764eAD14051407D2761FeE6fab8597B07FE803c',
        Amount : 100,
        Unit : '$',
        DueDate:'09/04/2017',
        Status:'',
        SellerApproved: 1,
        BuyerApproved:1,
        BuyerPaid : 0,
        SellerGotPaid: 0,
        ServiceAttached : [] // for the TCI
      },
      {
        Id : 2,
        Buyer: '0x8764eAD14051407D2761FeE6fab8597B07FE803c',
        Seller:'0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
        Amount : 150,
        Unit : '£',
        DueDate:'15/06/2017',
        Status:'',
        SellerApproved: 1,
        BuyerApproved:0,
        BuyerPaid : 0,
        SellerGotPaid: 0,
        ServiceAttached : [] // for the TCI
      },
      {
        Id : 3,
        Buyer: '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
        Seller:'0x8764eAD14051407D2761FeE6fab8597B07FE803c',
        Amount : 200,
        Unit : '€',
        DueDate:'15/05/2017',
        Status:'',
        SellerApproved: 1,
        BuyerApproved:1,
        BuyerPaid : 0,
        SellerGotPaid: 1,
        ServiceAttached : [] // for the TCI
      },
      {
        Id : 4,
        Buyer: '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
        Seller:'0x76d499c529cc06323ea0c5d5edcf9b11c02597cb',
        Amount : 300,
        Unit : '€',
        DueDate:'17/06/2017',
        Status:'',
        SellerApproved: 1,
        BuyerApproved:1,
        BuyerPaid : 0,
        SellerGotPaid: 0,
        ServiceAttached : [] // for the TCI
      },

      ],
      
      invoiceSelected: null,     

    };
  }

  render(){
    // Here we determine the status of the invoice
    
    this.state.invoices.map(function(Id,index){
      var status = null;
      var sBuyerApproved = this.state.invoices[index].BuyerApproved;
      var sBuyerPaid = this.state.invoices[index].BuyerPaid;
      var sSellerApproved = this.state.invoices[index].SellerApproved;
      var sSellerGotPaid = this.state.invoices[index].SellerGotPaid;

      
      var parts =this.state.invoices[index].DueDate.split('/');
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
        this.state.invoices[index].BuyerPaid = 1;
        status = "Paid";
      }

      else{
        status = 'Awaiting Payment';
      }

      this.state.invoices[index].Status=status;
      
    },this
    );



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

    var q = new Date();
    var m = q.getMonth();
    var d = q.getDate();
    var y = q.getFullYear();
    var date = new Date(y,m,d);
    
    var seller = document.getElementById('seller');
    var buyer = document.getElementById('buyer');
    var amount = document.getElementById('amount');
    var dueDate = document.getElementById('dueDate');
    var unit = document.getElementById('unit');

    var invoice = {
      Id : 0,
      Buyer: buyer.value,
      Seller:seller.value,
      amount : amount.value,
      currency : unit.value,
      DueDate:dueDate.value,
      IssueDate : date,
      Status:'',
      SellerApproved: 1,
      BuyerApproved:0,
      BuyerPaid : 0,
      SellerGotPaid: 0,
      ServiceAttached : [] // for the TCI
    }var invoice = {
   string amount;
   string currency;
   string dueAt;
   string issueAt;
   address owner;
   address counterpart;
   bool sellerHasValidate;
   bool buyerHasValidate;
   bool sellerGotPaid;
   bool HasTCI;
   uint index;
 }

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
              <form method='post' onsubmit='manualEntry()'>
                <div>
                  <p>
                    <label for='seller'>Seller</label><br/>

                    <select name='seller' size='1' id='seller'>
                       {buyerList}
                    </select>
                  </p>


                  <p>
                    <label for='buyer'>Buyer</label><br/>

                    <select name='buyer' size='1' id='buyer'>
                      {buyerList}
                    </select>
                  </p>

                   <p>
                    <label for='amount'>Amount</label><br/>
                    <input type="number" name="amount"  className= "amount" id="amount"/>
                  
                    <select name='buyer' className="unit" size='1' id='buyer'>
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
                <input type='submit' name='Submit' value='Submit' onClick={()=>this.createInvoice()}/>
              </form>
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
    alert('Invoice Approved');
  }

  declarePayment(index){
    alert('Invoice Paid');
  }

  subscribeTCI(index){
    alert('Subscribing to TCI');
  }

  declareClaim(index){
    alert('Declaring a claim');
  }

  archive(index){
    alert('Invoice Archived');
  }

  statusAction(index){

    // Invoice statuses

    var waitingForApproval = this.props.state.invoices[index].Status == "Waiting for Approval";
    var late = this.props.state.invoices[index].Status == 'Late'; 
    var paid = this.props.state.invoices[index].Status == 'Paid';
    var awaitingPayment = this.props.state.invoices[index].Status == 'Awaiting Payment';

    var iAmBuyer = this.props.state.invoices[index].Buyer.toLowerCase() == web3.eth.accounts[0].toLowerCase();
    var buyerApproved = this.props.state.invoices[index].BuyerApproved;
    var iAmSeller = this.props.state.invoices[index].Seller.toLowerCase() == web3.eth.accounts[0].toLowerCase();
    var sellerApproved = this.props.state.invoices[index].SellerApproved;
    var buyerPaid = this.props.state.invoices[index].BuyerPaid;
    var sellerGotPaid = this.props.state.invoices[index].SellerGotPaid;


    if (waitingForApproval){
        if ((iAmBuyer && !buyerApproved) ||( iAmSeller && !sellerApproved))
          return( <div className="invoiceActionInside" onClick={() => this.approveInvoice(index)}>Approve Invoice</div>);

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
    var iAmSeller = this.props.state.invoices[index].Seller.toLowerCase() == web3.eth.accounts[0].toLowerCase();
    if (iAmSeller){
      if (this.props.state.invoices[index].ServiceAttached == ''){
        return(<div className="serviceActionInside" onClick={() => this.subscribeTCI(index)}>Subscribe to a TCI</div>);
      }
      else if (this.props.state.invoices[index].Status == "Late"){
        return(<div className="serviceActionInside" onClick={() => this.declareClaim(index)}>Declare a claim</div>);
      }
      else
        return(<div className="serviceActionInsideInactive" >Insurance registered</div>);
    }

  }


  render(){
    
    var invoiceList = this.props.state.invoices.map(function(Id,index){ 
      var buyerTmp = this.props.state.invoices[index].Buyer; 
          
      if (buyerTmp.toLowerCase() == web3.eth.accounts[0].toLowerCase())
        buyerTmp = "You";

      var sellerTmp = this.props.state.invoices[index].Seller;
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
                      <span className="amount">Amount : {this.props.state.invoices[index].Amount} {this.props.state.invoices[index].Unit}</span>

                    </div>
                    <div className="content">
                      <span className="seller">Seller : {sellerTmp}</span>
                      <span className="amount">Due : {this.props.state.invoices[index].DueDate}</span>
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
                      <span className="amount">Amount : {this.props.state.invoices[index].Amount} {this.props.state.invoices[index].Unit}</span>

                    </div>
                    <div className="content">
                      <span className="seller">Seller : {sellerTmp}</span>
                      <span className="amount">Due : {this.props.state.invoices[index].DueDate}</span>
                    </div>

                    <div className="content">
                      <span className="sellerApproved">Seller approved : {this.props.state.invoices[index].SellerApproved? "Yes" : "No"}</span>
                      <span className="buyerApproved">Buyer approved: {this.props.state.invoices[index].BuyerApproved? "Yes" : "No"}</span>
                    </div>

                    <div className="content">
                      <span className="sellerApproved">Seller got paid : {this.props.state.invoices[index].SellerGotPaid? "Yes" : "No"}</span>
                      <span className="buyerApproved">Buyer paid: {this.props.state.invoices[index].BuyerPaid? "Yes" : "No"}</span>
                    </div>

                    <div className="content">
                      <span className="status">Status : {this.props.state.invoices[index].Status}</span>
                      
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