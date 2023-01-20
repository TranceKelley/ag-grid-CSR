import React, {useCallback,useMemo,useState, useRef } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './style.css';
import { getData } from './data';
import PopupCellRenderer from './popupCellRenderer';
import customerPopup from './customerPopup.js';
import vehiclePopup from './vehiclePopup.js';
import StatusTooltip from './tooltipStatus.js';

const toolTipValueGetter = (params) => ({ value: params.value });

const App = () => {
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const data = useMemo(() => getData(), []);
    const [rowData] = useState(data, []);

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        filter: false,
        resizable: true,
        sortable: true,
        enableValue: false,
        enableRowGroup: true,
        enablePivot: true,
        suppressClickEdit: true,
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

    const PullUpRO = () => {
        let overlayRO = document.querySelector('.overlay');
        overlayRO.classList.toggle("show");
    }

    const modalPop = (props) => {
        let modal = document.querySelector('.modal');
        //var str = props.replace(/\s+/g, '-').toLowerCase();
        modal.classList.remove('edit-customer', 'edit-vehicle');
    }

    function ROLink(params) {
        return (
            <span className="ROLink" onClick={PullUpRO}> 
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
                menuTabs: ['filterMenuTab'],
                cellRenderer: ROLink,
                
            },
            { field: 'ROStatus', 
                headerName: 'Status', 
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab'],
                valueParser: 'ROStatus',
                cellRenderer: AllStatus, 
                tooltipComponent: StatusTooltip,
                tooltipValueGetter: toolTipValueGetter,
            },
            { field: 'CustomerName', 
                headerName: 'Customer', 
                filter: 'agTextColumnFilter',
                menuTabs: ['filterMenuTab'],
                cellRenderer: customerPopup,
                editable: false,
                colId: 'customer',
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'customer'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
                
            },
            { field: 'Advisor', 
                filter: 'agSetColumnFilter', 
                menuTabs: ['filterMenuTab'],
                chartDataType: "catagory",
                hide: true,
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
                menuTabs: ['filterMenuTab'],
                cellRenderer: vehiclePopup,
                editable: false,
                colId: 'vehicle',
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'vehicle'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
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
            { field: 'Tech', 
                hide:true 
            },
            { field: 'TechStatus', 
                hide:true,
                cellRenderer: AllStatus, 
            },
            { field: 'PartsPerson', 
                hide:true 
            },
            { field: 'PartsStatus', 
                hide:true,
                cellRenderer: AllStatus, 
            },
            { field: 'TransportationType', 
                hide:true 
            },
            { field: 'AppointmentID', 
                hide:true 
            },
            { field: 'AppointmentDate', 
                hide:true 
            },
            { field: 'ApppointmentStatus', 
                hide:true,
                cellRenderer: AllStatus, 
            },
            { field: 'Payment Status', 
                hide:true,
                cellRenderer: AllStatus, 
            },
            { field: 'Actions',  
                headerName: '', 
                maxWidth: 45,
                minWidth: 45, 
                pinned: 'right',
                lockPinned: true,
                suppressColumnsToolPanel: true,
                filter: false,
                suppressMenu: true,
                sortable: false,
                lockVisible: true,
                cellEditorPopup: false,
                cellRenderer: PopupCellRenderer,
                editable: false,
                colId: 'action',
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'action'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
                
            }
    ];};

    const createCPColDefs = () => {
        return [
            { field: 'RONumber', 
                cellStyle: { color: '#2B6BDD' },
                headerName: 'RO',
                pinned: 'left',
                maxWidth: 100,
                minWidth: 100, 
                lockPinned: true,
                filter: 'agTextColumnFilter',
                menuTabs: ['filterMenuTab'],
                cellRenderer: ROLink,
                
            },
            
            { field: 'PartsStatus', 
                hide:false,
                cellRenderer: AllStatus, 
                rowGroup: true, 
                hide: true,
                sort: 'desc',
            },
            { field: 'PartsPerson',
             hide:false, 
            },
            { field: 'ROStatus', 
            hide:true,
                headerName: 'RO Status', 
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab'],
                valueParser: 'ROStatus',
                cellRenderer: AllStatus, 
                tooltipComponent: StatusTooltip,
                tooltipValueGetter: toolTipValueGetter,
            },
            { field: 'CustomerName', 
                headerName: 'Customer', 
                filter: 'agTextColumnFilter',
                menuTabs: ['filterMenuTab'],
                cellRenderer: customerPopup,
                editable: false,
                colId: 'customer',
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'customer'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
                
            },

            { field: 'PromisedTime', 
                hide: true,
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
                menuTabs: ['filterMenuTab'],
                cellRenderer: vehiclePopup,
                editable: false,
                colId: 'vehicle',
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'vehicle'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
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
                menuTabs: ['filterMenuTab'],
                hide: true
            },
            { field: 'PayType', 
                headerName: 'Pay',
                hide:true,
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
            hide:true,
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
            { field: 'Tech', 
                hide:false 
            },
            { field: 'TechStatus', 
                hide:false,
                cellRenderer: AllStatus, 
            },
            { field: 'Advisor', 
            filter: 'agSetColumnFilter', 
            menuTabs: ['filterMenuTab'],
            chartDataType: "catagory",
            hide: false,
            },

            { field: 'TransportationType', 
                hide:false 
            },
            { field: 'AppointmentID', 
                hide:true 
            },
            { field: 'AppointmentDate', 
                hide:true 
            },
            { field: 'ApppointmentStatus', 
                hide:true,
                cellRenderer: AllStatus, 
            },
            { field: 'Payment Status', 
                hide:true,
                cellRenderer: AllStatus, 
            },
            { field: 'Actions',  
                headerName: '', 
                maxWidth: 45,
                minWidth: 45, 
                pinned: 'right',
                lockPinned: true,
                suppressColumnsToolPanel: true,
                filter: false,
                suppressMenu: true,
                sortable: false,
                lockVisible: true,
                cellEditorPopup: false,
                cellRenderer: PopupCellRenderer,
                editable: false,
                colId: 'action',
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'action'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
                
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
                headerName: 'Status',
                cellRenderer: AllStatus,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab'], 
            },
            { field: 'Advisor', 
                filter: 'agSetColumnFilter', 
                menuTabs: ['filterMenuTab'],
        },
            { field: 'Actions', 
                headerName: '', 
                maxWidth: 45,
                minWidth: 45, 
                pinned: 'right',
                lockPinned: true,
                filter: false,
                suppressMenu: true,
                sortable: false,
                lockVisible: true,
                cellRenderer: PopupCellRenderer,
                suppressColumnsToolPanel: true,
                editable: false,
                colId: 'action',
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'action'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
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
            { field: 'Payment Status', 
                hide:false,
                cellRenderer: AllStatus 
            },
            { field: 'AppointmentTime', hide:false  },
            { field: 'AppointmentDate', hide:false },
            { field: 'TransportationType', hide:false },
            { field: 'ApppointmentStatus', hide:false },
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
                maxWidth: 45,
                minWidth: 45, 
                pinned: 'right',
                lockPinned: true,
                suppressMenu: true,
                sortable: false,
                lockVisible: true,
                cellRenderer: PopupCellRenderer,
                editable: false,
                colId: 'action',
                suppressColumnsToolPanel: true,
                onCellClicked: (params) => {
                    if (
                    params.event.target.dataset.action == 'toggle' &&
                    params.column.getColId() == 'action'
                    ) {
                    const cellRendererInstances = params.api.getCellRendererInstances({
                        rowNodes: [params.node],
                        columns: [params.column],
                    });
                    if (cellRendererInstances.length > 0) {
                        const instance = cellRendererInstances[0];
                        instance.togglePopup();
                    }
                    }
                },
            }
        ];
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

    const onCounterView = useCallback(() => {
        gridRef.current.api.setColumnDefs(createPCColDefs());
        gridRef.current.api.expandAll();
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
            labelDefault: 'My Day',
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
                <button onClick={restoreFromHardCodedW}>
                    Warranty Lines
                </button>
            </div>
        );
    }

// --- Filter Buttons Consts ------


    const changeView = useCallback((myValue) => {

        if (myValue.includes('Not Dispatched')) {
            var hardcodedFilter = {
                ROStatus: {
                    type: 'set',
                    values: ['Not Dispatched'],
                    }
                };
            gridRef.current.api.setFilterModel(hardcodedFilter);
        }

        if (myValue.includes('My Customer Pay ROs')) {
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
        
        }

        if (myValue.includes('Cashier View')) {
            gridRef.current.api.setColumnDefs(createCashierColDefs());
        }

        if (myValue.includes('Appt View')) {
            gridRef.current.api.setColumnDefs(AppointmentsView());
            gridRef.current.api.expandAll();
        }

        if (myValue.includes('Repair Orders')) {
            gridRef.current.api.setColumnDefs(createROColDefs());
        }

        if (myValue.includes('Counter Person  View')) {
            gridRef.current.api.setColumnDefs(createCPColDefs());
            gridRef.current.api.expandAll();
        }

        if (myValue.includes('All ROs')) {
            gridRef.current.api.setFilterModel(null);
        }

    }, []);

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
                  <select  onChange={e=>changeView(e.target.value)}> 
                    <option value="Repair Orders">Repair Orders</option>
                    <option value="Counter Person  View">Parts Counter</option>
                    <option value="Cashier View">Cashier View</option>
                    <option value="Appt View">Appointment View</option>
                  </select>

                  <select  onChange={e=>changeView(e.target.value)}> 
                  <option value="All ROs">All Repair Orders</option>
                    <option value="Not Dispatched">Not Dispatched</option>
                    <option value="My Customer Pay ROs">My Customer Pay ROs</option>
                  </select>
              
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
          sideBar={sideBar}
          groupDisplayType={'groupRows'}
          enableRangeSelection={true}
          enableCharts={true}
          tooltipShowDelay={0}
          tooltipHideDelay={2000}
          groupRowsSticky={true}
          >
          </AgGridReact>
          </div>
      </div>
      <div class="overlay" onClick={PullUpRO}>
     
      </div>
      <div class="modal" onClick={modalPop}></div>
  </div>
);

};



render(<App />, document.getElementById('root'));

