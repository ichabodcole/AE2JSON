{
  // AE2JSON v0.1
  //
  // Copyright (c) 2012 Cole Reed. All rights reserved.
  // email: info AT auralgrey DOT com    
  //
  // This script provides the ability to export AE 3D scene data into JSON

  #include "../lib/Logger.jsx";
  #include "../lib/json2.js"

  var L = new Logger();

  function AE2JSON(thisObj) {
    this.proj = app.project;
    this.comp = app.project.activeItem;
    this.jsonData = {};
    this.cameraCount = 0;
    this.lightCount  = 0;
    this.objectCount = 0;

    L.indentOn(false);
    this.doCompLayers();
    this.renderJSON();
  }

  AE2JSON.prototype.doCompLayers = function() {
    var myComp, myLayer, numLayers;
    
    myComp = this.comp;

    if(myComp instanceof CompItem) {
      numLayers = myComp.layers.length;
      
      for(i=0; i<numLayers; i++) {
        myLayer = myComp.layers[i+1];
        //L.puts(myLayer);
        if(!myLayer.adjustmentLayer == true){
          //this.iterateTransformGroup(myLayer);
          this.parseCameraData(myLayer);
          this.parseLightData(myLayer);
          this.parseObjectData(myLayer);
        }
      }
    }
  }

  AE2JSON.prototype.parseCameraData = function(camera) {
    var temp, camData, curCamera, camTrans, camOpt;
    // check if the passed layer obj is actually a camera.
    if (camera instanceof CameraLayer) {
      // increment the cameraCount.
      this.cameraCount++;
      if (!this.jsonData.cameras) this.jsonData.cameras = {};

      // create camera object
      camData = this.jsonData.cameras["camera_" + this.cameraCount] = {};
      camData.name = camera.name;
      //In Camera Transform Group
      camTrans = camera.transform;
      temp = {};
      temp.position        = camTrans.position.value;
      temp.orientation     = camTrans.orientation.value;
      temp.xRotation       = camTrans.xRotation.value;
      temp.yRotation       = camTrans.yRotation.value;
      temp.zRotation       = camTrans.zRotation.value;
      temp.pointOfInterest = camTrans.pointOfInterest.value;

      camData.transforms = temp;

      //In Camera Options Group
      camOpt  = camera.cameraOption;
      temp = {};
      temp.zoom          = camOpt.zoom.value;
      temp.aperture      = camOpt.aperture.value;
      temp.focusDistance = camOpt.focusDistance.value;

      camData.cameraOptions = temp;
    }
  }

  AE2JSON.prototype.parseLightData = function(light){
    var lightType, lightTrans, lightOptions;
    // check if the passed layer obj is actually a light.
    if (light instanceof LightLayer) {
      // increment the lightCount.
      this.lightCount++;
      // create the lights object if is doesn't already exist.
      if(!this.jsonData.lights) this.jsonData.lights = {};
      // create the current light object;
      lightData = this.jsonData.lights["light_" + this.lightCount] = {};
      // set the light name.
      lightData.name = light.name;

      // use a switch to set the proper variabls depending on the light type.
      switch(light.lightType)
      {
        case LightType.POINT: 
          this.setPointLightData(light, lightData);
          break;

        case LightType.SPOT:
          this.setSpotLightData(light, lightData);
          break;
      }
    }
  }

  AE2JSON.prototype.setPointLightData = function(light, lightObj){
    var temp, lightTrans, lightOpts;
    // set the light type.
    lightObj.lightType = "POINT";

    // shortcut to light transform property group
    lightTrans = light.transform;
    temp = {};
    temp.position = lightTrans.position.value;
    // set the lightObj transforms data
    lightObj.transforms = temp;

    // shortcut to light options property group
    lightOpt = light.lightOption;
    temp = {};
    temp.intensity = lightOpt.intensity.value;
    temp.color     = lightOpt.color.value;
    //set the lightObj light options data
    lightObj.lightOptions = temp;
  }

  AE2JSON.prototype.setParallelLightData = function(light, lightObj){
    var temp, lightTrans, lightOpts;
    
    // set the light type.
    lightObj.lightType = "PARALLEL";

    // shortcut to light transform property group
    lightTrans = light.transform;
    temp = {};
    temp.position        = lightTrans.position.value;
    temp.pointOfInterest = lightTrans.pointOfInterest.value;
    // set the lightObj transforms data
    lightObj.transforms = temp;

    // shortcut to light options property group
    lightOpt = light.lightOption;
    temp = {};
    temp.intensity = lightOpt.intensity.value;
    temp.color     = lightOpt.color.value;
    temp.radius    = lightOpt.radius.value;
    
    //set the lightObj light options data
    lightObj.lightOptions = temp;
  }

  AE2JSON.prototype.setSpotLightData = function(light, lightObj){
    var temp, lightTrans, lightOpts;
    
    // set the light type.
    lightObj.lightType = "SPOT";

    // shortcut to light transform property group
    lightTrans = light.transform;
    temp = {};
    temp.position        = lightTrans.position.value;
    temp.orientation     = lightTrans.orientation.value;
    temp.xRotation       = lightTrans.xRotation.value;
    temp.yRotation       = lightTrans.yRotation.value;
    temp.zRotation       = lightTrans.zRotation.value;
    temp.pointOfInterest = lightTrans.pointOfInterest.value;
    // set the lightObj transforms data
    lightObj.transforms = temp;

    // shortcut to light options property group
    lightOpt = light.lightOption;
    temp = {};
    temp.intensity = lightOpt.intensity.value;
    temp.color     = lightOpt.color.value;
    temp.coneAngle = lightOpt.coneAngle.value;
    temp.radius    = lightOpt.radius.value;

    //set the lightObj light options data
    lightObj.lightOptions = temp;
  }

  AE2JSON.prototype.parseObjectData = function(layer) {
    var temp, objData;

    if (layer.threeDLayer == true){
      // create the 3dbjects object
      this.objectCount++;
      if(!this.jsonData.objects) this.jsonData.objects = {};
      objData = this.jsonData.objects["object_" + this.objectCount] = {};
      objData.name = layer.name;

      temp = {};
      temp.anchorPoint = layer.transform.anchorPoint.value;
      temp.position    = layer.transform.position.value;
      temp.scale       = layer.transform.scale.value;
      temp.orientation = layer.transform.orientation.value;
      temp.xRotation   = layer.transform.xRotation.value;
      temp.yRotation   = layer.transform.yRotation.value;
      temp.zRotation   = layer.transform.zRotation.value;
      temp.opacity     = layer.transform.opacity.value;

      objData.transforms = temp;
    }
  }

  AE2JSON.prototype.iterateTransformGroup = function(layer){
    var i, transGroup;
    
    transGroup = layer.property("ADBE Transform Group");
    for (i = 1; i < transGroup.numProperties; i++){
      visible = true;
      try{
        transGroup.property(i).selected = true;
      }catch (err){
        visible = false;
      }
      if (visible) {
        //L.puts(transGroup.property(i).name);
      }
    }
  }

  AE2JSON.prototype.renderJSON = function() {
    var projectName, compName, filename, jsonExportFile, jsonString;
    // create JSON file.
    projectName = app.project.file.name.replace(".aep", '');
    compName    = this.comp.name;
    fileName    = projectName + "_"+ compName + ".json";
    fileName    = fileName.replace(/\s/g, '');

    var path = app.project.file.parent.parent.absoluteURI + "/";
    var fullPath = path + fileName;

    jsonString = JSON.stringify(this.jsonData, null, '   ');
    jsonExportFile = new File(fullPath);
    jsonExportFile.open("w");
    jsonExportFile.write(jsonString);
    jsonExportFile.close();
  }

  new AE2JSON(this);
}