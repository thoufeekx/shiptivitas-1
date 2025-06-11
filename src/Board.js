import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();

    console.log('All Clients:', clients);

    // Log counts for each status
    console.log('Counts:', {
      backlog: clients.filter(c => !c.status || c.status === 'backlog').length,
      inProgress: clients.filter(c => c.status === 'in-progress').length,
      complete: clients.filter(c => c.status === 'complete').length
    });

    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }

    
  }
  getClients() {
    const rawData =  [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'backlog'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'backlog'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'backlog'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'backlog'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'backlog'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'backlog'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ];
    
    console.log('1. Raw Data Array:', rawData); //Display raw data

    //2 display single row
    console.log('2. Single Row:', rawData[7]);    

    
    // Transform data and store result
    const transformedData = rawData.map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));

    console.log('3. Transformed Data:', transformedData);
    return transformedData;
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  componentDidMount(){
    // When everything is ready and built
    // 1. Create dragula instance as class property
    // Create a moving company service (Dragula)

    this.drake = Dragula([
      this.swimlanes.backlog.current,      // "Backlog Room"
      this.swimlanes.inProgress.current,   // "In Progress Room"
      this.swimlanes.complete.current,     // "Complete Room"
   ]);


   // 2. Handle drag and drop When starts to move
   this.drake.on('drag', (el) => {
    // Log which card and where it started from
    console.log('Drag started:', {
      cardId: el.dataset.id,
      cardName: el.querySelector('.Card-title').textContent,
      fromColumn: el.parentElement.previousElementSibling.textContent
  });
  })


  // 3. Drop logic
  this.drake.on('drop', (ele, target, source) => {
     // i Get the card ID
     const cardID = ele.dataset.id;

     // ii Figure status of which swimlane
     let newlaneStatus;

     if (target === this.swimlanes.backlog.current) {
      newlaneStatus = 'backlog';
     } else if (target === this.swimlanes.inProgress.current){
      newlaneStatus = 'in-progress' ;
     } else if (target === this.swimlanes.complete.current){
      newlaneStatus = 'complete';
     } else {
      // If dropped outside a valid swimlane, revert and do nothing.
      console.warn('Card dropped in an invalid area. Reverting.');
      this.drake.cancel(true);
      return;
     }


     this.drake.cancel(true);
     // Update React state in the next tick to ensure Dragula's cancel has processed.
     setTimeout(() => {
       this.setState(prevState => {
         // Find the client that was moved from the previous state
         const allClientsPrev = [
           ...prevState.clients.backlog,
           ...prevState.clients.inProgress,
           ...prevState.clients.complete,
         ];
         const clientToMove = allClientsPrev.find(c => c.id === cardID);
 
         if (!clientToMove) {
           console.error("DragDrop Error: Client to move not found in state!", cardID);
           return prevState; // Return previous state if client not found (should not happen)
         }
         
         console.log('Status Change:', {
           cardId: cardID,
           oldStatus: clientToMove.status, 
           newStatus: newlaneStatus
         });
 
         // Create a new object for the client with the updated status.
         // This ensures immutability, which is good practice in React.
         const updatedClient = { ...clientToMove, status: newlaneStatus };
         console.log('Updated Client:', updatedClient);
         
 
         // Filter the client out from all lists using its ID from PREVIOUS state
         let newBacklog = prevState.clients.backlog.filter(c => c.id !== cardID);
         let newInProgress = prevState.clients.inProgress.filter(c => c.id !== cardID);
         let newComplete = prevState.clients.complete.filter(c => c.id !== cardID);
 
         // Add the updated client to the correct new list
         if (newlaneStatus === 'backlog') {
           newBacklog.push(updatedClient);
         } else if (newlaneStatus === 'in-progress') {
           newInProgress.push(updatedClient);
         } else if (newlaneStatus === 'complete') {
           newComplete.push(updatedClient);
         }
 
         return {
           clients: {
             backlog: newBacklog,
             inProgress: newInProgress,
             complete: newComplete,
           }
         };
       });
     }, 0);
   });
    
  }

  // Add cleanup when component unmounts
componentWillUnmount() {
  if (this.drake) {
      this.drake.destroy();
  }
}
  

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
