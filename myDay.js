// WIP --- NOT ACTIVE IN PROTOTYPR

class CustomStatsToolPanel {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.textAlign = 'center';

    // calculate stats when new rows loaded, i.e. onModelUpdated
    const renderStats = () => {
      this.eGui.innerHTML = this.calculateStats(params);
    };
    params.api.addEventListener('modelUpdated', renderStats);
  }

  getGui() {
    return this.eGui;
  }

  refresh() {}

  calculateStats(params) {
    let numGold = 0,
      numSilver = 0,
      numBronze = 0,
      numAge = 0;
    params.api.forEachNode(function (rowNode) {
      const data = rowNode.data;
      if (data.gold) numGold += data.gold;
      if (data.silver) numSilver += data.silver;
      if (data.bronze) numBronze += data.bronze;
      if (data.age) numAge += data.age;
    });

    return `
        <span>
            <h2><i class="fa fa-calculator"></i> Custom Stats</h2>
            <dl style="font-size: large; padding: 30px 40px 10px 30px">
                <dt style="padding-bottom: 15px">Total Medals: <b>${
                  numGold + numSilver + numBronze + numAge
                }</b></dt>
                <dt style="padding-bottom: 15px">Total Gold: <b>${numGold}</b></dt><dt style="padding-bottom: 15px">Total Silver: <b>${numSilver}</b></dt>
                <dt style="padding-bottom: 15px">Total Bronze: <b>${numBronze}</b></dt>
                <dt style="padding-bottom: 15px">Total Age: <b>${numAge}</b></dt>
            </dl>
        </span>`;
  }
}
