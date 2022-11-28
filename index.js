import React, { useCallback,useMemo,useState, useRef } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './style.css';
import { getData } from './data';


const App = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const data = useMemo(() => getData(), []);
  const [rowData] = useState(data, []);

function MyRenderer(params) {
  return (
      <span className="my-renderer">
          ...
          {params.value}
      </span>
  );
}

function AllStatus(params) {
  return (
      <span className= {'badge ' + params.value.split(" ").join("")}>
          {params.value}
      </span>
  );
}

function TimeRenderer(params) {
    return (
        <span className= "ApptTime">
            {params.value}
        </span>
    );
  }

  const createROColDefs = () => {
    return [
      { field: 'RONumber', 
              cellStyle: { color: '#2B6BDD' },
              headerName: 'RO',
              pinned: 'left',
              maxWidth: 100,
              minWidth: 100, 
              lockPinned: true,
              filter: 'agTextColumnFilter',
              menuTabs: ['filterMenuTab']
          },
          { field: 'ROStatus', 
              headerName: 'Status', 
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab'],
              valueParser: 'ROStatus',
              cellRenderer: AllStatus, 
              chartDataType: 'catagory' ,
          },
          { field: 'CustomerName', 
              headerName: 'Customer', 
              filter: 'agTextColumnFilter',
              menuTabs: ['filterMenuTab'] 
          },
          { field: 'Advisor', 
              filter: 'agSetColumnFilter', 
              menuTabs: ['filterMenuTab'],
              chartDataType: "catagory"
              //rowGroup: true, hide: true 
          },
          { field: 'PromisedTime', 
              headerName: 'Promised',
              maxWidth: 130, 
              minWidth: 130,
              suppressMenu: true, 
          },
          { field: 'Vehicle',
              valueGetter: p => {
                  return p.data.Year + ' ' + p.data.Make + ' ' + p.data.Model ;
              },
          filter: 'agTextColumnFilter',
          menuTabs: ['filterMenuTab'] 
          },
          { field: 'ShortVIN',
          headerName: 'VIN', 
          tooltipField: 'VIN',
          maxWidth: 100, 
          minWidth: 100,
          filter: 'agTextColumnFilter',
          menuTabs: ['filterMenuTab'] 
          },
          { field: 'Model', 
              hide:true 
          },
          { field: 'HangTag', 
              headerName: 'Tag',
              resizable: false,
              maxWidth: 80, 
              filter: 'agTextColumnFilter',
              menuTabs: ['filterMenuTab'] 
          },
          { field: 'PayType', 
              headerName: 'Pay',
              resizable: false, 
              maxWidth: 60, 
              cellStyle: { 
                  align: 'center' 
              }, 
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab'],
              chartDataType: 'series'
          },    
          { field: 'TotalDue',
              cellStyle: { 
                  textAlign:'right', 
                  maxWidth: 83,
                  minWidth: 53,
              },
              filter: false,
              suppressMenu: true,
              sortable: false,
              resizable: false,
          },
          { field: 'Tech', hide:true },
          { field: 'TechStatus', hide:true,
          cellRenderer: AllStatus, },
          { field: 'PartsPerson', hide:true },
          { field: 'PartsStatus', hide:true,
          cellRenderer: AllStatus, },
          { field: 'TransportationType', hide:true },
          { field: 'AppointmentID', hide:true },
          { field: 'AppointmentDate', hide:true },
          { field: 'ApppointmentStatus', hide:true,
          cellRenderer: AllStatus, },
          { field: 'Payment Status', hide:true,
          cellRenderer: AllStatus, },
          { field: 'Actions', 
              headerName: '', 
              maxWidth: 52,
              minWidth: 52, 
              pinned: 'right',
              lockPinned: true,
              cellRenderer: MyRenderer,
              cellStyle: { 
                  textAlign:'center', 
                  color: '#2B6BDD', 
                  fontSize: '20px',
                  cellPadding: '0'},
              filter: false,
              suppressMenu: true,
              sortable: false,
              lockVisible: true
          }
  ];};

  const AppointmentsView = () => {
      return [
          { field: 'CustomerName', hide:false,
              cellStyle: { color: '#2B6BDD' },
              maxWidth: 200,
              minWidth: 200, 
              lockPinned: true,
              filter: 'agTextColumnFilter',
              menuTabs: ['filterMenuTab']
          },
          { field: 'Vehicle',
            valueGetter: p => {
              return p.data.Year + ' ' + p.data.Make + ' ' + p.data.Model ;
            },
            filter: 'agTextColumnFilter',
            menuTabs: ['filterMenuTab'] 
          },
          
          { field: 'AppointmentTime',
            cellStyle: { color: '#2B6BDD' },
            rowGroup: true, 
            hide: true,
            sortable: true, 
            sort: 'asc',
            cellRenderer: TimeRenderer,
            },
          { field: 'AppointmentDate', 
            hide:false,
            headerName: 'Date',
          },
          { field: 'TransportationType', 
            hide:false,
            headerName: 'Transportation', 
          },
          { field: 'ApppointmentStatus', 
            hide:false,
            //rowGroup: true, 
            headerName: 'Status',
            cellRenderer: AllStatus,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab'], 
          },
          { field: 'Advisor', 
          filter: 'agSetColumnFilter', 
          menuTabs: ['filterMenuTab'],
          //rowGroup: true, hide: true 
      },
          { field: 'Actions', 
              headerName: '', 
              maxWidth: 52,
              minWidth: 52, 
              pinned: 'right',
              lockPinned: true,
              cellRenderer: MyRenderer,
              cellStyle: { 
                  textAlign:'center', 
                  color: '#2B6BDD', 
                  fontSize: '20px',
                  cellPadding: '0'},
              filter: false,
              suppressMenu: true,
              sortable: false,
              lockVisible: true
          }
      ];
  };

  const createCashierColDefs= () => {
    return [
        { field: 'RONumber', 
            hide:false,
            cellStyle: { color: '#2B6BDD' },
            pinned: 'left',
            maxWidth: 100,
            minWidth: 100, 
            lockPinned: true,
            filter: 'agTextColumnFilter',
            menuTabs: ['filterMenuTab']
        },
        { field: 'AppointmentTime', hide:false  },
        { field: 'AppointmentDate', hide:false },
        { field: 'TransportationType', hide:false },
        { field: 'ApppointmentStatus', hide:false },
        { field: 'Payment Status', hide:false },
        { field: 'TotalDue',
            cellStyle: { 
                textAlign:'right', 
                maxWidth: 83,
                minWidth: 53,
            },
            filter: false,
            suppressMenu: true,
            sortable: false,
            resizable: false,
        },
        {   field: 'Actions', 
            headerName: '', 
            maxWidth: 52,
            minWidth: 52, 
            pinned: 'right',
            lockPinned: true,
            cellRenderer: MyRenderer,
            cellStyle: { 
                textAlign:'center', 
                color: '#2B6BDD', 
                fontSize: '20px',
                cellPadding: '0'},
            filter: false,
            suppressMenu: true,
            sortable: false,
            lockVisible: true
        }
    ];
  };

  const defaultColDef = {
        flex: 1,
        minWidth: 100,
        filter: false,
        resizable: true,
        sortable: true,
        enableValue: false,
        enableRowGroup: true,
        enablePivot: true,
    
  };

  const gridOptions = {
    //columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    animateRows: true,
    autoGroupColumnDef: {
      cellRendererPerams: {
        suppressCount: true,
      }

    }
  };

  const onApptView = useCallback(() => {
    gridRef.current.api.setColumnDefs(AppointmentsView());
    gridRef.current.api.expandAll();
  }, []);

