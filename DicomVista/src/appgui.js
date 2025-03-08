

// namespaces
var dwvjq = dwvjq || {};
dwvjq.utils = dwvjq.utils || {};

/**
 * Application GUI.
 */

// Default colour maps.
dwv.tool.colourMaps = {
  plain: dwv.image.lut.plain,
  invplain: dwv.image.lut.invPlain,
  rainbow: dwv.image.lut.rainbow,
  hot: dwv.image.lut.hot,
  hotiron: dwv.image.lut.hot_iron,
  pet: dwv.image.lut.pet,
  hotmetalblue: dwv.image.lut.hot_metal_blue,
  pet20step: dwv.image.lut.pet_20step
};
// Default window level presets.
dwv.tool.defaultpresets = {};
// Default window level presets for CT.
dwv.tool.defaultpresets.CT = {
  mediastinum: {center: 40, width: 400},
  lung: {center: -500, width: 1500},
  bone: {center: 500, width: 2000},
  brain: {center: 40, width: 80},
  head: {center: 90, width: 350}
};

// dwv overrides -------------------------

// logger
// (if debug, need to activate debug level in Chrome console)
dwv.logger = dwv.utils.logger.console;
dwv.logger.level = dwv.utils.logger.levels.DEBUG;


// [end] dwv overrides -------------------------

// tool toggle
function toggle(dialogId) {
  if ($(dialogId).dialog('isOpen')) {
    $(dialogId).dialog('close');
  } else {
    $(dialogId).dialog('open');
  }
}

// Toolbox
dwvjq.gui.ToolboxContainer = function (app, infoController) {
  var base = new dwvjq.gui.Toolbox(app);

  this.setup = function (list) {
    base.setup(list);

    // toolbar

    // open
    var openSpan = document.createElement('span');
    openSpan.className = 'ui-icon ui-icon-plus';
    var open = document.createElement('button');
    open.appendChild(openSpan);
    open.title = dwv.i18n('basics.open');
    open.onclick = function () {
      toggle('#openData');
    };
    // toolbox
    var toolboxSpan = document.createElement('span');
    toolboxSpan.className = 'ui-icon ui-icon-wrench';
    var toolbox = document.createElement('button');
    toolbox.appendChild(toolboxSpan);
    toolbox.title = dwv.i18n('basics.toolbox');
    toolbox.onclick = function () {
      toggle('#dwv-toolList');
    };
    // history
    var historySpan = document.createElement('span');
    historySpan.className = 'ui-icon ui-icon-clipboard';
    var history = document.createElement('button');
    history.appendChild(historySpan);
    history.title = dwv.i18n('basics.history');
    history.onclick = function () {
      toggle('#dwv-history');
    };
    // DICOM tags
    var tagsSpan = document.createElement('span');
    tagsSpan.className = 'ui-icon ui-icon-tag';
    var tags = document.createElement('button');
    tags.appendChild(tagsSpan);
    tags.title = dwv.i18n('basics.dicomTags');
    tags.onclick = function () {
      toggle('#dwv-tags');
    };
    // draw list
    var drawListSpan = document.createElement('span');
    drawListSpan.className = 'ui-icon ui-icon-pencil';
    var drawList = document.createElement('button');
    drawList.appendChild(drawListSpan);
    drawList.title = dwv.i18n('basics.drawList');
    drawList.onclick = function () {
      toggle('#dwv-drawList');
    };
    // image
    var imageSpan = document.createElement('span');
    imageSpan.className = 'ui-icon ui-icon-image';
    var image = document.createElement('button');
    image.appendChild(imageSpan);
    image.title = dwv.i18n('basics.image');
    image.onclick = function () {
      toggle('.layerDialog');
    };
    // info
    var infoSpan = document.createElement('span');
    infoSpan.className = 'ui-icon ui-icon-info';
    var info = document.createElement('button');
    info.appendChild(infoSpan);
    info.title = dwv.i18n('basics.info');
    info.onclick = function () {
      var infoLayer = document.getElementById('infoLayer');
      dwvjq.html.toggleDisplay(infoLayer);
      infoController.toggleListeners();
    };
    // help
    var helpSpan = document.createElement('span');
    helpSpan.className = 'ui-icon ui-icon-help';
    var help = document.createElement('button');
    help.appendChild(helpSpan);
    help.title = dwv.i18n('basics.help');
    help.onclick = function () {
      toggle('#dwv-help');
    };

    // help
    var informesSpan = document.createElement('span');
    informesSpan.className = 'ui-icon ui-icon-clipboard';
    var informes = document.createElement('button');
    informes.appendChild(informesSpan);
    informes.title = dwv.i18n('basics.help');
    informes.onclick = function () {
      toggle('#dwv-informes');
    };

    var node = document.getElementById('dwv-toolbar');
    node.appendChild(open);
    node.appendChild(toolbox);
    node.appendChild(history);
    node.appendChild(tags);
    node.appendChild(drawList);
    node.appendChild(image);
    node.appendChild(info);
    // node.appendChild(help);
    node.appendChild(informes);

    // apply button style  
    $('button').button();

    var hr_tag = document.createElement('hr');
    // add to openData window
    node = document.getElementById('openData');
    node.appendChild(hr_tag);

    // save state button
    var saveButton = document.createElement('button');
    saveButton.innerHTML = 'Guardar Ediciones';
    saveButton.style.fontWeight = '700';
    /*
    saveButton.appendChild(
      document.createTextNode(dwv.i18n('basics.downloadState'))
    );
    */
    // save state link
    function ajaxenviar(Datos,cliente_id,Nombre)
    {
      $.ajax({
            type: "POST",
            url: "Ajax.php",
            data: {
              valordatos:Datos,
              cliente_id:cliente_id,
              Nombre:Nombre
            },
            success: function(response) {
                alert(response);
                 
            }
        });

    }
    var toggleSaveState = document.createElement('a');
    toggleSaveState.onclick = function () {
      //var blob = new Blob([app.getState()], {type: 'application/json'});
      //toggleSaveState.href = window.URL.createObjectURL(blob);
      var Datos = app.getState();
      var cliente_id = document.getElementById("cliente_id").value;
      var Nombre = document.getElementById("Nombre").value;

      ajaxenviar(Datos,cliente_id,Nombre);
      
    };
    toggleSaveState.download = 'state123.json';
    toggleSaveState.id = 'download-state';
    toggleSaveState.className += 'download-state';
    toggleSaveState.appendChild(saveButton);
    // add to openData window
    node = document.getElementById('openData');
    node.appendChild(toggleSaveState);

    

    var hr_tag = document.createElement('hr');
    // add to openData window
    node = document.getElementById('openData');
    node.appendChild(hr_tag);
    
    function VolverAMedical(cliente_id)
    {
      window.location.href = '../../DC_SubirArchivos?clienteId='+cliente_id;

    }

    var a_boton = document.createElement('button');
    a_boton.innerHTML = 'Volver a Medical';
    a_boton.onclick = function () {
      //var blob = new Blob([app.getState()], {type: 'application/json'});
      //toggleSaveState.href = window.URL.createObjectURL(blob);
      var cliente_id = document.getElementById("cliente_id").value;
      VolverAMedical(cliente_id);

    };
    // add to openData window
    node = document.getElementById('openData');
    a_boton.className = "ui-widget-header";
    node.appendChild(a_boton);
    

  };

  this.display = function (flag) {
    base.display(flag);
  };
  this.initialise = function () {
    base.initialise();
  };
};


