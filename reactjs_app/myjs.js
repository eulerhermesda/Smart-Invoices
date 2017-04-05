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
  nameList:['Invoices','Payment Confirmation', 'Check and Alert']
};

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
          entries = {this.props.menudata.nameList} onClick={(i)=>this.handleMenuClick(i)}/>   
        <Page
          currentPage = {this.state.currentPage} currentAccount={web3.eth.accounts[0]} 
          onClick={(value,fields)=> this.handlePageClick(value,fields)}/> 
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
    return (
      <header className="dapp-header">
        <nav>      
          <ul>
            <li>
              {menuEntries}
            </li>
          </ul>
        </nav>
      </header>      
      )
  }

}


// The content
class Page extends React.Component{  



  render(){
    if (this.props.currentPage == 0){
      return(<div>
          <InvoiceCreation onClick={(value,fields)=>this.props.onClick(value,fields)}
            />
          }
        </div>
        );
    }

    else if (this.props.currentPage==1){
      return(<div>        
          <PaymentConfirmation onClick={(value,fields)=>this.props.onClick(value,fields)}
            />
        </div>
        );
    }

    else if (this.props.currentPage==2){
      return(<div>         
          <CheckAndAlert onClick={(value,fields)=>this.props.onClick(value,fields)}
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
                    <label for='yourName'>Who are you?</label>

                    <select name='yourName' size='1' id='yourName'>
                      <option value='Mr White' type='string'>Mr White</option>
                      <option value='Mr Blonde' type='string'>Mr Blonde</option>
                      <option value='Mr Pink' type='string'>Mr Pink</option>
                      <option value='Mr Blue' type='string'>Mr Blue</option>
                    </select>
                  </p>


                  <p>
                    <label for='otherName'>Who's client are you?</label>

                    <select name='otherName' size='1' id='otherName'>
                      <option value='Mr White' type='string'>Mr White</option>
                      <option value='Mr Blonde' type='string'>Mr Blonde</option>
                      <option value='Mr Pink' type='string'>Mr Pink</option>
                      <option value='Mr Blue' type='string'>Mr Blue</option>
                    </select>
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

class PaymentConfirmation extends React.Component{
  render(){
    return(
        <div className="dapp-flex-content">

        <aside className="dapp-aside">

        </aside>

        <main className="dapp-content">
          <div className="dapp-container">
            <h1>Confirm payment of an invoice: (only by one of the 2 concerned)</h1>
            <div>
              <form method='post'>
                <div>
                  <p>
                    <label for='yourConfirmation'>Who are you?</label>:
                    <select name='yourConfirmation' size='1' id='yourConfirmation'>
                      <option value='Mr White'>Mr White</option>
                      <option value='Mr Blonde'>Mr Blonde</option>
                      <option value='Mr Pink'>Mr Pink</option>
                      <option value='Mr Blue'>Mr Blue</option>
                    </select>
                  </p>
                  <p>
                    <label for='hisConfirmation'>Who's client are you?</label>:
                    <select name='hisConfirmation' size='1' id='hisConfirmation'>
                      <option value='Mr White'>Mr White</option>
                      <option value='Mr Blonde'>Mr Blonde</option>
                      <option value='Mr Pink'>Mr Pink</option>
                      <option value='Mr Blue'>Mr Blue</option>
                    </select>
                  </p>

                </div>
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

class CheckAndAlert extends React.Component{
  render(){
    return(
      <div className="dapp-flex-content">

        <aside className="dapp-aside">

        </aside>

        <main className="dapp-content">
          <div className="dapp-container">
            <h1>Check if invoices are paid, and alert the relevant people<em>(for the demo only)</em></h1>
            <div>
              <form method='post' onsubmit='checkFunction()'>
                <div>
                  <p>
                    <label for='whichP'>What client do you wish to check?</label>:<br/>
                    <select name='whichP' size='1' id='whichP'>
                      <option value='Mr White' type='string'>Mr White</option>
                      <option value='Mr Blonde' type='string'>Mr Blonde</option>
                      <option value='Mr Pink' type='string'>Mr Pink</option>
                      <option value='Mr Blue' type='string'>Mr Blue</option>
                    </select>
                  </p>
                  <p>
                    <label for='whichR'>Which invoice?</label>:<br/>
                    <select name='whichR' size='1' id='whichR'>
                      <option value='0' type='number'>first</option>
                      <option value='1' type='number'>second</option>
                      <option value='2' type='number'>third</option>
                    </select>
                  </p>
                </div>
                <br/>
                <input type='submit' name='Check' value='query'/>
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




ReactDOM.render(<App menudata={MENUDATA}/>,
 document.getElementById('content') );
