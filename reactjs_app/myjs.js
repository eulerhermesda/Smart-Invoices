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

var ACCOUNTSNAME = {
  '0x76d499C529cc06323EA0c5d5edcf9B11c02597cB':'Seller',
  '0xC30F6af2c92eFd81DC27D30ccD573B0dA675D3b1':'Buyer',
  '0x8764eAD14051407D2761FeE6fab8597B07FE803c': 'Euler Hermes'
}

// The full page
class App extends React.Component{
  constructor(){
    super();
    this.state = {
      currentPage: 0,
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
      invoiceId : [0,1,2,3,4],
      invoiceBuyer : ['0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
                      '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
                      '0x8764eAD14051407D2761FeE6fab8597B07FE803c',
                      '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
                      '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1'],
      invoiceSeller: ['0x76d499C529cc06323EA0c5d5edcf9B11c02597cB',
                      '0x8764eAD14051407D2761FeE6fab8597B07FE803c',
                      '0xc30f6af2c92efd81dc27d30ccd573b0da675d3b1',
                      '0x8764eAD14051407D2761FeE6fab8597B07FE803c',
                      '0x76d499C529cc06323EA0c5d5edcf9B11c02597cB'],
      invoiceAmount : [50,100,150,200,300],
      invoiceUnit : ["€", "$", "£","€","€"],
      invoiceDueDate: ['13/04/2017', '09/04/2017','15/06/2017','15/05/2017','17/06/2017'],
      invoiceStatus : ['', '','','',''],
      invoiceSellerApproved : [1,1,0,1,1],
      invoiceBuyerApproved : [0,1,0,1,1],
      invoiceBuyerPaid : [0,1,1,1,0],
      invoiceSellerGotPaid:[0,0,0,1,0],
      invoiceSelected: null,     

    };
  }

  render(){
    // Here we determine the status of the invoice
    
    this.state.invoiceId.map(function(Id,index){
      var status = null;
      var sBuyerApproved = this.state.invoiceBuyerApproved[index];
      var sBuyerPaid = this.state.invoiceBuyerPaid[index];
      var sSellerApproved = this.state.invoiceSellerApproved[index];
      var sSellerGotPaid = this.state.invoiceSellerGotPaid[index];

      
      var parts =this.state.invoiceDueDate[index].split('/');
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
      else if ( sInvoiceDueDate < date && (!sBuyerPaid || !sSellerGotPaid)){
        status = "Late";
      }

      else if (sSellerGotPaid && sBuyerPaid){
        status = "Paid";
      }

      this.state.invoiceStatus[index]=status;
      
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
  render(){
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
                       <option value='0x76d499C529cc06323EA0c5d5edcf9B11c02597cB'>Seller</option>
                      <option value='0xC30F6af2c92eFd81DC27D30ccD573B0dA675D3b1'>Buyer</option>
                      <option value='0x8764eAD14051407D2761FeE6fab8597B07FE803c'>Euler Hermes</option>
                    </select>
                  </p>


                  <p>
                    <label for='buyer'>Buyer</label><br/>

                    <select name='buyer' size='1' id='buyer'>
                       <option value='0x76d499C529cc06323EA0c5d5edcf9B11c02597cB'>Seller</option>
                      <option value='0xC30F6af2c92eFd81DC27D30ccD573B0dA675D3b1'>Buyer</option>
                      <option value='0x8764eAD14051407D2761FeE6fab8597B07FE803c'>Euler Hermes</option>
                    </select>
                  </p>

                   <p>
                    <label for='amount'>Amount</label><br/>
                    <input type="number" name="amount" id="amount"/>
                  </p>

                  <p>
                    <label for='dueDate'>Due Date</label><br/>
                    <input type="Date" name="dueDate" id="dueDate"/>
                  </p>
                </div>
                <input type='submit' name='Submit' value='submit'/>
              </form>
            </div>
          </div>
          <div>
            <form method='post'>
              <p>
                <label for='message'>Alerts</label><br/>
                <textarea name='message' id='message' rows='5'></textarea>
              </p>
            </form>
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

  statusAction(index){

    if (this.props.state.invoiceStatus[index] == "Waiting for Approval")
        return( <div className="invoiceActionInside" onClick={() => this.approveInvoice(index)}>Approve Invoice</div>);

    if (this.props.state.invoiceStatus[index] == "Late")
        return( <div className="invoiceActionInside" onClick={() => this.declarePayment(index)}>Declare Payment</div>);
    
  }


  render(){
    
    var invoiceList = this.props.state.invoiceId.map(function(Id,index){ 
      var buyerTmp = buyerTmp = this.props.state.invoiceBuyer[index]; 
          
      if (buyerTmp == web3.eth.accounts[0])
        buyerTmp = "You";

      var sellerTmp = this.props.state.invoiceSeller[index];
      if (sellerTmp == web3.eth.accounts[0])
        sellerTmp = "You";      

      var invoiceAction = this.statusAction(index);

     



      if (this.props.state.invoiceSelected != index){ 
        return (<div key={index} >
                   <div className="invoiceSummary" onClick={()=>this.handleClick(index)}>
                    <div className="content">
                      <span className="buyer">Buyer : {buyerTmp}</span>
                      <span className="amount">Amount : {this.props.state.invoiceAmount[index]} {this.props.state.invoiceUnit[index]}</span>

                    </div>
                    <div className="content">
                      <span className="seller">Seller : {sellerTmp}</span>
                      <span className="amount">Due : {this.props.state.invoiceDueDate[index]}</span>
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
                      <span className="amount">Amount : {this.props.state.invoiceAmount[index]} {this.props.state.invoiceUnit[index]}</span>

                    </div>
                    <div className="content">
                      <span className="seller">Seller : {sellerTmp}</span>
                      <span className="amount">Due : {this.props.state.invoiceDueDate[index]}</span>
                    </div>

                    <div className="content">
                      <span className="sellerApproved">Seller approved : {this.props.state.invoiceSellerApproved[index]? "Yes" : "No"}</span>
                      <span className="buyerApproved">Buyer approved: {this.props.state.invoiceBuyerApproved[index]? "Yes" : "No"}</span>
                    </div>

                    <div className="content">
                      <span className="sellerApproved">Seller got paid : {this.props.state.invoiceSellerGotPaid[index]? "Yes" : "No"}</span>
                      <span className="buyerApproved">Buyer paid: {this.props.state.invoiceBuyerPaid[index]? "Yes" : "No"}</span>
                    </div>

                    <div className="content">
                      <span className="status">Status : {this.props.state.invoiceStatus[index]}</span>
                      
                    </div>
                    
                  </div>
                  <div className="invoiceAction">
                    {invoiceAction}
                  </div>
                  </div>);
      
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



