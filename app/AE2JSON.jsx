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
          this.parseCameraData(myLayer);
          this.parseObjectData(myLayer);
          this.parseLightData(myLayer);
        }
      }
    }
  }

  AE2JSON.prototype.parseCameraData = function(layer) {
    var temp, camera, camTrans, camOpts;

    if (layer instanceof CameraLayer) {
      camera   = layer;
      // create camera object
      this.jsonData.camera = {};
      this.jsonData.camera.name = camera.name;
      //In Camera Transform Group
      camTrans = camera.transform;
      temp = {};
      temp.position        = camTrans.position.value;
      temp.orientation     = camTrans.orientation.value;
      temp.xRotation       = camTrans.xRotation.value;
      temp.yRotation       = camTrans.yRotation.value;
      temp.zRotation       = camTrans.zRotation.value;
      temp.pointOfInterest = camTrans.pointOfInterest.value;

      this.jsonData.camera.tranforms = temp;

      //In Camera Options Group
      camOpts  = camera.cameraOption;
      temp = {};
      temp.zoom          = camOpts.zoom.value;
      temp.aperture      = camOpts.aperture.value;
      temp.focusDistance = camOpts.focusDistance.value;

      this.jsonData.camera.cameraOptions = temp;
    }
  }
/*
  AE2JSON.prototype.parseLightData = function(layer){
    var temp, light, lightType, lightTrans, lightOptions;

    if (layer instanceof LightLayer) {
      light = layer;
      lightType = light.lightType;
      this.jsonData.lights = {};

      this.jsonData.lights();

      switch(lightType)
      {
        case LightType.POINT: 
          temp = {};
          temp.position = lightTrans.position.value;
          //temp.
          break;
      }

      lightOptions = light.lightOption;
    }
  }
*/
  AE2JSON.prototype.parseObjectData = function(layer) {
    var temp;

    if (layer.threeDLayer == true){
      // create the 3dbjects object
      this.objectCount++;
      this.jsonData.objects ? "" : this.jsonData.objects = {};

      temp = {};
      temp.name        = layer.name;
      temp.anchorPoint = layer.transform.anchorPoint.value;
      temp.position    = layer.transform.position.value;
      temp.scale       = layer.transform.scale.value;
      temp.orientation = layer.transform.orientation.value;
      temp.xRotation   = layer.transform.xRotation.value;
      temp.yRotation   = layer.transform.yRotation.value;
      temp.zRotation   = layer.transform.zRotation.value;
      temp.opacity     = layer.transform.opacity.value;

      this.jsonData.objects["object_" + this.objectCount] = temp;
    }
  }

  AE2JSON.prototype.renderJSON = function() {
    // create JSON file.
    L.puts(JSON.stringify(this.jsonData, null, '    '));
  }

  new AE2JSON(this);
}