// special setup
dwvjq.gui.setup = function () {
  $('.toggleInfoLayer').button({
    icons: {primary: 'ui-icon-comment'},
    text: false,
    appendTo: '#dwv'
  });
  // create dialogs
  $('#openData').dialog({
    position: {my: 'left top', at: 'left top', of: '#pageMain'},
    height: 245,
    width: '25%',
    appendTo: '#dwv'
  });
  $('#dwv-toolList').dialog({
    position: {my: 'left top+255', at: 'left top', of: '#pageMain'},
    height: 150,
    width: '25%',
    appendTo: '#dwv'
  });
  $('#dwv-history').dialog({
    position: {my: 'left top+415', at: 'left top', of: '#pageMain'},
    height: 180,
    width: '25%',
    appendTo: '#dwv'
  });

  $('#dwv-informes').dialog({
    position: {my: 'left top+600', at: 'left top', of: '#pageMain'},
    width: '25%',
    height: 350,
    appendTo: '#dwv'
  });

  $('#dwv-tags').dialog({
    position: {my: 'right top', at: 'right top', of: '#pageMain'},
    autoOpen: false,
    width: 500,
    height: 590,
    appendTo: '#dwv'
  });
  $('#dwv-drawList').dialog({
    position: {my: 'right top', at: 'right top', of: '#pageMain'},
    autoOpen: false,
    width: 500,
    height: 590,
    appendTo: '#dwv'
  });
  $('#dwv-help').dialog({
    position: {my: 'right top', at: 'right top', of: '#pageMain'},
    autoOpen: false,
    width: 500,
    height: 590,
    appendTo: '#dwv'
  });

  // image dialog
  $('#dwv-image').dialog({
    position: {my: 'left+355 top', at: 'left top', of: '#pageMain'},
    width: '70%',
    height: 958,
    appendTo: '#dwv'
  });
  // default size
  // width: http://api.jqueryui.com/dialog/#option-width
  // "auto" is not documented but has an effect...
  //$('#dwv-image').dialog({width: 'auto', resizable: true});
  // Resizable but keep aspect ratio
  // TODO it seems to add a border that bothers getting the cursor position...
  //$("#layerContainer").resizable({ aspectRatio: true }); 
};



