import tippy from 'tippy.js';
import { hideAll } from 'tippy.js';
export default class customerPopup {
  constructor() {
    this.isOpen = false;
    this.eMenu = null;
    this.tippyInstance = null;
  }

  init(params) {
    this.params = params;
    this.eGui = document.createElement('div');

    this.eActionButton = document.createElement('div');
    this.eActionButton.innerHTML = params.value;
    this.eActionButton.setAttribute('data-action', 'toggle');
    this.eActionButton.classList.add('droptarget');

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
      placement: 'bottom-end',
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

    let options = [
      'Edit Vehicle',
      'Service History',
      'Vehicle Notes',
      'Service Contract',
      'OEM Warranty Information',
      'Vehicle 360',
    ];

    for (let i = 0; i < options.length; i++) {
      let item = document.createElement('div');

      const option = options[i];
      item.classList.add('menu-item');
      item.setAttribute(
        'data-action',
        option.replace(/\s+/g, '-').toLowerCase()
      );
      item.innerText = option == 'Created' ? `${option} New Row` : `${option}`;
      item.addEventListener('click', this.menuItemClickHandler.bind(this));
      menu.appendChild(item);
    }

    return menu;
  }

  menuItemClickHandler(event) {
    this.togglePopup();
    const action = event.target.dataset.action;

    let modalPop = document.querySelector('.modal');
    modalPop.classList.toggle(action);
  }

  getGui() {
    return this.eGui;
  }
}
