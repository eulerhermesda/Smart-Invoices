var abiAdmin = [
    {
      "constant": true,
      "inputs": [],
      "name": "initTime",
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
          "name": "enter",
          "type": "address"
        },
        {
          "name": "Name",
          "type": "bytes32"
        }
      ],
      "name": "getNew",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "origin",
          "type": "address"
        }
      ],
      "name": "whoIsConcerned",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "you",
          "type": "bytes32"
        },
        {
          "name": "other",
          "type": "bytes32"
        },
        {
          "name": "t",
          "type": "address"
        }
      ],
      "name": "wantsBusiness",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "you",
          "type": "bytes32"
        },
        {
          "name": "other",
          "type": "bytes32"
        },
        {
          "name": "entry",
          "type": "uint256"
        },
        {
          "name": "exp",
          "type": "uint256"
        },
        {
          "name": "t",
          "type": "address"
        }
      ],
      "name": "manualEntry",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "compteur",
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
          "name": "client",
          "type": "bytes32"
        },
        {
          "name": "r",
          "type": "uint256"
        }
      ],
      "name": "checkFunction",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "fro",
          "type": "bytes32"
        },
        {
          "name": "t",
          "type": "bytes32"
        }
      ],
      "name": "paiementConfirmation",
      "outputs": [],
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
      "name": "invoiceAddressList",
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
      "inputs": [],
      "payable": false,
      "type": "constructor"
    }
  ];
var abiClient = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "you",
          "type": "bytes32"
        },
        {
          "name": "other",
          "type": "bytes32"
        },
        {
          "name": "entry",
          "type": "uint256"
        },
        {
          "name": "exp",
          "type": "uint256"
        },
        {
          "name": "t",
          "type": "address"
        }
      ],
      "name": "localManualEntry",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "con",
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
      "constant": false,
      "inputs": [
        {
          "name": "_time",
          "type": "uint256"
        },
        {
          "name": "_messageFor",
          "type": "string"
        },
        {
          "name": "_client",
          "type": "bytes32"
        },
        {
          "name": "_who1",
          "type": "bytes32"
        },
        {
          "name": "_paid",
          "type": "string"
        },
        {
          "name": "_who2",
          "type": "bytes32"
        }
      ],
      "name": "localCheck",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getEventSize",
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
          "name": "i",
          "type": "uint256"
        }
      ],
      "name": "getEvent",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "bytes32"
        },
        {
          "name": "",
          "type": "bytes32"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_time",
          "type": "uint256"
        },
        {
          "name": "_messageFor",
          "type": "string"
        },
        {
          "name": "_client",
          "type": "bytes32"
        },
        {
          "name": "_who1",
          "type": "bytes32"
        },
        {
          "name": "_paid",
          "type": "string"
        },
        {
          "name": "_who2",
          "type": "bytes32"
        }
      ],
      "name": "addEvent",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "resetEvents",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "Name",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "fro",
          "type": "bytes32"
        },
        {
          "name": "t",
          "type": "bytes32"
        }
      ],
      "name": "localPaiementConfirmation",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "clientOwner",
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
      "inputs": [
        {
          "name": "name",
          "type": "bytes32"
        },
        {
          "name": "client",
          "type": "address"
        },
        {
          "name": "_admin",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_time",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_messageFor",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_client",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "_who1",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "_paid",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_who2",
          "type": "bytes32"
        }
      ],
      "name": "localHasPaid",
      "type": "event"
    }
  ];