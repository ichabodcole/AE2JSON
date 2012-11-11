import bpy
import os
import json
from math import radians

directory = os.path.dirname(bpy.data.filepath)
filename = "AE2JSON_Comp1.json"
fullpath = directory + "/" +filename

json_str = open(fullpath).read()
json_data = json.loads(json_str)

class Comp:
  def __init__(self, compJson):
    self.name      = compJson['name']
    self.width     = compJson['width']
    self.height    = compJson['height']
    self.duration  = compJson['duration']
    self.frameRate = compJson['frameRate']
        
class ObjectBase(object):
  def __init__(self, compObj, objectData):
    self.comp     = compObj
    self.name     = objectData['name']
    self.location = objectData['transforms']['position']
    self.rotation = objectData['transforms'].setdefault('rotation', [0,0,0])
    self.scaleFactor = 0.01
    self.__parse_location()
    self.__parse_rotation()
    
  def __scale_location(self):
    self.location = [x * self.scaleFactor for x in self.location]
  
  def __adjust_ae_center(self):
    self.location[0], self.location[1] = (self.location[0]-(self.comp.width/2)), (self.location[1]-(self.comp.height/2))
  
  def __flip_zy(self):
    self.location[1], self.location[2] = self.location[2], -self.location[1]
      
  def __parse_location(self):
    self.__adjust_ae_center()
    self.__flip_zy()
    self.__scale_location()
  
  def __parse_rotation(self):
    self.rotation[0] += 90
    self.rotation = [radians(r) for r in self.rotation]

  def create(self):
    bpy.ops.object.add(
      type='EMPTY',
      name = self.name,
      location = self.location,
      rotation = self.rotation)
    ob = bpy.context.object
    ob.name = self.name
        
class Camera(ObjectBase):
  def __init__(self, compObj, objectData):
    super(Camera, self).__init__(compObj, objectData)
    self.pointOfInterest = objectData['transforms']['pointOfInterest']
    self.zoom = objectData['cameraOptions']['zoom']
    self.aperture = objectData['cameraOptions']['aperture']
    self.focusDistance = objectData['cameraOptions']['focusDistance']

  def create(self):
    bpy.ops.object.camera_add(
      location = self.location,
      rotation = self.rotation)
    ob = bpy.context.object
    ob.name = self.name

class Light(ObjectBase):
  def __init__(self, compObj, objectData):
    super(Light, self).__init__(compObj, objectData)

  def create(self):
    bpy.ops.object.lamp_add(
      type='POINT',
      location = self.location,
      rotation = self.rotation)
    ob = bpy.context.object
    ob.name = self.name

class Null(ObjectBase):
  def __init__(self, compObj, objectData):
    super(Null, self).__init__(compObj, objectData)
    self.anchorPoint = objectData['transforms']['anchorPoint']

  def create(self):
    bpy.ops.object.add(
      type = 'EMPTY',
      location = self.location,
      rotation = self.rotation)
    ob = bpy.context.object
    ob.name = self.name

class Mesh(Null):

  def create(self):
    bpy.ops.object.add(
      type = 'MESH',
      location = self.location,
      rotation = self.rotation)
    ob = bpy.context.object
    ob.name = self.name

def run():
  comp = Comp(json_data['compSettings'])
  for data in json_data:
    obj = json_data[data]
    if(data == 'cameras'):
      for camera in obj:
        cameraObj = Camera(comp, obj[camera])
        cameraObj.create()
    elif(data == 'objects'):
      for item in obj:
        meshObj = Mesh(comp, obj[item])
        meshObj.create()
    elif(data == 'lights'):
      for light in obj:
        lightObj = Light(comp, obj[light])
        lightObj.create()
    elif(data == 'nulls'):
      for null in obj:
        nullObj = Null(comp, obj[null])
        nullObj.create()
    
run();