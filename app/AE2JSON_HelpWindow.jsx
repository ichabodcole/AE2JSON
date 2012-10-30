// HelpWindow Class.
function HelpWindow(metaData){
  this.meta = metaData;
  this.header = this.meta.name + " " + this.meta.version + " " + this.meta.copyright;
  this.bodyText =
    "***********************************************************\n" +
    "* \n" +
    "Switchboard provides the ability to quickly turn on and off specific layer types and properties over multiple multiple comps, layers or an entire project.\n" +
    "* \n" +
    "***********************************************************\n\n" +
    "Context Dropdown:\n" +
    " Sets which context the switches will be applied to.\n\n" +
    "- All Comps: Apply the selected switches to all comps throughout the project.\n\n" +
    "- Current Comp: Apply the selected switches to the currently selected comp.\n\n" +
    "- Current Comp + Children: Apply the selected switches to the currently selected comp and recursively to any nested comps within it.\n\n" +
    "- Selected Layers: Apply the selected switches to all selected layers.\n\n" +
    "- Selected Layers: Apply the selected switches to all selected layers and recursively to any selected layers which are also nested comps." +
    "\n\n"+
    "======================================\n\n" +
    "Layers Tab:\n" +
    " The available layers that can be switched on or off.\n\n" + 
    "- 3d Layers: Turn 3d layers on or off.\n\n" +
    "- Adjustment Layers: Turn adjustment layers on or off.\n\n" +
    "- Camera Layers: Turn camera layers on or off.\n\n" +
    "- Light Layers: Turn light layers on or off.\n\n" +
    "- Shape Layers: Turn light layers on or off.\n\n" +
    "- Text Layers: Turn text layers on or off.\n\n" +
    "- Video Layers: Turn video layers on or off." +
    "\n\n"+
    "======================================\n\n" +
    "Properties Tab:\n" +
    " The available layer properties that can be switched on or off.\n\n" + 
    "- 3D: Turn the '3d' layer property on or off.\n\n" +
    "- Accept Lights: Turn the 'Accept Lights' material property on or off.\n\n" +
    "- Accept Shadows: Turn the 'Accept Shadows' material property on or off." + 
    "  On selection this property provides an additional 'Only' checkbox, which if selected changes the property value from 'on' to 'only' when combined with the 'Switch On' action.\n\n" +
    "- Cast Shadows: Turn the 'Cast Shadows' material property on or off." +
    "  On selection this property provides an additional 'Only' checkbox, which if selected changes the property value from 'on' to 'only' when combined with the 'Switch On' action.\n\n" +
    "- Collapse Transformations: Turn the 'Collapse Transformations' layer property on or off.\n\n" +
    "- Layer Effects: Turn all layer effects on or off.\n\n" +
    "- Motion Blur: Turn the 'Motion Blur' property on or off." +
    "  On selection this property provides an additional 'Exclude Text' checkbox, which if selected applies the motion blur switch action to everything, but text layers." +
    "  This is handy when you don't want moving text to become blurry." +
    "\n\n"+
    "======================================\n\n" +
    "Switch Actions:\n" +
    " The available switch actions\n\n" + 
    "- On: Turn the selected switches on.\n\n" +
    "- Off: Turn the selected switches off.\n\n" +
    "- Reset: Resets all the switch checkboxes to unselected.\n\n" +
    "- ?: The Help window..., you must have clicked it." +
    "\n\n"+
    "======================================\n\n" +
    "Note: This script has been tested on CS4 and later.\n" +
    "This script can be used as a dockable panel when placed in the ScriptUI folder.\n";

  this.res = 
  "group { \
    orientation:'column', \
    pnl: Panel{ \
      properties:{borderStyle:'none'}, \
      title: StaticText { text:'"+this.header+"', alignment:['left','top'] }, \
      helpText: EditText { text:'', preferredSize:[400,260], properties:{multiline:true}}, \
    }, \
    closeBtn: Button{ \
      text:'Close', \
      alignment: 'center', \
    }, \
  }";

  return this.buildUI();
}

HelpWindow.prototype.buildUI = function () {
  var _ref, helpDlg
  _ref = this;
  // create a dialog window
  this.helpDlg = new Window ('dialog', 'About');

  this.helpDlg.grp = this.helpDlg.add(this.res);
  
  this.helpDlg.grp.pnl.helpText.text = this.bodyText;

  // add onclick to the close button.
  this.helpDlg.grp.closeBtn.onClick = function() {
    _ref.helpDlg.close();
  }

  return this.helpDlg;
}

HelpWindow.prototype.show = function(){
  this.helpDlg.center();
  this.helpDlg.show();
}