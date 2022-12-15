import tippy from 'tippy.js';
import { hideAll } from 'tippy.js';
export default class PopupCellRenderer {
  constructor() {
    this.isOpen = false;
    this.eMenu = null;
    this.tippyInstance = null;
  }

  init(params) {
    this.params = params;
    this.eGui = document.createElement('div');

    this.eActionButton = document.createElement('div');
    this.eActionButton.innerHTML = '•••';
    this.eActionButton.setAttribute('data-action', 'toggle');
    this.eActionButton.classList.add('overflow');

    this.tippyInstance = tippy(this.eActionButton);
    this.tippyInstance.disable();

    this.eGui.appendChild(this.eActionButton);
  }

  togglePopup() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.configureTippyInstance();
      this.eMenu = this.createMenuComponent();
      this.tippyInstance.setContent(this.eMenu);
    } else {
      this.tippyInstance.unmount();
    }
  }

  configureTippyInstance() {
    this.tippyInstance.enable();
    this.tippyInstance.show();
    this.tippyInstance.setProps({
      trigger: 'manual',
      placement: 'left-end',
      livePlacement: false,
      sticky: false,
      arrow: false,
      interactive: true,
      appendTo: document.body,
      hideOnClick: false,
      onShow: (instance) => {
        hideAll({ exclude: instance });
      },
      onClickOutside: (instance, event) => {
        this.isOpen = false;
        instance.unmount();
      },
    });
  }

  createMenuComponent() {
    let menu = document.createElement('div');
    menu.classList.add('menu-container');

    let options = ['Edit RO', 'Customer Chat', 'Dealer Chat', 'New Quote', 'Take Payment', 'Service History', 'Documents', 'Activity Log'];

    for (let i = 0; i < options.length; i++) {
      let item = document.createElement('div');

      const option = options[i];
      item.classList.add('menu-item');
      item.setAttribute('data-action', option.toLowerCase());
      item.innerText = `${option}`;
      item.addEventListener('click', this.menuItemClickHandler.bind(this));
      menu.appendChild(item);
    }

    return menu;
  }

  menuItemClickHandler(event) {
    this.togglePopup();
    const action = event.target.dataset.action;
    if (action === 'Edit') {
      this.params.api.applyTransaction({
        add: [{}],
      });
    }
    if (action === 'edit ro') {
      let overlayRO = document.querySelector('.overlay');
      overlayRO.classList.toggle("show");
    }

    if (action === 'make') {
      this.params.api.startEditingCell({
        rowIndex: this.params.rowIndex,
        colKey: 'make',
      });
    }
  }

  getGui() {
    return this.eGui;
  }
}