const onROView = useCallback(() => {
    gridRef.current.api.setColumnDefs(createROColDefs());
}, []);

const onCashierView = useCallback(() => {
    gridRef.current.api.setColumnDefs(createCashierColDefs());
}, []);

const [columnDefs, setColumnDefs] = useState(createROColDefs());

// --- Quick Filter 

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
    document.getElementById('filter-text-box').value
    );
}, []);

  // SIDE BAR -----------------

  const sideBar = {
    toolPanels: [
    {   id: 'customStats',
        labelDefault: 'May Day',
        labelKey: 'customStats',
        iconKey: 'chart',
        toolPanel: CustomStatsToolPanel,
        minWidth: 180,
        maxWidth: 400,
        width: 250
    },
    {   id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
            //suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
        },
        minWidth: 180,
        maxWidth: 400,
        width: 250
    },
    {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
        minWidth: 180,
        maxWidth: 400,
        width: 250
    }],
    position: 'left',
    defaultToolPanel: 'customStats'
},

function CustomStatsToolPanel(params) {
  return (
      <div className="my-stats">
          <h3>My day</h3>
          <h1></h1>
          <div class="chart">
          </div>
          
          <h1>5 Closed ROs</h1>
          <p> Customer Pay Total <b>$1,289.00</b></p>
          <h1>2 Warranty ROs to be closed</h1>
          <p> Comission Pay Total <b>$793.00</b></p>

          <p id="chart"></p>

          {params.value}
      </div>
  );
}

// --- Filter Buttons Consts ------

  const clearFilters = useCallback(() => {
    gridRef.current.api.setFilterModel(null);
  }, []);

  const restoreFromHardCodedND = useCallback(() => {
    var hardcodedFilter = {
    ROStatus: {
        type: 'set',
        values: ['Not Dispatched'],
    }
    };
    gridRef.current.api.setFilterModel(hardcodedFilter);
  }, []);

  const restoreFromHardCodedW = useCallback(() => {
    var hardcodedFilter = {
        PayType: {
        type: 'set',
        values: ['W'],
    }
    };
    gridRef.current.api.setFilterModel(hardcodedFilter);
  }, []);

  const restoreFromHardCodedMyROs = useCallback(() => {
    var hardcodedFilter = {
        Advisor: {
        type: 'set',
        values: ['Eric Sanders'],
    },
    PayType: {
        type: 'set',
        values: ['C'],
    }
    };
    gridRef.current.api.setFilterModel(hardcodedFilter);
  }, []);


return (
  <div style={containerStyle}>
      <div className="example-wrapper">
          <div>
              <div className="button-group">
              
                  <button
                      onClick={restoreFromHardCodedND}
                      title="show all RO that have not been dispatched"
                  >
                      Not Dispatched
                  </button>
                  <button
                      onClick={restoreFromHardCodedMyROs}
                      title="show all RO that have not been dispatched"
                  >
                      My Customer Pay ROs
                  </button>
                  <button
                      onClick={onApptView }
                      title="Appointments"
                  >
                      Appointments
                  </button>
                  <button
                      onClick={onROView }
                      title="Repair Orders"
                  >
                      Repair Orders
                  </button>
                  <button
                      onClick={onCashierView }
                      title="Cashier"
                  >
                      Cashier
                  </button>
                  <button onClick={clearFilters}>Reset Filters</button>
                  <input
                      type="text"
                      id="filter-text-box"
                      placeholder="Search"
                      onInput={onFilterTextBoxChanged}
                  />
              
              </div>
          </div>
      
          <div className="ag-theme-alpine" style={{ height: 800 }}>
          <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          rowSelection={'multiple'}
          //statusBar={statusBar}
          sideBar={sideBar}
          groupDisplayType={'groupRows'}
          enableRangeSelection={true}
          enableCharts={true}
          >
          </AgGridReact>
          </div>
      </div>
  </div>
);

};



render(<App />, document.getElementById('root'));

